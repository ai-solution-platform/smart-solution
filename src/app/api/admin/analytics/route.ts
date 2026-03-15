import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPopulationInsights } from '@/lib/cdp';
import {
  getVisitorStats,
  getServiceUsageStats,
  getComplaintAnalytics,
} from '@/lib/analytics';
import prisma from '@/lib/prisma';

// =============================================================================
// GET /api/admin/analytics - ข้อมูลวิเคราะห์สำหรับแดชบอร์ด
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const user = session.user as { role: string; tenantId: string };
    if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 });
    }

    const tenantId = user.tenantId;
    const { searchParams } = new URL(request.url);

    const dateFrom = searchParams.get('dateFrom')
      ? new Date(searchParams.get('dateFrom')!)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dateTo = searchParams.get('dateTo')
      ? new Date(searchParams.get('dateTo')!)
      : new Date();

    // Fetch all data in parallel
    const [population, visitors, services, complaints, totalPageViews, topDocuments] =
      await Promise.all([
        getPopulationInsights(tenantId),
        getVisitorStats(tenantId, { from: dateFrom, to: dateTo }),
        getServiceUsageStats(tenantId),
        getComplaintAnalytics(tenantId),
        prisma.visitorLog.count({ where: { tenantId } }),
        prisma.document.findMany({
          where: { tenantId, isPublished: true },
          select: { title: true, downloadCount: true },
          orderBy: { downloadCount: 'desc' },
          take: 10,
        }),
      ]);

    return NextResponse.json({
      overview: {
        totalCitizens: population.totalRegistered,
        activeUsers30d: population.totalActive30Days,
        totalPageViews,
        totalServiceUsage: services.totalServiceRequests,
      },
      population: {
        registrationsByMonth: population.registrationsByMonth,
        ageGroups: population.ageGroups,
        subdistrictDistribution: population.subdistrictDistribution,
        providerBreakdown: population.providerBreakdown,
        avgLoginCount: population.avgLoginCount,
        consentMarketingRate: population.consentMarketingRate,
      },
      services: {
        serviceBreakdown: services.serviceBreakdown,
        complaintCategories: complaints.categoryBreakdown,
        avgResolutionDays: complaints.avgResolutionDays,
        resolutionRate: complaints.resolutionRate,
        topDocuments: topDocuments.map((d) => ({
          title: d.title,
          downloads: d.downloadCount,
        })),
      },
      engagement: {
        hourlyBreakdown: visitors.hourlyBreakdown,
        deviceBreakdown: visitors.deviceBreakdown,
        browserBreakdown: visitors.browserBreakdown,
        dailyBreakdown: visitors.dailyBreakdown,
      },
    });
  } catch (error) {
    console.error('GET /api/admin/analytics error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลวิเคราะห์' },
      { status: 500 }
    );
  }
}
