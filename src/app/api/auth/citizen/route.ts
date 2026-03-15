// ============================================================
// Citizen Authentication API
// POST /api/auth/citizen
// Actions: register, login, verify-otp, link-provider
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOTP, storeOTP, verifyOTP, sendSMSOTP, sendEmailOTP } from '@/lib/otp';
import { findOrCreateCitizenFromSocial } from '@/lib/citizen-auth';
import {
  AuthProvider,
  CitizenAuthResponse,
  CitizenRegisterRequest,
  CitizenLoginRequest,
  CitizenOTPVerifyRequest,
  CitizenLinkProviderRequest,
  OTPType,
} from '@/types/citizen';
import { sign } from 'jsonwebtoken';

// --- JWT Helper ---

function createCitizenToken(citizen: {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatar: string | null;
  linkedProviders: string[];
  tenantId: string;
}): string {
  const secret = process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production';
  return sign(
    {
      citizenId: citizen.id,
      name: citizen.name,
      phone: citizen.phone,
      email: citizen.email,
      avatar: citizen.avatar,
      linkedProviders: citizen.linkedProviders,
      tenantId: citizen.tenantId,
      role: 'citizen',
    },
    secret,
    { expiresIn: '7d' }
  );
}

// --- Validation Helpers ---

function isValidThaiPhone(phone: string): boolean {
  // Thai phone: 0XXXXXXXXX (10 digits) or +66XXXXXXXXX
  return /^(0\d{9}|\+66\d{9})$/.test(phone.replace(/[\s-]/g, ''));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidIdCardLast4(last4: string): boolean {
  return /^\d{4}$/.test(last4);
}

function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+66')) {
    return '0' + cleaned.slice(3);
  }
  return cleaned;
}

// --- Main Handler ---

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'register':
        return handleRegister(body);
      case 'login':
        return handleLogin(body);
      case 'verify-otp':
        return handleVerifyOTP(body);
      case 'link-provider':
        return handleLinkProvider(body);
      default:
        return NextResponse.json<CitizenAuthResponse>(
          {
            success: false,
            error: 'Invalid action. Supported: register, login, verify-otp, link-provider',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[CitizenAuth API] Error:', error);
    return NextResponse.json<CitizenAuthResponse>(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง',
      },
      { status: 500 }
    );
  }
}

// --- Register ---

async function handleRegister(
  body: CitizenRegisterRequest & { action: string }
): Promise<NextResponse<CitizenAuthResponse>> {
  const { name, phone, email, idCardLast4, address, birthDate, tenantId } = body;

  // Validation
  if (!name || !tenantId) {
    return NextResponse.json(
      { success: false, error: 'กรุณากรอกชื่อและเลือกหน่วยงาน' },
      { status: 400 }
    );
  }

  if (!phone && !email) {
    return NextResponse.json(
      { success: false, error: 'กรุณากรอกเบอร์โทรศัพท์หรืออีเมลอย่างน้อยหนึ่งอย่าง' },
      { status: 400 }
    );
  }

  if (phone && !isValidThaiPhone(phone)) {
    return NextResponse.json(
      { success: false, error: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง' },
      { status: 400 }
    );
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: 'รูปแบบอีเมลไม่ถูกต้อง' },
      { status: 400 }
    );
  }

  if (idCardLast4 && !isValidIdCardLast4(idCardLast4)) {
    return NextResponse.json(
      { success: false, error: 'เลข 4 หลักสุดท้ายของบัตรประชาชนไม่ถูกต้อง' },
      { status: 400 }
    );
  }

  // Verify tenant exists
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    return NextResponse.json(
      { success: false, error: 'ไม่พบหน่วยงานที่ระบุ' },
      { status: 400 }
    );
  }

  // Check for existing citizen with same phone or email in this tenant
  const normalizedPhone = phone ? normalizePhone(phone) : undefined;

  const existingCitizen = await prisma.citizen.findFirst({
    where: {
      tenantId,
      OR: [
        ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
        ...(email ? [{ email }] : []),
      ],
    },
  });

  if (existingCitizen) {
    return NextResponse.json(
      {
        success: false,
        error: 'มีบัญชีผู้ใช้งานนี้ในระบบแล้ว กรุณาเข้าสู่ระบบ',
      },
      { status: 409 }
    );
  }

  // Create citizen (isActive=false until OTP verified)
  const citizen = await prisma.citizen.create({
    data: {
      name,
      phone: normalizedPhone ?? null,
      email: email ?? null,
      idCardLast4: idCardLast4 ?? null,
      address: address ?? null,
      birthDate: birthDate ? new Date(birthDate) : null,
      tenantId,
      isActive: false,
    },
    include: { socialAccounts: true },
  });

  // Send verification OTP
  const otpDestination = normalizedPhone || email!;
  const otpChannel: 'sms' | 'email' = normalizedPhone ? 'sms' : 'email';
  const otpCode = generateOTP();

  await storeOTP(otpDestination, otpCode, OTPType.REGISTER);

  if (otpChannel === 'sms') {
    await sendSMSOTP(otpDestination, otpCode);
  } else {
    await sendEmailOTP(otpDestination, otpCode);
  }

  return NextResponse.json<CitizenAuthResponse>(
    {
      success: true,
      message: `ลงทะเบียนสำเร็จ กรุณายืนยันตัวตนด้วยรหัส OTP ที่ส่งไปยัง${otpChannel === 'sms' ? 'เบอร์โทรศัพท์' : 'อีเมล'}ของคุณ`,
      citizen: {
        id: citizen.id,
        name: citizen.name,
        phone: citizen.phone,
        email: citizen.email,
        avatar: citizen.avatar,
        idCardLast4: citizen.idCardLast4,
        address: citizen.address,
        birthDate: citizen.birthDate,
        isActive: citizen.isActive,
        linkedProviders: [],
        tenantId: citizen.tenantId,
        phoneVerified: citizen.isPhoneVerified,
        emailVerified: citizen.isEmailVerified,
        createdAt: citizen.createdAt,
        updatedAt: citizen.updatedAt,
      },
    },
    { status: 201 }
  );
}

// --- Login ---

async function handleLogin(
  body: CitizenLoginRequest & { action: string }
): Promise<NextResponse<CitizenAuthResponse>> {
  const { identifier, type, tenantId } = body;

  if (!identifier || !tenantId) {
    return NextResponse.json(
      { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
      { status: 400 }
    );
  }

  const normalizedIdentifier =
    type === 'phone' ? normalizePhone(identifier) : identifier;

  // Validate format
  if (type === 'phone' && !isValidThaiPhone(identifier)) {
    return NextResponse.json(
      { success: false, error: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง' },
      { status: 400 }
    );
  }

  if (type === 'email' && !isValidEmail(identifier)) {
    return NextResponse.json(
      { success: false, error: 'รูปแบบอีเมลไม่ถูกต้อง' },
      { status: 400 }
    );
  }

  // Check if citizen exists
  const citizen = await prisma.citizen.findFirst({
    where: {
      tenantId,
      ...(type === 'phone'
        ? { phone: normalizedIdentifier }
        : { email: normalizedIdentifier }),
    },
  });

  if (!citizen) {
    return NextResponse.json(
      {
        success: false,
        error: 'ไม่พบบัญชีผู้ใช้งาน กรุณาลงทะเบียนก่อน',
      },
      { status: 404 }
    );
  }

  if (!citizen.isActive) {
    return NextResponse.json(
      { success: false, error: 'บัญชีถูกระงับการใช้งาน กรุณาติดต่อเจ้าหน้าที่' },
      { status: 403 }
    );
  }

  // Generate and send OTP
  const otpCode = generateOTP();
  const storeResult = await storeOTP(normalizedIdentifier, otpCode, OTPType.LOGIN);

  if (!storeResult.success) {
    return NextResponse.json(
      { success: false, error: storeResult.error },
      { status: 429 }
    );
  }

  if (type === 'phone') {
    await sendSMSOTP(normalizedIdentifier, otpCode);
  } else {
    await sendEmailOTP(normalizedIdentifier, otpCode);
  }

  return NextResponse.json<CitizenAuthResponse>({
    success: true,
    message: `ส่งรหัส OTP ไปยัง${type === 'phone' ? 'เบอร์โทรศัพท์' : 'อีเมล'}ของคุณแล้ว กรุณากรอกรหัสภายใน 5 นาที`,
  });
}

// --- Verify OTP ---

async function handleVerifyOTP(
  body: CitizenOTPVerifyRequest & { action: string }
): Promise<NextResponse<CitizenAuthResponse>> {
  const { identifier, code, type, tenantId } = body;

  if (!identifier || !code || !type || !tenantId) {
    return NextResponse.json(
      { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
      { status: 400 }
    );
  }

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { success: false, error: 'รหัส OTP ต้องเป็นตัวเลข 6 หลัก' },
      { status: 400 }
    );
  }

  const normalizedIdentifier = identifier.includes('@')
    ? identifier
    : normalizePhone(identifier);

  // Verify OTP
  const otpResult = await verifyOTP(normalizedIdentifier, code, type as OTPType);

  if (!otpResult.success) {
    return NextResponse.json(
      { success: false, error: otpResult.error },
      { status: 400 }
    );
  }

  // Find citizen
  const isEmail = normalizedIdentifier.includes('@');
  const citizen = await prisma.citizen.findFirst({
    where: {
      tenantId,
      ...(isEmail
        ? { email: normalizedIdentifier }
        : { phone: normalizedIdentifier }),
    },
    include: { socialAccounts: true },
  });

  if (!citizen) {
    return NextResponse.json(
      { success: false, error: 'ไม่พบบัญชีผู้ใช้งาน' },
      { status: 404 }
    );
  }

  // Update verification status and last login
  const updateData: Record<string, unknown> = {
    lastLoginAt: new Date(),
    loginCount: { increment: 1 },
  };

  if (type === OTPType.REGISTER || type === OTPType.VERIFY_PHONE || type === OTPType.LOGIN) {
    if (!isEmail) updateData.isPhoneVerified = true;
    if (isEmail) updateData.isEmailVerified = true;
  }

  if (type === OTPType.REGISTER || type === OTPType.VERIFY_EMAIL) {
    if (isEmail) updateData.isEmailVerified = true;
  }

  // Activate account if it was pending verification (registered but not yet verified)
  if (!citizen.isActive) {
    updateData.isActive = true;
  }

  await prisma.citizen.update({
    where: { id: citizen.id },
    data: updateData,
  });

  // Generate JWT
  const linkedProviders = citizen.socialAccounts.map(
    (p: { provider: string }) => p.provider
  );

  const token = createCitizenToken({
    id: citizen.id,
    name: citizen.name,
    phone: citizen.phone,
    email: citizen.email,
    avatar: citizen.avatar,
    linkedProviders,
    tenantId: citizen.tenantId,
  });

  return NextResponse.json<CitizenAuthResponse>({
    success: true,
    token,
    message: 'ยืนยันตัวตนสำเร็จ',
    citizen: {
      id: citizen.id,
      name: citizen.name,
      phone: citizen.phone,
      email: citizen.email,
      avatar: citizen.avatar,
      idCardLast4: citizen.idCardLast4,
      address: citizen.address,
      birthDate: citizen.birthDate,
      isActive: citizen.isActive,
      linkedProviders: linkedProviders.map((p: string) => ({
        provider: p as AuthProvider,
        providerId: '',
        displayName: null,
        email: null,
        avatar: null,
        linkedAt: new Date(),
      })),
      tenantId: citizen.tenantId,
      phoneVerified: citizen.isPhoneVerified,
      emailVerified: citizen.isEmailVerified,
      createdAt: citizen.createdAt,
      updatedAt: citizen.updatedAt,
    },
  });
}

// --- Link Provider ---

async function handleLinkProvider(
  body: CitizenLinkProviderRequest & { action: string }
): Promise<NextResponse<CitizenAuthResponse>> {
  const { citizenId, provider, providerId, displayName, email, avatar } = body;

  if (!citizenId || !provider || !providerId) {
    return NextResponse.json(
      { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
      { status: 400 }
    );
  }

  // Validate provider
  const validProviders = Object.values(AuthProvider);
  if (!validProviders.includes(provider as AuthProvider)) {
    return NextResponse.json(
      {
        success: false,
        error: `Provider ไม่ถูกต้อง รองรับ: ${validProviders.join(', ')}`,
      },
      { status: 400 }
    );
  }

  // Verify citizen exists
  const citizen = await prisma.citizen.findUnique({
    where: { id: citizenId },
    include: { socialAccounts: true },
  });

  if (!citizen) {
    return NextResponse.json(
      { success: false, error: 'ไม่พบบัญชีผู้ใช้งาน' },
      { status: 404 }
    );
  }

  // Check if provider is already linked
  const existingLink = citizen.socialAccounts.find(
    (p: { provider: string; providerId: string }) =>
      p.provider === provider && p.providerId === providerId
  );

  if (existingLink) {
    return NextResponse.json(
      { success: false, error: 'บัญชีนี้เชื่อมต่อกับ provider นี้อยู่แล้ว' },
      { status: 409 }
    );
  }

  // Check if this provider account is linked to another citizen
  const existingProviderLink = await prisma.citizenSocialAccount.findUnique({
    where: {
      provider_providerId: {
        provider,
        providerId,
      },
    },
  });

  if (existingProviderLink) {
    return NextResponse.json(
      {
        success: false,
        error: 'บัญชี provider นี้เชื่อมต่อกับผู้ใช้อื่นอยู่แล้ว',
      },
      { status: 409 }
    );
  }

  // Link provider
  await prisma.citizenSocialAccount.create({
    data: {
      provider,
      providerId,
      providerName: displayName ?? null,
      providerEmail: email ?? null,
      providerAvatar: avatar ?? null,
      citizenId,
    },
  });

  // Fetch updated citizen
  const updatedCitizen = await prisma.citizen.findUnique({
    where: { id: citizenId },
    include: { socialAccounts: true },
  });

  const linkedProviders = updatedCitizen!.socialAccounts.map(
    (p: { provider: string }) => p.provider
  );

  // Generate new token with updated providers
  const token = createCitizenToken({
    id: updatedCitizen!.id,
    name: updatedCitizen!.name,
    phone: updatedCitizen!.phone,
    email: updatedCitizen!.email,
    avatar: updatedCitizen!.avatar,
    linkedProviders,
    tenantId: updatedCitizen!.tenantId,
  });

  return NextResponse.json<CitizenAuthResponse>({
    success: true,
    token,
    message: `เชื่อมต่อบัญชี ${provider} สำเร็จ`,
  });
}
