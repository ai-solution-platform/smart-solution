import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType =
  | "COMPLAINT_UPDATE"
  | "NEWS"
  | "ANNOUNCEMENT"
  | "SERVICE_STATUS"
  | "COMMUNITY_EVENT";

interface NotificationCreateBody {
  citizenId: string;
  tenantId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  linkEntity?: string;
  linkEntityId?: string;
}

interface NotificationMarkReadBody {
  notificationIds?: string[];
  markAll?: boolean;
  citizenId: string;
}

// ---------------------------------------------------------------------------
// Helper: Extract citizen ID from request headers (citizen auth)
// In production this would validate a JWT token for citizen sessions
// ---------------------------------------------------------------------------
function getCitizenIdFromRequest(request: NextRequest): string | null {
  return (
    request.headers.get("x-citizen-id") ||
    request.nextUrl.searchParams.get("citizenId") ||
    null
  );
}

// ---------------------------------------------------------------------------
// GET - Fetch notifications for a citizen
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const citizenId = getCitizenIdFromRequest(request);

    if (!citizenId) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบเพื่อดูการแจ้งเตือน" },
        { status: 401 }
      );
    }

    // Verify citizen exists
    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenId },
      select: { id: true, tenantId: true },
    });

    if (!citizen) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้งาน" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    );
    const isRead = searchParams.get("isRead"); // "true" | "false" | null
    const type = searchParams.get("type"); // NotificationType | null

    // Build where clause
    const where: Record<string, unknown> = {
      citizenId,
      tenantId: citizen.tenantId,
    };

    if (isRead === "true") {
      where.isRead = true;
    } else if (isRead === "false") {
      where.isRead = false;
    }

    if (type) {
      where.type = type;
    }

    const skip = (page - 1) * limit;

    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          citizenId,
          tenantId: citizen.tenantId,
          isRead: false,
        },
      }),
    ]);

    return NextResponse.json({
      items,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST - Create a notification (admin only)
// Used for complaint updates, announcements, service status, etc.
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบผู้ดูแลระบบ" },
        { status: 401 }
      );
    }

    // Only ADMIN and SUPER_ADMIN can create notifications
    if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role!)) {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์สร้างการแจ้งเตือน" },
        { status: 403 }
      );
    }

    const body: NotificationCreateBody = await request.json();

    // Validate required fields
    const errors: string[] = [];

    if (!body.citizenId) {
      errors.push("กรุณาระบุผู้รับการแจ้งเตือน");
    }
    if (!body.tenantId) {
      errors.push("กรุณาระบุหน่วยงาน");
    }
    if (!body.type) {
      errors.push("กรุณาระบุประเภทการแจ้งเตือน");
    }
    if (!body.title || body.title.trim().length === 0) {
      errors.push("กรุณาระบุหัวข้อการแจ้งเตือน");
    }
    if (!body.message || body.message.trim().length === 0) {
      errors.push("กรุณาระบุข้อความการแจ้งเตือน");
    }

    const validTypes: NotificationType[] = [
      "COMPLAINT_UPDATE",
      "NEWS",
      "ANNOUNCEMENT",
      "SERVICE_STATUS",
      "COMMUNITY_EVENT",
    ];
    if (body.type && !validTypes.includes(body.type)) {
      errors.push(
        `ประเภทการแจ้งเตือนไม่ถูกต้อง (${validTypes.join(", ")})`
      );
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Verify citizen exists
    const citizen = await prisma.citizen.findUnique({
      where: { id: body.citizenId },
      select: { id: true },
    });

    if (!citizen) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลประชาชนที่ระบุ" },
        { status: 404 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        citizenId: body.citizenId,
        tenantId: body.tenantId,
        type: body.type,
        title: body.title.trim(),
        message: body.message.trim(),
        linkUrl: body.linkUrl || null,
        linkEntity: body.linkEntity || null,
        linkEntityId: body.linkEntityId || null,
        isRead: false,
      },
    });

    return NextResponse.json(
      {
        id: notification.id,
        message: "สร้างการแจ้งเตือนสำเร็จ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างการแจ้งเตือน" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PUT - Mark notification(s) as read
// ---------------------------------------------------------------------------

export async function PUT(request: NextRequest) {
  try {
    const citizenId = getCitizenIdFromRequest(request);

    if (!citizenId) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบเพื่อจัดการการแจ้งเตือน" },
        { status: 401 }
      );
    }

    const body: NotificationMarkReadBody = await request.json();

    if (body.citizenId !== citizenId) {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์จัดการการแจ้งเตือนของผู้อื่น" },
        { status: 403 }
      );
    }

    if (body.markAll) {
      // Mark all unread notifications as read
      const result = await prisma.notification.updateMany({
        where: {
          citizenId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return NextResponse.json({
        message: `อ่านการแจ้งเตือนทั้งหมดแล้ว (${result.count} รายการ)`,
        updatedCount: result.count,
      });
    }

    if (body.notificationIds && body.notificationIds.length > 0) {
      // Mark specific notifications as read
      const result = await prisma.notification.updateMany({
        where: {
          id: { in: body.notificationIds },
          citizenId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return NextResponse.json({
        message: `อ่านการแจ้งเตือน ${result.count} รายการแล้ว`,
        updatedCount: result.count,
      });
    }

    return NextResponse.json(
      { error: "กรุณาระบุ notificationIds หรือ markAll" },
      { status: 400 }
    );
  } catch (error) {
    console.error("PUT /api/notifications error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตการแจ้งเตือน" },
      { status: 500 }
    );
  }
}
