import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

interface ComplaintCreateBody {
  tenantId: string;
  name: string;
  phone?: string;
  email?: string;
  category: string;
  subject: string;
  description: string;
  location?: string;
  attachmentUrl?: string;
}

/**
 * Generate a unique tracking number in format: CMP-YYYYMMDD-XXXX
 */
function generateTrackingNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CMP-${datePart}-${randomPart}`;
}

// ---------------------------------------------------------------------------
// GET - List complaints (admin only)
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { tenantId: session.user.tenantId! };

    if (status) {
      where.status = status;
    }
    if (category) {
      where.category = category;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          assignedTo: { select: { id: true, name: true } },
        },
      }),
      prisma.complaint.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/complaints error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเรื่องร้องเรียน" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST - Submit a new complaint (public)
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body: ComplaintCreateBody = await request.json();

    // Validate required fields
    const errors: string[] = [];

    if (!body.tenantId) {
      errors.push("tenantId is required");
    }
    if (!body.name || body.name.trim().length === 0) {
      errors.push("กรุณาระบุชื่อ-นามสกุล");
    }
    if (!body.category || body.category.trim().length === 0) {
      errors.push("กรุณาระบุหมวดหมู่");
    }
    if (!body.subject || body.subject.trim().length === 0) {
      errors.push("กรุณาระบุหัวข้อเรื่อง");
    }
    if (!body.description || body.description.trim().length === 0) {
      errors.push("กรุณาระบุรายละเอียด");
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: body.tenantId },
      select: { id: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: "ไม่พบข้อมูลหน่วยงาน" }, { status: 404 });
    }

    // Generate unique tracking number with retry
    let trackingNumber = generateTrackingNumber();
    let attempts = 0;

    while (attempts < 5) {
      const existing = await prisma.complaint.findUnique({
        where: { trackingNumber },
        select: { id: true },
      });

      if (!existing) break;

      trackingNumber = generateTrackingNumber();
      attempts++;
    }

    const complaint = await prisma.complaint.create({
      data: {
        tenantId: body.tenantId,
        trackingNumber,
        name: body.name.trim(),
        phone: body.phone?.trim() || null,
        email: body.email?.trim() || null,
        category: body.category.trim(),
        subject: body.subject.trim(),
        description: body.description.trim(),
        location: body.location?.trim() || null,
        attachmentUrl: body.attachmentUrl || null,
        status: "SUBMITTED",
      },
    });

    return NextResponse.json(
      {
        id: complaint.id,
        trackingNumber: complaint.trackingNumber,
        message: "ส่งเรื่องร้องเรียนเรียบร้อยแล้ว กรุณาบันทึกหมายเลขติดตามเรื่อง",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/complaints error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการส่งเรื่องร้องเรียน" },
      { status: 500 }
    );
  }
}
