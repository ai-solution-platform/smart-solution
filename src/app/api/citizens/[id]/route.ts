import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCitizenProfile360 } from '@/lib/cdp';

// =============================================================================
// GET /api/citizens/[id] - โปรไฟล์พลเมือง 360 องศา
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const user = session.user as { role: string; tenantId: string };
    if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      );
    }

    const { id } = params;
    const tenantId = user.tenantId;

    const profile = await getCitizenProfile360(id, tenantId);

    if (!profile) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลพลเมือง' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('GET /api/citizens/[id] error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE /api/citizens/[id] - ลบข้อมูลพลเมือง (PDPA Compliant - Anonymize)
// ไม่ลบข้อมูลถาวร แต่ทำให้ไม่สามารถระบุตัวตนได้
// =============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const user = session.user as { role: string; tenantId: string };
    if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      );
    }

    const { id } = params;
    const tenantId = user.tenantId;

    // Verify citizen exists and belongs to tenant
    const citizen = await prisma.citizen.findFirst({
      where: { id, tenantId },
    });

    if (!citizen) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลพลเมือง' },
        { status: 404 }
      );
    }

    // PDPA-compliant anonymization (not hard delete)
    // Anonymize personal data but keep statistical records
    const anonymizedName = `[ลบข้อมูลแล้ว] #${id.substring(0, 8)}`;
    const anonymizedDate = new Date();

    await prisma.$transaction([
      // 1. Anonymize citizen profile
      prisma.citizen.update({
        where: { id },
        data: {
          name: anonymizedName,
          email: null,
          phone: null,
          avatar: null,
          idCardLast4: null,
          birthDate: null,
          address: null,
          subdistrict: null,
          district: null,
          province: null,
          postalCode: null,
          isActive: false,
          isPhoneVerified: false,
          isEmailVerified: false,
          consentMarketing: false,
          consentDataCollection: false,
          updatedAt: anonymizedDate,
        },
      }),

      // 2. Remove linked social accounts
      prisma.citizenSocialAccount.deleteMany({
        where: { citizenId: id },
      }),

      // 3. Anonymize activity metadata (keep type/action for stats)
      prisma.citizenActivity.updateMany({
        where: { citizenId: id },
        data: {
          metadata: JSON.stringify({ anonymized: true, anonymizedAt: anonymizedDate.toISOString() }),
          ipAddress: null,
          userAgent: null,
        },
      }),

      // 4. Anonymize complaints
      prisma.complaint.updateMany({
        where: { citizenId: id },
        data: {
          name: anonymizedName,
          phone: null,
          email: null,
        },
      }),

      // 5. Anonymize contact submissions
      prisma.contactSubmission.updateMany({
        where: { citizenId: id },
        data: {
          name: anonymizedName,
          phone: null,
          email: null,
        },
      }),

      // 6. Record consent revocation
      prisma.citizenConsent.create({
        data: {
          citizenId: id,
          tenantId,
          consentType: 'DATA_DELETION_REQUEST',
          isGranted: false,
          grantedAt: anonymizedDate,
          version: '1.0',
          ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'ข้อมูลพลเมืองถูกทำให้ไม่สามารถระบุตัวตนได้แล้ว (Anonymized)',
      citizenId: id,
      anonymizedAt: anonymizedDate.toISOString(),
    });
  } catch (error) {
    console.error('DELETE /api/citizens/[id] error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    );
  }
}
