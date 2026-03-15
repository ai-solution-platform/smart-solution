// =============================================================================
// Analytics Helper - ระบบวิเคราะห์ข้อมูลสำหรับแดชบอร์ดผู้ดูแลระบบ
// =============================================================================

import prisma from '@/lib/prisma';

// =============================================================================
// Types
// =============================================================================

export interface DateRange {
  from: Date;
  to: Date;
}

export interface VisitorStats {
  totalVisitors: number;
  uniquePaths: number;
  todayVisitors: number;
  thisWeekVisitors: number;
  thisMonthVisitors: number;
  dailyBreakdown: { date: string; count: number }[];
  hourlyBreakdown: { hour: number; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
}

export interface PopularPage {
  path: string;
  views: number;
  uniqueVisitors: number;
}

export interface ContentPerformance {
  totalNews: number;
  publishedNews: number;
  totalViews: number;
  avgViewsPerNews: number;
  topNews: { id: string; title: string; viewCount: number; publishedAt: Date | null }[];
  categoryBreakdown: { category: string; count: number; totalViews: number }[];
}

export interface ServiceUsageStats {
  totalServiceRequests: number;
  completedRequests: number;
  pendingRequests: number;
  serviceBreakdown: { serviceType: string; count: number; completionRate: number }[];
  monthlyTrend: { month: string; count: number }[];
}

export interface DemographicBreakdown {
  ageGroups: { group: string; count: number; percentage: number }[];
  areas: { area: string; count: number; percentage: number }[];
  genderDistribution: { gender: string; count: number }[];
  verificationStatus: {
    phoneVerified: number;
    emailVerified: number;
    bothVerified: number;
    noneVerified: number;
  };
}

export interface ComplaintAnalytics {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  avgResolutionDays: number;
  categoryBreakdown: { category: string; count: number; resolvedCount: number }[];
  statusBreakdown: { status: string; count: number }[];
  monthlyTrend: { month: string; submitted: number; resolved: number }[];
  resolutionRate: number;
}

// =============================================================================
// Helper Utilities
// =============================================================================

function parseUserAgent(userAgent: string): { device: string; browser: string } {
  let device = 'อื่นๆ';
  let browser = 'อื่นๆ';

  // Device detection
  if (/mobile|android|iphone|ipad/i.test(userAgent)) {
    if (/ipad|tablet/i.test(userAgent)) device = 'แท็บเล็ต';
    else device = 'มือถือ';
  } else if (/bot|crawler|spider/i.test(userAgent)) {
    device = 'บอท';
  } else {
    device = 'คอมพิวเตอร์';
  }

  // Browser detection
  if (/chrome/i.test(userAgent) && !/edge|opr/i.test(userAgent)) browser = 'Chrome';
  else if (/firefox/i.test(userAgent)) browser = 'Firefox';
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
  else if (/edge/i.test(userAgent)) browser = 'Edge';
  else if (/opr|opera/i.test(userAgent)) browser = 'Opera';
  else if (/line/i.test(userAgent)) browser = 'LINE Browser';

  return { device, browser };
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short' });
}

// =============================================================================
// Analytics Functions
// =============================================================================

/**
 * สถิติผู้เข้าชม
 */
export async function getVisitorStats(
  tenantId: string,
  dateRange: DateRange
): Promise<VisitorStats> {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const logs = await prisma.visitorLog.findMany({
      where: {
        tenantId,
        createdAt: { gte: dateRange.from, lte: dateRange.to },
      },
      select: {
        path: true,
        userAgent: true,
        createdAt: true,
      },
    });

    const [todayVisitors, thisWeekVisitors, thisMonthVisitors] = await Promise.all([
      prisma.visitorLog.count({
        where: { tenantId, createdAt: { gte: todayStart } },
      }),
      prisma.visitorLog.count({
        where: { tenantId, createdAt: { gte: weekStart } },
      }),
      prisma.visitorLog.count({
        where: { tenantId, createdAt: { gte: monthStart } },
      }),
    ]);

    const uniquePaths = new Set(logs.map((l) => l.path)).size;

    // Daily breakdown
    const dailyMap = new Map<string, number>();
    for (const log of logs) {
      const dateKey = log.createdAt.toISOString().split('T')[0];
      dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
    }
    const dailyBreakdown = Array.from(dailyMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Hourly breakdown
    const hourlyMap = new Map<number, number>();
    for (let h = 0; h < 24; h++) hourlyMap.set(h, 0);
    for (const log of logs) {
      const hour = log.createdAt.getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
    }
    const hourlyBreakdown = Array.from(hourlyMap.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour);

    // Device & browser breakdown
    const deviceMap = new Map<string, number>();
    const browserMap = new Map<string, number>();
    for (const log of logs) {
      if (log.userAgent) {
        const { device, browser } = parseUserAgent(log.userAgent);
        deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
        browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
      }
    }

    return {
      totalVisitors: logs.length,
      uniquePaths,
      todayVisitors,
      thisWeekVisitors,
      thisMonthVisitors,
      dailyBreakdown,
      hourlyBreakdown,
      deviceBreakdown: Array.from(deviceMap.entries())
        .map(([device, count]) => ({ device, count }))
        .sort((a, b) => b.count - a.count),
      browserBreakdown: Array.from(browserMap.entries())
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count),
    };
  } catch (error) {
    console.error('[Analytics] getVisitorStats error:', error);
    return {
      totalVisitors: 0,
      uniquePaths: 0,
      todayVisitors: 0,
      thisWeekVisitors: 0,
      thisMonthVisitors: 0,
      dailyBreakdown: [],
      hourlyBreakdown: [],
      deviceBreakdown: [],
      browserBreakdown: [],
    };
  }
}

/**
 * หน้าเว็บที่มีผู้เข้าชมมากที่สุด
 */
export async function getPopularPages(
  tenantId: string,
  limit: number = 20
): Promise<PopularPage[]> {
  try {
    const grouped = await prisma.visitorLog.groupBy({
      by: ['path'],
      where: { tenantId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    return grouped.map((g) => ({
      path: g.path,
      views: g._count.id,
      uniqueVisitors: g._count.id, // Approximation without IP tracking
    }));
  } catch (error) {
    console.error('[Analytics] getPopularPages error:', error);
    return [];
  }
}

/**
 * ประสิทธิภาพเนื้อหา (ข่าวสาร/ประชาสัมพันธ์)
 */
export async function getContentPerformance(tenantId: string): Promise<ContentPerformance> {
  try {
    const [totalNews, publishedNews, news] = await Promise.all([
      prisma.news.count({ where: { tenantId } }),
      prisma.news.count({ where: { tenantId, isPublished: true } }),
      prisma.news.findMany({
        where: { tenantId, isPublished: true },
        select: {
          id: true,
          title: true,
          viewCount: true,
          category: true,
          publishedAt: true,
        },
        orderBy: { viewCount: 'desc' },
      }),
    ]);

    const totalViews = news.reduce((sum, n) => sum + n.viewCount, 0);
    const avgViewsPerNews = publishedNews > 0 ? Math.round(totalViews / publishedNews) : 0;

    // Category breakdown
    const categoryMap = new Map<string, { count: number; totalViews: number }>();
    for (const n of news) {
      const cat = n.category;
      const existing = categoryMap.get(cat) || { count: 0, totalViews: 0 };
      existing.count++;
      existing.totalViews += n.viewCount;
      categoryMap.set(cat, existing);
    }

    const categoryLabels: Record<string, string> = {
      NEWS: 'ข่าวสาร',
      ANNOUNCEMENT: 'ประกาศ',
      PR: 'ประชาสัมพันธ์',
    };

    return {
      totalNews,
      publishedNews,
      totalViews,
      avgViewsPerNews,
      topNews: news.slice(0, 10).map((n) => ({
        id: n.id,
        title: n.title,
        viewCount: n.viewCount,
        publishedAt: n.publishedAt,
      })),
      categoryBreakdown: Array.from(categoryMap.entries()).map(([category, data]) => ({
        category: categoryLabels[category] || category,
        count: data.count,
        totalViews: data.totalViews,
      })),
    };
  } catch (error) {
    console.error('[Analytics] getContentPerformance error:', error);
    return {
      totalNews: 0,
      publishedNews: 0,
      totalViews: 0,
      avgViewsPerNews: 0,
      topNews: [],
      categoryBreakdown: [],
    };
  }
}

/**
 * สถิติการใช้บริการ e-Service
 */
export async function getServiceUsageStats(tenantId: string): Promise<ServiceUsageStats> {
  try {
    const activities = await prisma.citizenActivity.findMany({
      where: { tenantId, type: 'SERVICE_USAGE' },
      select: { metadata: true, createdAt: true },
    });

    const serviceMap = new Map<string, { total: number; completed: number }>();
    let completedRequests = 0;

    for (const activity of activities) {
      const meta = activity.metadata ? JSON.parse(activity.metadata) : {};
      const serviceType = meta.serviceType || 'ไม่ระบุ';
      const status = meta.status || '';

      const existing = serviceMap.get(serviceType) || { total: 0, completed: 0 };
      existing.total++;
      if (status === 'COMPLETED' || status === 'completed') {
        existing.completed++;
        completedRequests++;
      }
      serviceMap.set(serviceType, existing);
    }

    // Monthly trend (last 12 months)
    const now = new Date();
    const monthlyTrend: { month: string; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = activities.filter(
        (a) => a.createdAt >= monthStart && a.createdAt < monthEnd
      ).length;
      monthlyTrend.push({ month: getMonthLabel(monthStart), count });
    }

    return {
      totalServiceRequests: activities.length,
      completedRequests,
      pendingRequests: activities.length - completedRequests,
      serviceBreakdown: Array.from(serviceMap.entries())
        .map(([serviceType, data]) => ({
          serviceType,
          count: data.total,
          completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count),
      monthlyTrend,
    };
  } catch (error) {
    console.error('[Analytics] getServiceUsageStats error:', error);
    return {
      totalServiceRequests: 0,
      completedRequests: 0,
      pendingRequests: 0,
      serviceBreakdown: [],
      monthlyTrend: [],
    };
  }
}

/**
 * ข้อมูลประชากรศาสตร์
 */
export async function getDemographicBreakdown(tenantId: string): Promise<DemographicBreakdown> {
  try {
    const citizens = await prisma.citizen.findMany({
      where: { tenantId },
      select: {
        birthDate: true,
        subdistrict: true,
        isPhoneVerified: true,
        isEmailVerified: true,
      },
    });

    const total = citizens.length || 1;
    const now = new Date();

    // Age groups
    const ageMap: Record<string, number> = {
      'ต่ำกว่า 18 ปี': 0,
      '18-30 ปี': 0,
      '31-50 ปี': 0,
      '51-60 ปี': 0,
      '60+ ปี': 0,
      'ไม่ระบุ': 0,
    };

    for (const c of citizens) {
      if (!c.birthDate) {
        ageMap['ไม่ระบุ']++;
        continue;
      }
      const age = Math.floor(
        (now.getTime() - c.birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      );
      if (age < 18) ageMap['ต่ำกว่า 18 ปี']++;
      else if (age <= 30) ageMap['18-30 ปี']++;
      else if (age <= 50) ageMap['31-50 ปี']++;
      else if (age <= 60) ageMap['51-60 ปี']++;
      else ageMap['60+ ปี']++;
    }

    // Area distribution
    const areaMap = new Map<string, number>();
    for (const c of citizens) {
      const area = c.subdistrict || 'ไม่ระบุ';
      areaMap.set(area, (areaMap.get(area) || 0) + 1);
    }

    // Verification
    let phoneVerified = 0;
    let emailVerified = 0;
    let bothVerified = 0;
    let noneVerified = 0;

    for (const c of citizens) {
      if (c.isPhoneVerified && c.isEmailVerified) bothVerified++;
      else if (c.isPhoneVerified) phoneVerified++;
      else if (c.isEmailVerified) emailVerified++;
      else noneVerified++;
    }

    return {
      ageGroups: Object.entries(ageMap).map(([group, count]) => ({
        group,
        count,
        percentage: Math.round((count / total) * 100),
      })),
      areas: Array.from(areaMap.entries())
        .map(([area, count]) => ({
          area,
          count,
          percentage: Math.round((count / total) * 100),
        }))
        .sort((a, b) => b.count - a.count),
      genderDistribution: [], // Not tracked in current schema
      verificationStatus: {
        phoneVerified,
        emailVerified,
        bothVerified,
        noneVerified,
      },
    };
  } catch (error) {
    console.error('[Analytics] getDemographicBreakdown error:', error);
    return {
      ageGroups: [],
      areas: [],
      genderDistribution: [],
      verificationStatus: {
        phoneVerified: 0,
        emailVerified: 0,
        bothVerified: 0,
        noneVerified: 0,
      },
    };
  }
}

/**
 * วิเคราะห์เรื่องร้องเรียน
 */
export async function getComplaintAnalytics(tenantId: string): Promise<ComplaintAnalytics> {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { tenantId },
      select: {
        category: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = complaints.length;
    const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
    const pending = complaints.filter(
      (c) => c.status !== 'RESOLVED' && c.status !== 'REJECTED'
    ).length;

    // Avg resolution time
    const resolvedComplaints = complaints.filter((c) => c.status === 'RESOLVED');
    let totalResolutionDays = 0;
    for (const c of resolvedComplaints) {
      const days =
        (c.updatedAt.getTime() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      totalResolutionDays += days;
    }
    const avgResolutionDays =
      resolvedComplaints.length > 0
        ? Math.round((totalResolutionDays / resolvedComplaints.length) * 10) / 10
        : 0;

    // Category breakdown
    const categoryMap = new Map<string, { count: number; resolved: number }>();
    for (const c of complaints) {
      const existing = categoryMap.get(c.category) || { count: 0, resolved: 0 };
      existing.count++;
      if (c.status === 'RESOLVED') existing.resolved++;
      categoryMap.set(c.category, existing);
    }

    // Status breakdown
    const statusMap = new Map<string, number>();
    const statusLabels: Record<string, string> = {
      SUBMITTED: 'ยื่นเรื่อง',
      RECEIVED: 'รับเรื่องแล้ว',
      IN_PROGRESS: 'กำลังดำเนินการ',
      RESOLVED: 'แก้ไขแล้ว',
      REJECTED: 'ปฏิเสธ',
    };
    for (const c of complaints) {
      const label = statusLabels[c.status] || c.status;
      statusMap.set(label, (statusMap.get(label) || 0) + 1);
    }

    // Monthly trend (last 12 months)
    const now = new Date();
    const monthlyTrend: { month: string; submitted: number; resolved: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const submitted = complaints.filter(
        (c) => c.createdAt >= monthStart && c.createdAt < monthEnd
      ).length;
      const monthResolved = complaints.filter(
        (c) =>
          c.status === 'RESOLVED' &&
          c.updatedAt >= monthStart &&
          c.updatedAt < monthEnd
      ).length;

      monthlyTrend.push({
        month: getMonthLabel(monthStart),
        submitted,
        resolved: monthResolved,
      });
    }

    return {
      totalComplaints: total,
      resolvedComplaints: resolved,
      pendingComplaints: pending,
      avgResolutionDays,
      categoryBreakdown: Array.from(categoryMap.entries())
        .map(([category, data]) => ({
          category,
          count: data.count,
          resolvedCount: data.resolved,
        }))
        .sort((a, b) => b.count - a.count),
      statusBreakdown: Array.from(statusMap.entries())
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count),
      monthlyTrend,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    };
  } catch (error) {
    console.error('[Analytics] getComplaintAnalytics error:', error);
    return {
      totalComplaints: 0,
      resolvedComplaints: 0,
      pendingComplaints: 0,
      avgResolutionDays: 0,
      categoryBreakdown: [],
      statusBreakdown: [],
      monthlyTrend: [],
      resolutionRate: 0,
    };
  }
}

// =============================================================================
// Export Utilities
// =============================================================================

/**
 * แปลงข้อมูลเป็น JSON พร้อมสำหรับส่งไปยังแดชบอร์ด
 */
export function exportAsJSON(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

/**
 * แปลงข้อมูลเป็น CSV
 */
export function exportAsCSV(data: Record<string, unknown>[], headers?: string[]): string {
  if (data.length === 0) return '';

  const keys = headers || Object.keys(data[0]);
  const csvRows: string[] = [];

  // Header row
  csvRows.push(keys.join(','));

  // Data rows
  for (const row of data) {
    const values = keys.map((key) => {
      const val = row[key];
      if (val === null || val === undefined) return '';
      const str = String(val);
      // Escape commas and quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    csvRows.push(values.join(','));
  }

  // Add BOM for Thai character support in Excel
  return '\uFEFF' + csvRows.join('\n');
}
