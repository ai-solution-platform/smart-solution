import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

interface RouteParams {
  params: { id: string };
}

// ---------------------------------------------------------------------------
// GET - Get complaint by ID or tracking number
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Try finding by tracking number first, then by ID
    const complaint = await prisma.complaint.findFirst({
      where: {
        OR: [{ id }, { trackingNumber: id }],
      },
      include: {
        assignedTo: { select: { id: true, name: true } },
      },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: "ไม่พบเรื่องร้องเรียนที่ต้องการ" },
        { status: 404 }
      );
    }

    // For public access, return limited info
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get("public") === "true";

    if (isPublic) {
      return NextResponse.json({
        trackingNumber: complaint.trackingNumber,
        subject: complaint.subject,
        category: complaint.category,
        status: complaint.status,
        responseNote: complaint.responseNote,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
      });
    }

    // Admin access - verify session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error("GET /api/complaints/[id] error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลเรื่องร้องเรียน" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PUT - Update complaint status (admin only)
// ---------------------------------------------------------------------------

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const existing = await prisma.complaint.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "ไม่พบเรื่องร้องเรียนที่ต้องการแก้ไข" },
        { status: 404 }
      );
    }

    // Verify tenant access
    if (existing.tenantId !== session.user.tenantId! && session.user.role! !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์แก้ไขเรื่องร้องเรียนนี้" },
        { status: 403 }
      );
    }

    // Validate status transition
    const validStatuses = ["SUBMITTED", "RECEIVED", "IN_PROGRESS", "RESOLVED", "REJECTED"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `สถานะไม่ถูกต้อง ต้องเป็น: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        status: body.status,
        responseNote: body.responseNote,
        assignedToId: body.assignedToId,
      },
      include: {
        assignedTo: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/complaints/[id] error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตเรื่องร้องเรียน" },
      { status: 500 }
    );
  }
}
