import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ============================================================================
// Notification Subscription / Preferences API
// ============================================================================

type NotificationChannel = "IN_APP" | "EMAIL" | "LINE";

type NotificationCategory =
  | "NEWS_ANNOUNCEMENT"
  | "COMPLAINT_STATUS"
  | "E_SERVICE"
  | "COMMUNITY_EVENT";

interface SubscriptionPreference {
  category: NotificationCategory;
  enabled: boolean;
  channels: NotificationChannel[];
}

interface SubscribeBody {
  citizenId: string;
  tenantId: string;
  preferences: SubscriptionPreference[];
}

// ---------------------------------------------------------------------------
// Helper: Extract citizen ID from request headers
// ---------------------------------------------------------------------------
function getCitizenIdFromRequest(request: NextRequest): string | null {
  return (
    request.headers.get("x-citizen-id") ||
    request.nextUrl.searchParams.get("citizenId") ||
    null
  );
}

// ---------------------------------------------------------------------------
// GET - Fetch current notification preferences for a citizen
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const citizenId = getCitizenIdFromRequest(request);

    if (!citizenId) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบเพื่อดูการตั้งค่าการแจ้งเตือน" },
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

    const subscriptions = await prisma.notificationSubscription.findMany({
      where: { citizenId },
    });

    // If no preferences exist yet, return defaults
    if (subscriptions.length === 0) {
      const defaults: SubscriptionPreference[] = [
        {
          category: "NEWS_ANNOUNCEMENT",
          enabled: true,
          channels: ["IN_APP"],
        },
        {
          category: "COMPLAINT_STATUS",
          enabled: true,
          channels: ["IN_APP", "EMAIL"],
        },
        {
          category: "E_SERVICE",
          enabled: true,
          channels: ["IN_APP"],
        },
        {
          category: "COMMUNITY_EVENT",
          enabled: true,
          channels: ["IN_APP"],
        },
      ];

      return NextResponse.json({
        citizenId,
        tenantId: citizen.tenantId,
        preferences: defaults,
        isDefault: true,
      });
    }

    const preferences: SubscriptionPreference[] = subscriptions.map((sub) => ({
      category: sub.category as NotificationCategory,
      enabled: sub.enabled,
      channels: JSON.parse(sub.channels) as NotificationChannel[],
    }));

    return NextResponse.json({
      citizenId,
      tenantId: citizen.tenantId,
      preferences,
      isDefault: false,
    });
  } catch (error) {
    console.error("GET /api/notifications/subscribe error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่า" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST - Create or update notification subscription preferences
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const citizenId = getCitizenIdFromRequest(request);

    if (!citizenId) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบเพื่อตั้งค่าการแจ้งเตือน" },
        { status: 401 }
      );
    }

    const body: SubscribeBody = await request.json();

    // Verify citizen matches the requesting user
    if (body.citizenId !== citizenId) {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์แก้ไขการตั้งค่าของผู้อื่น" },
        { status: 403 }
      );
    }

    // Validate
    const errors: string[] = [];

    if (!body.tenantId) {
      errors.push("กรุณาระบุหน่วยงาน");
    }

    if (!body.preferences || !Array.isArray(body.preferences)) {
      errors.push("กรุณาระบุการตั้งค่าการแจ้งเตือน");
    }

    const validCategories: NotificationCategory[] = [
      "NEWS_ANNOUNCEMENT",
      "COMPLAINT_STATUS",
      "E_SERVICE",
      "COMMUNITY_EVENT",
    ];

    const validChannels: NotificationChannel[] = ["IN_APP", "EMAIL", "LINE"];

    if (body.preferences) {
      for (const pref of body.preferences) {
        if (!validCategories.includes(pref.category)) {
          errors.push(`ประเภทไม่ถูกต้อง: ${pref.category}`);
        }
        if (pref.channels) {
          for (const ch of pref.channels) {
            if (!validChannels.includes(ch)) {
              errors.push(`ช่องทางไม่ถูกต้อง: ${ch}`);
            }
          }
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Verify citizen exists
    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenId },
      select: { id: true },
    });

    if (!citizen) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้งาน" },
        { status: 404 }
      );
    }

    // Upsert each preference
    const results = await Promise.all(
      body.preferences.map((pref) =>
        prisma.notificationSubscription.upsert({
          where: {
            citizenId_category: {
              citizenId,
              category: pref.category,
            },
          },
          create: {
            citizenId,
            tenantId: body.tenantId,
            category: pref.category,
            enabled: pref.enabled,
            channels: JSON.stringify(pref.channels),
          },
          update: {
            enabled: pref.enabled,
            channels: JSON.stringify(pref.channels),
            updatedAt: new Date(),
          },
        })
      )
    );

    return NextResponse.json({
      message: "บันทึกการตั้งค่าการแจ้งเตือนสำเร็จ",
      updatedCount: results.length,
    });
  } catch (error) {
    console.error("POST /api/notifications/subscribe error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกการตั้งค่า" },
      { status: 500 }
    );
  }
}
