// ============================================================
// OTP Service for Citizen Authentication
// In-memory store for development, Redis-ready interface
// ============================================================

import { OTPType, StoredOTP } from '@/types/citizen';

// --- OTP Store Interface (Redis-ready) ---

interface OTPStore {
  set(key: string, value: StoredOTP, ttlMs: number): Promise<void>;
  get(key: string): Promise<StoredOTP | null>;
  delete(key: string): Promise<void>;
}

// --- In-Memory OTP Store (Development) ---

class InMemoryOTPStore implements OTPStore {
  private store = new Map<string, { value: StoredOTP; expiresAt: number }>();

  async set(key: string, value: StoredOTP, ttlMs: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  async get(key: string): Promise<StoredOTP | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

// --- Constants ---

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

// --- Singleton Store ---

const globalForOTP = globalThis as unknown as {
  otpStore: OTPStore | undefined;
  rateLimitMap: Map<string, { count: number; resetAt: number }> | undefined;
};

const otpStore: OTPStore = globalForOTP.otpStore ?? new InMemoryOTPStore();
const rateLimitMap: Map<string, { count: number; resetAt: number }> =
  globalForOTP.rateLimitMap ?? new Map();

if (process.env.NODE_ENV !== 'production') {
  globalForOTP.otpStore = otpStore;
  globalForOTP.rateLimitMap = rateLimitMap;
}

// --- Helper: Build store key ---

function buildKey(destination: string, type: OTPType): string {
  return `otp:${type}:${destination}`;
}

// --- Rate Limiting ---

function checkRateLimit(destination: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(destination);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(destination, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count++;
  return true;
}

// --- Core Functions ---

/**
 * Generate a cryptographically random 6-digit numeric OTP code.
 */
export function generateOTP(): string {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

/**
 * Store an OTP code for the given destination with a 5-minute TTL.
 */
export async function storeOTP(
  destination: string,
  code: string,
  type: OTPType
): Promise<{ success: boolean; error?: string }> {
  // Rate limiting check
  if (!checkRateLimit(destination)) {
    return {
      success: false,
      error: 'ส่ง OTP บ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง',
    };
  }

  const key = buildKey(destination, type);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  const storedOTP: StoredOTP = {
    code,
    type,
    destination,
    expiresAt,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    verified: false,
  };

  await otpStore.set(key, storedOTP, OTP_TTL_MS);
  return { success: true };
}

/**
 * Verify an OTP code and invalidate it upon success.
 * Returns success status and an error message in Thai if verification fails.
 */
export async function verifyOTP(
  destination: string,
  code: string,
  type: OTPType
): Promise<{ success: boolean; error?: string }> {
  const key = buildKey(destination, type);
  const stored = await otpStore.get(key);

  if (!stored) {
    return {
      success: false,
      error: 'รหัส OTP หมดอายุหรือไม่ถูกต้อง กรุณาขอรหัสใหม่',
    };
  }

  // Check if max attempts exceeded
  if (stored.attempts >= stored.maxAttempts) {
    await otpStore.delete(key);
    return {
      success: false,
      error: 'ลองผิดเกินจำนวนครั้งที่กำหนด กรุณาขอรหัส OTP ใหม่',
    };
  }

  // Check expiry
  if (new Date() > new Date(stored.expiresAt)) {
    await otpStore.delete(key);
    return {
      success: false,
      error: 'รหัส OTP หมดอายุ กรุณาขอรหัสใหม่',
    };
  }

  // Verify code
  if (stored.code !== code) {
    stored.attempts++;
    await otpStore.set(
      key,
      stored,
      new Date(stored.expiresAt).getTime() - Date.now()
    );
    const remaining = stored.maxAttempts - stored.attempts;
    return {
      success: false,
      error: `รหัส OTP ไม่ถูกต้อง เหลือโอกาสอีก ${remaining} ครั้ง`,
    };
  }

  // Success: invalidate the OTP
  await otpStore.delete(key);
  return { success: true };
}

// --- SMS & Email Sending (Placeholders) ---

/**
 * Send OTP via SMS.
 * In development: logs to console.
 * In production: integrate with SMS provider (e.g., ThaiBulkSMS, SMSMKT).
 */
export async function sendSMSOTP(
  phone: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (process.env.NODE_ENV === 'development' || !process.env.SMS_API_KEY) {
      console.log(`\n========================================`);
      console.log(`[OTP-SMS] ส่ง OTP ไปยังเบอร์: ${phone}`);
      console.log(`[OTP-SMS] รหัส OTP: ${code}`);
      console.log(`[OTP-SMS] หมดอายุใน 5 นาที`);
      console.log(`========================================\n`);
      return { success: true };
    }

    // Production: integrate with SMS provider
    // Example for ThaiBulkSMS:
    // const response = await fetch('https://bulk.thaibulksms.com/sms', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     msisdn: phone,
    //     message: `รหัส OTP ของคุณคือ ${code} (หมดอายุใน 5 นาที)`,
    //     sender: process.env.SMS_SENDER_NAME || 'SmartCity',
    //   }),
    // });

    return { success: true };
  } catch (error) {
    console.error('[OTP-SMS] Failed to send SMS:', error);
    return {
      success: false,
      error: 'ไม่สามารถส่ง SMS ได้ กรุณาลองใหม่อีกครั้ง',
    };
  }
}

/**
 * Send OTP via email.
 * In development: logs to console.
 * In production: integrate with email provider (e.g., SendGrid, AWS SES).
 */
export async function sendEmailOTP(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_API_KEY) {
      console.log(`\n========================================`);
      console.log(`[OTP-EMAIL] ส่ง OTP ไปยังอีเมล: ${email}`);
      console.log(`[OTP-EMAIL] รหัส OTP: ${code}`);
      console.log(`[OTP-EMAIL] หมดอายุใน 5 นาที`);
      console.log(`========================================\n`);
      return { success: true };
    }

    // Production: integrate with email provider
    // Example for SendGrid:
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email }] }],
    //     from: { email: process.env.EMAIL_FROM || 'noreply@smartcity.go.th' },
    //     subject: 'รหัส OTP สำหรับยืนยันตัวตน',
    //     content: [{
    //       type: 'text/html',
    //       value: `<p>รหัส OTP ของคุณคือ <strong>${code}</strong></p><p>หมดอายุใน 5 นาที</p>`,
    //     }],
    //   }),
    // });

    return { success: true };
  } catch (error) {
    console.error('[OTP-EMAIL] Failed to send email:', error);
    return {
      success: false,
      error: 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้ง',
    };
  }
}

/**
 * High-level function: generate, store, and send OTP.
 */
export async function requestOTP(
  destination: string,
  type: OTPType,
  channel: 'sms' | 'email'
): Promise<{ success: boolean; error?: string }> {
  const code = generateOTP();

  const storeResult = await storeOTP(destination, code, type);
  if (!storeResult.success) {
    return storeResult;
  }

  if (channel === 'sms') {
    return sendSMSOTP(destination, code);
  } else {
    return sendEmailOTP(destination, code);
  }
}
