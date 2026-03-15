// =============================================================================
// CDP (City Data Platform) - Tracking Service
// ระบบติดตามข้อมูลพลเมืองสำหรับองค์กรปกครองส่วนท้องถิ่น
// Privacy-first approach following PDPA (พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล)
// =============================================================================

import prisma from '@/lib/prisma';
import crypto from 'crypto';

// =============================================================================
// Types
// =============================================================================

export interface PageViewParams {
  citizenId?: string;
  tenantId: string;
  path: string;
  metadata?: Record<string, unknown>;
}

export interface ActivityParams {
  citizenId: string;
  tenantId: string;
  type: string;
  action: string;
  metadata?: Record<string, unknown>;
}

export interface FormSubmissionParams {
  citizenId?: string;
  tenantId: string;
  formType: string;
  formData: Record<string, unknown>;
}

export interface ServiceUsageParams {
  citizenId: string;
  tenantId: string;
  serviceType: string;
  status: string;
}

export interface DownloadParams {
  citizenId?: string;
  tenantId: string;
  documentId: string;
  documentTitle: string;
}

export interface CitizenProfile360 {
  citizen: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    avatar: string | null;
    subdistrict: string | null;
    district: string | null;
    province: string | null;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isActive: boolean;
    loginCount: number;
    lastLoginAt: Date | null;
    createdAt: Date;
  };
  socialAccounts: {
    provider: string;
    providerName: string | null;
    providerEmail: string | null;
    createdAt: Date;
  }[];
  recentActivities: {
    type: string;
    action: string;
    metadata: Record<string, unknown> | null;
    createdAt: Date;
  }[];
  complaints: {
    id: string;
    trackingNumber: string;
    category: string;
    subject: string;
    status: string;
    createdAt: Date;
  }[];
  contactSubmissions: {
    id: string;
    subject: string;
    status: string;
    createdAt: Date;
  }[];
  consents: {
    consentType: string;
    isGranted: boolean;
    grantedAt: Date;
    revokedAt: Date | null;
    version: string;
  }[];
  stats: {
    totalActivities: number;
    totalComplaints: number;
    totalDownloads: number;
    totalFormSubmissions: number;
    totalPageViews: number;
    daysSinceRegistration: number;
    avgSessionsPerMonth: number;
  };
}

export interface CitizenSegment {
  segmentName: string;
  segmentNameTh: string;
  count: number;
  citizenIds: string[];
}

export interface PopulationInsights {
  totalRegistered: number;
  totalActive30Days: number;
  totalPhoneVerified: number;
  totalEmailVerified: number;
  registrationsByMonth: { month: string; count: number }[];
  ageGroups: { group: string; count: number }[];
  subdistrictDistribution: { subdistrict: string; count: number }[];
  providerBreakdown: { provider: string; count: number }[];
  avgLoginCount: number;
  consentMarketingRate: number;
}

export type ActivityType =
  | 'PAGE_VIEW'
  | 'FORM_SUBMISSION'
  | 'SERVICE_USAGE'
  | 'DOWNLOAD'
  | 'LOGIN'
  | 'COMPLAINT'
  | 'CONTACT'
  | 'PROFILE_UPDATE';

// =============================================================================
// Privacy Utilities
// =============================================================================

const PII_FIELDS = [
  'idCard',
  'nationalId',
  'citizenId',
  'idCardNumber',
  'password',
  'pin',
  'bankAccount',
  'creditCard',
  'ssn',
  'เลขบัตรประชาชน',
  'รหัสผ่าน',
  'บัญชีธนาคาร',
];

/**
 * Hash sensitive data using SHA-256
 */
function hashSensitiveData(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex').substring(0, 16);
}

/**
 * Sanitize PII from form data before storing
 * แปลงข้อมูลส่วนบุคคลให้เป็น hash ก่อนจัดเก็บ
 */
function sanitizeFormData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();

    if (PII_FIELDS.some((field) => lowerKey.includes(field.toLowerCase()))) {
      sanitized[key] = typeof value === 'string' ? `[HASHED:${hashSensitiveData(value)}]` : '[REDACTED]';
    } else if (typeof value === 'string' && /^\d{13}$/.test(value)) {
      // Thai national ID pattern (13 digits)
      sanitized[key] = `[HASHED:${hashSensitiveData(value)}]`;
    } else if (typeof value === 'string' && /^\d{10}$/.test(value)) {
      // Thai phone number pattern (10 digits)
      sanitized[key] = value.substring(0, 3) + '****' + value.substring(7);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeFormData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Check if citizen has given consent for data collection
 * ตรวจสอบความยินยอมในการเก็บข้อมูล (PDPA)
 */
async function checkConsent(citizenId: string): Promise<boolean> {
  const citizen = await prisma.citizen.findUnique({
    where: { id: citizenId },
    select: { consentDataCollection: true, isActive: true },
  });

  return citizen?.consentDataCollection === true && citizen?.isActive === true;
}

// =============================================================================
// Tracking Functions
// =============================================================================

/**
 * บันทึกการเข้าชมหน้าเว็บ
 */
export async function trackPageView({ citizenId, tenantId, path, metadata }: PageViewParams): Promise<void> {
  try {
    // Always log to VisitorLog (anonymous)
    await prisma.visitorLog.create({
      data: {
        tenantId,
        path,
        userAgent: (metadata?.userAgent as string) || null,
        ip: (metadata?.ip as string) || null,
        referer: (metadata?.referer as string) || null,
      },
    });

    // If citizen is identified and has consent, log to CitizenActivity
    if (citizenId) {
      const hasConsent = await checkConsent(citizenId);
      if (hasConsent) {
        await prisma.citizenActivity.create({
          data: {
            citizenId,
            tenantId,
            type: 'PAGE_VIEW',
            action: `เข้าชมหน้า: ${path}`,
            metadata: JSON.stringify({
              path,
              ...(metadata?.deviceType ? { deviceType: metadata.deviceType } : {}),
              ...(metadata?.referrer ? { referrer: metadata.referrer } : {}),
              timestamp: new Date().toISOString(),
            }),
          },
        });
      }
    }
  } catch (error) {
    console.error('[CDP] trackPageView error:', error);
  }
}

/**
 * บันทึกกิจกรรมของพลเมือง
 */
export async function trackActivity({ citizenId, tenantId, type, action, metadata }: ActivityParams): Promise<void> {
  try {
    const hasConsent = await checkConsent(citizenId);
    if (!hasConsent) {
      console.warn(`[CDP] Citizen ${citizenId} has not consented to data collection`);
      return;
    }

    await prisma.citizenActivity.create({
      data: {
        citizenId,
        tenantId,
        type,
        action,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error('[CDP] trackActivity error:', error);
  }
}

/**
 * บันทึกการส่งแบบฟอร์ม (sanitize ข้อมูลส่วนบุคคลก่อนจัดเก็บ)
 */
export async function trackFormSubmission({
  citizenId,
  tenantId,
  formType,
  formData,
}: FormSubmissionParams): Promise<void> {
  try {
    const sanitizedData = sanitizeFormData(formData);

    if (citizenId) {
      const hasConsent = await checkConsent(citizenId);
      if (!hasConsent) return;

      await prisma.citizenActivity.create({
        data: {
          citizenId,
          tenantId,
          type: 'FORM_SUBMISSION',
          action: `ส่งแบบฟอร์ม: ${formType}`,
          metadata: JSON.stringify({
            formType,
            formFields: Object.keys(sanitizedData),
            sanitizedData,
            timestamp: new Date().toISOString(),
          }),
        },
      });
    }
  } catch (error) {
    console.error('[CDP] trackFormSubmission error:', error);
  }
}

/**
 * บันทึกการใช้บริการ e-Service
 */
export async function trackServiceUsage({
  citizenId,
  tenantId,
  serviceType,
  status,
}: ServiceUsageParams): Promise<void> {
  try {
    const hasConsent = await checkConsent(citizenId);
    if (!hasConsent) return;

    await prisma.citizenActivity.create({
      data: {
        citizenId,
        tenantId,
        type: 'SERVICE_USAGE',
        action: `ใช้บริการ: ${serviceType}`,
        metadata: JSON.stringify({
          serviceType,
          status,
          timestamp: new Date().toISOString(),
        }),
      },
    });
  } catch (error) {
    console.error('[CDP] trackServiceUsage error:', error);
  }
}

/**
 * บันทึกการดาวน์โหลดเอกสาร
 */
export async function trackDownload({
  citizenId,
  tenantId,
  documentId,
  documentTitle,
}: DownloadParams): Promise<void> {
  try {
    // Update download count on document
    await prisma.document.update({
      where: { id: documentId },
      data: { downloadCount: { increment: 1 } },
    }).catch(() => {
      // Document might not exist, that's okay
    });

    if (citizenId) {
      const hasConsent = await checkConsent(citizenId);
      if (!hasConsent) return;

      await prisma.citizenActivity.create({
        data: {
          citizenId,
          tenantId,
          type: 'DOWNLOAD',
          action: `ดาวน์โหลด: ${documentTitle}`,
          metadata: JSON.stringify({
            documentId,
            documentTitle,
            timestamp: new Date().toISOString(),
          }),
        },
      });
    }
  } catch (error) {
    console.error('[CDP] trackDownload error:', error);
  }
}

// =============================================================================
// Analytics & Profile Functions
// =============================================================================

/**
 * รวบรวมข้อมูลพลเมืองแบบ 360 องศา
 */
export async function getCitizenProfile360(
  citizenId: string,
  tenantId: string
): Promise<CitizenProfile360 | null> {
  try {
    const citizen = await prisma.citizen.findFirst({
      where: { id: citizenId, tenantId },
      include: {
        socialAccounts: {
          select: {
            provider: true,
            providerName: true,
            providerEmail: true,
            createdAt: true,
          },
        },
        complaints: {
          where: { tenantId },
          select: {
            id: true,
            trackingNumber: true,
            category: true,
            subject: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        contactSubmissions: {
          where: { tenantId },
          select: {
            id: true,
            subject: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        consents: {
          where: { tenantId },
          select: {
            consentType: true,
            isGranted: true,
            grantedAt: true,
            revokedAt: true,
            version: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!citizen) return null;

    const activities = await prisma.citizenActivity.findMany({
      where: { citizenId, tenantId },
      select: {
        type: true,
        action: true,
        metadata: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Aggregate stats
    const [totalActivities, totalDownloads, totalFormSubmissions, totalPageViews] =
      await Promise.all([
        prisma.citizenActivity.count({ where: { citizenId, tenantId } }),
        prisma.citizenActivity.count({
          where: { citizenId, tenantId, type: 'DOWNLOAD' },
        }),
        prisma.citizenActivity.count({
          where: { citizenId, tenantId, type: 'FORM_SUBMISSION' },
        }),
        prisma.citizenActivity.count({
          where: { citizenId, tenantId, type: 'PAGE_VIEW' },
        }),
      ]);

    const daysSinceRegistration = Math.floor(
      (Date.now() - citizen.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    const monthsSinceRegistration = Math.max(1, daysSinceRegistration / 30);
    const loginActivities = await prisma.citizenActivity.count({
      where: { citizenId, tenantId, type: 'LOGIN' },
    });

    return {
      citizen: {
        id: citizen.id,
        name: citizen.name,
        email: citizen.email,
        phone: citizen.phone,
        avatar: citizen.avatar,
        subdistrict: citizen.subdistrict,
        district: citizen.district,
        province: citizen.province,
        isPhoneVerified: citizen.isPhoneVerified,
        isEmailVerified: citizen.isEmailVerified,
        isActive: citizen.isActive,
        loginCount: citizen.loginCount,
        lastLoginAt: citizen.lastLoginAt,
        createdAt: citizen.createdAt,
      },
      socialAccounts: citizen.socialAccounts,
      recentActivities: activities.map((a) => ({
        type: a.type,
        action: a.action,
        metadata: a.metadata ? JSON.parse(a.metadata) : null,
        createdAt: a.createdAt,
      })),
      complaints: citizen.complaints,
      contactSubmissions: citizen.contactSubmissions,
      consents: citizen.consents,
      stats: {
        totalActivities,
        totalComplaints: citizen.complaints.length,
        totalDownloads,
        totalFormSubmissions,
        totalPageViews,
        daysSinceRegistration,
        avgSessionsPerMonth: Math.round(loginActivities / monthsSinceRegistration),
      },
    };
  } catch (error) {
    console.error('[CDP] getCitizenProfile360 error:', error);
    return null;
  }
}

/**
 * แบ่งกลุ่มพลเมืองตามลักษณะต่างๆ
 */
export async function getCitizenSegments(tenantId: string): Promise<CitizenSegment[]> {
  try {
    const citizens = await prisma.citizen.findMany({
      where: { tenantId, isActive: true },
      select: {
        id: true,
        birthDate: true,
        subdistrict: true,
        loginCount: true,
        lastLoginAt: true,
        createdAt: true,
        consentMarketing: true,
      },
    });

    const segments: CitizenSegment[] = [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // --- Engagement Segments ---
    const activeUsers = citizens.filter(
      (c) => c.lastLoginAt && c.lastLoginAt >= thirtyDaysAgo
    );
    segments.push({
      segmentName: 'active_30d',
      segmentNameTh: 'ใช้งานภายใน 30 วัน',
      count: activeUsers.length,
      citizenIds: activeUsers.map((c) => c.id),
    });

    const dormantUsers = citizens.filter(
      (c) => !c.lastLoginAt || c.lastLoginAt < thirtyDaysAgo
    );
    segments.push({
      segmentName: 'dormant',
      segmentNameTh: 'ไม่ได้ใช้งานเกิน 30 วัน',
      count: dormantUsers.length,
      citizenIds: dormantUsers.map((c) => c.id),
    });

    const powerUsers = citizens.filter((c) => c.loginCount >= 10);
    segments.push({
      segmentName: 'power_users',
      segmentNameTh: 'ผู้ใช้งานหลัก (เข้าสู่ระบบ 10+ ครั้ง)',
      count: powerUsers.length,
      citizenIds: powerUsers.map((c) => c.id),
    });

    // --- Age Group Segments ---
    const ageGroups: Record<string, { nameTh: string; ids: string[] }> = {
      'youth': { nameTh: 'เยาวชน (ต่ำกว่า 18 ปี)', ids: [] },
      'young_adult': { nameTh: 'วัยทำงานตอนต้น (18-30 ปี)', ids: [] },
      'adult': { nameTh: 'วัยทำงาน (31-50 ปี)', ids: [] },
      'senior': { nameTh: 'วัยกลางคน (51-60 ปี)', ids: [] },
      'elderly': { nameTh: 'ผู้สูงอายุ (60+ ปี)', ids: [] },
      'unknown_age': { nameTh: 'ไม่ระบุอายุ', ids: [] },
    };

    for (const citizen of citizens) {
      if (!citizen.birthDate) {
        ageGroups['unknown_age'].ids.push(citizen.id);
        continue;
      }

      const age = Math.floor(
        (now.getTime() - citizen.birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      );

      if (age < 18) ageGroups['youth'].ids.push(citizen.id);
      else if (age <= 30) ageGroups['young_adult'].ids.push(citizen.id);
      else if (age <= 50) ageGroups['adult'].ids.push(citizen.id);
      else if (age <= 60) ageGroups['senior'].ids.push(citizen.id);
      else ageGroups['elderly'].ids.push(citizen.id);
    }

    for (const [key, group] of Object.entries(ageGroups)) {
      if (group.ids.length > 0) {
        segments.push({
          segmentName: key,
          segmentNameTh: group.nameTh,
          count: group.ids.length,
          citizenIds: group.ids,
        });
      }
    }

    // --- Geographic Segments ---
    const subdistrictMap = new Map<string, string[]>();
    for (const citizen of citizens) {
      const area = citizen.subdistrict || 'ไม่ระบุพื้นที่';
      if (!subdistrictMap.has(area)) subdistrictMap.set(area, []);
      subdistrictMap.get(area)!.push(citizen.id);
    }

    for (const [area, ids] of subdistrictMap) {
      segments.push({
        segmentName: `area_${area}`,
        segmentNameTh: `พื้นที่: ${area}`,
        count: ids.length,
        citizenIds: ids,
      });
    }

    // --- Marketing Consent Segment ---
    const marketingConsent = citizens.filter((c) => c.consentMarketing);
    segments.push({
      segmentName: 'marketing_consent',
      segmentNameTh: 'ยินยอมรับข่าวสาร',
      count: marketingConsent.length,
      citizenIds: marketingConsent.map((c) => c.id),
    });

    return segments;
  } catch (error) {
    console.error('[CDP] getCitizenSegments error:', error);
    return [];
  }
}

/**
 * วิเคราะห์ข้อมูลประชากรภาพรวม
 */
export async function getPopulationInsights(tenantId: string): Promise<PopulationInsights> {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalRegistered,
      totalActive30Days,
      totalPhoneVerified,
      totalEmailVerified,
      citizens,
      socialAccounts,
    ] = await Promise.all([
      prisma.citizen.count({ where: { tenantId } }),
      prisma.citizen.count({
        where: { tenantId, lastLoginAt: { gte: thirtyDaysAgo } },
      }),
      prisma.citizen.count({
        where: { tenantId, isPhoneVerified: true },
      }),
      prisma.citizen.count({
        where: { tenantId, isEmailVerified: true },
      }),
      prisma.citizen.findMany({
        where: { tenantId },
        select: {
          birthDate: true,
          subdistrict: true,
          loginCount: true,
          consentMarketing: true,
          createdAt: true,
        },
      }),
      prisma.citizenSocialAccount.findMany({
        where: {
          citizen: { tenantId },
        },
        select: { provider: true },
      }),
    ]);

    // Registrations by month (last 12 months)
    const registrationsByMonth: { month: string; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthLabel = monthStart.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
      });

      const count = citizens.filter(
        (c) => c.createdAt >= monthStart && c.createdAt < monthEnd
      ).length;

      registrationsByMonth.push({ month: monthLabel, count });
    }

    // Age group distribution
    const ageGroupCounts: Record<string, number> = {
      'ต่ำกว่า 18 ปี': 0,
      '18-30 ปี': 0,
      '31-50 ปี': 0,
      '51-60 ปี': 0,
      '60+ ปี': 0,
      'ไม่ระบุ': 0,
    };

    for (const citizen of citizens) {
      if (!citizen.birthDate) {
        ageGroupCounts['ไม่ระบุ']++;
        continue;
      }
      const age = Math.floor(
        (now.getTime() - citizen.birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      );
      if (age < 18) ageGroupCounts['ต่ำกว่า 18 ปี']++;
      else if (age <= 30) ageGroupCounts['18-30 ปี']++;
      else if (age <= 50) ageGroupCounts['31-50 ปี']++;
      else if (age <= 60) ageGroupCounts['51-60 ปี']++;
      else ageGroupCounts['60+ ปี']++;
    }

    // Subdistrict distribution
    const subdistrictMap = new Map<string, number>();
    for (const citizen of citizens) {
      const area = citizen.subdistrict || 'ไม่ระบุ';
      subdistrictMap.set(area, (subdistrictMap.get(area) || 0) + 1);
    }

    // Provider breakdown
    const providerMap = new Map<string, number>();
    for (const sa of socialAccounts) {
      providerMap.set(sa.provider, (providerMap.get(sa.provider) || 0) + 1);
    }

    // Avg login count
    const totalLogins = citizens.reduce((sum, c) => sum + c.loginCount, 0);
    const avgLoginCount = totalRegistered > 0 ? Math.round((totalLogins / totalRegistered) * 10) / 10 : 0;

    // Marketing consent rate
    const marketingConsented = citizens.filter((c) => c.consentMarketing).length;
    const consentMarketingRate =
      totalRegistered > 0 ? Math.round((marketingConsented / totalRegistered) * 100) : 0;

    return {
      totalRegistered,
      totalActive30Days,
      totalPhoneVerified,
      totalEmailVerified,
      registrationsByMonth,
      ageGroups: Object.entries(ageGroupCounts).map(([group, count]) => ({
        group,
        count,
      })),
      subdistrictDistribution: Array.from(subdistrictMap.entries())
        .map(([subdistrict, count]) => ({ subdistrict, count }))
        .sort((a, b) => b.count - a.count),
      providerBreakdown: Array.from(providerMap.entries())
        .map(([provider, count]) => ({ provider, count }))
        .sort((a, b) => b.count - a.count),
      avgLoginCount,
      consentMarketingRate,
    };
  } catch (error) {
    console.error('[CDP] getPopulationInsights error:', error);
    return {
      totalRegistered: 0,
      totalActive30Days: 0,
      totalPhoneVerified: 0,
      totalEmailVerified: 0,
      registrationsByMonth: [],
      ageGroups: [],
      subdistrictDistribution: [],
      providerBreakdown: [],
      avgLoginCount: 0,
      consentMarketingRate: 0,
    };
  }
}
