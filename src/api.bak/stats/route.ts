import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// GET - Visitor statistics
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId is required" }, { status: 400 });
    }

    const now = new Date();

    // Start of today (midnight local time approximation - UTC)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Start of this month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Start of this year
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const [todayCount, monthCount, yearCount, totalCount] = await Promise.all([
      prisma.visitorLog.count({
        where: {
          tenantId,
          createdAt: { gte: todayStart },
        },
      }),
      prisma.visitorLog.count({
        where: {
          tenantId,
          createdAt: { gte: monthStart },
        },
      }),
      prisma.visitorLog.count({
        where: {
          tenantId,
          createdAt: { gte: yearStart },
        },
      }),
      prisma.visitorLog.count({
        where: { tenantId },
      }),
    ]);

    // Top pages this month
    const topPages = await prisma.visitorLog.groupBy({
      by: ["path"],
      where: {
        tenantId,
        createdAt: { gte: monthStart },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    return NextResponse.json({
      today: todayCount,
      thisMonth: monthCount,
      thisYear: yearCount,
      total: totalCount,
      topPages: topPages.map((p) => ({
        path: p.path,
        views: p._count.id,
      })),
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST - Log a visitor
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.tenantId || !body.path) {
      return NextResponse.json(
        { error: "tenantId and path are required" },
        { status: 400 }
      );
    }

    // Extract headers
    const userAgent = request.headers.get("user-agent") || null;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const referer = request.headers.get("referer") || null;

    const log = await prisma.visitorLog.create({
      data: {
        tenantId: body.tenantId,
        path: body.path,
        userAgent,
        ip,
        referer,
      },
    });

    return NextResponse.json({ id: log.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/stats error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกสถิติ" }, { status: 500 });
  }
}
