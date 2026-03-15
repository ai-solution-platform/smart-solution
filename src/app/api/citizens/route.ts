import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// =============================================================================
// GET /api/citizens - รายชื่อพลเมือง (Admin only)
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const user = session.user as { id: string; role: string; tenantId: string };
    if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      );
    }

    const tenantId = user.tenantId;
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const provider = searchParams.get('provider') || '';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.CitizenWhereInput = { tenantId };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (dateFrom || dateTo) {
      const createdAt: Record<string, Date> = {};
      if (dateFrom) createdAt.gte = new Date(dateFrom);
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setDate(toDate.getDate() + 1);
        createdAt.lte = toDate;
      }
      where.createdAt = createdAt;
    }

    // If provider filter, we need citizens with that social account
    let citizenIdsWithProvider: string[] | undefined;
    if (provider) {
      const socialAccounts = await prisma.citizenSocialAccount.findMany({
        where: {
          provider,
          citizen: { tenantId },
        },
        select: { citizenId: true },
      });
      citizenIdsWithProvider = socialAccounts.map((sa) => sa.citizenId);
      where.id = { in: citizenIdsWithProvider };
    }

    // Fetch citizens
    const [citizens, total] = await Promise.all([
      prisma.citizen.findMany({
        where,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          avatar: true,
          isPhoneVerified: true,
          isEmailVerified: true,
          isActive: true,
          loginCount: true,
          lastLoginAt: true,
          createdAt: true,
          socialAccounts: {
            select: { provider: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.citizen.count({ where }),
    ]);

    // Header stats
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalRegistered, verifiedPhone, verifiedEmail, active30d] = await Promise.all([
      prisma.citizen.count({ where: { tenantId } }),
      prisma.citizen.count({ where: { tenantId, isPhoneVerified: true } }),
      prisma.citizen.count({ where: { tenantId, isEmailVerified: true } }),
      prisma.citizen.count({
        where: { tenantId, lastLoginAt: { gte: thirtyDaysAgo } },
      }),
    ]);

    return NextResponse.json({
      citizens: citizens.map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        avatar: c.avatar,
        isPhoneVerified: c.isPhoneVerified,
        isEmailVerified: c.isEmailVerified,
        isActive: c.isActive,
        loginCount: c.loginCount,
        lastLoginAt: c.lastLoginAt,
        createdAt: c.createdAt,
        providers: c.socialAccounts.map((sa) => sa.provider),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalRegistered,
        verifiedPhone,
        verifiedEmail,
        active30d,
      },
    });
  } catch (error) {
    console.error('GET /api/citizens error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลพลเมือง' },
      { status: 500 }
    );
  }
}
