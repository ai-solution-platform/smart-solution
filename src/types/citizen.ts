// ============================================================
// TypeScript Types/Interfaces for Citizen Authentication & SSO
// Smart Website Platform - Thai Local Government (เทศบาล)
// ============================================================

// --- Enums ---

export enum AuthProvider {
  LINE = 'LINE',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
}

export enum OTPType {
  LOGIN = 'login',
  REGISTER = 'register',
  VERIFY_PHONE = 'verify-phone',
  VERIFY_EMAIL = 'verify-email',
  TWO_FACTOR = '2fa',
}

export enum CitizenStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

// --- Citizen Profile ---

export interface CitizenProfile {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatar: string | null;
  idCardLast4: string | null; // last 4 digits of Thai national ID card
  address: string | null;
  birthDate: Date | null;
  isActive: boolean;
  linkedProviders: LinkedProvider[];
  tenantId: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  consentRecords: ConsentRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkedProvider {
  provider: AuthProvider;
  providerId: string;
  displayName: string | null;
  email: string | null;
  avatar: string | null;
  linkedAt: Date;
}

// --- Session ---

export interface CitizenSession {
  citizenId: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatar: string | null;
  linkedProviders: AuthProvider[];
  tenantId: string;
  role: 'citizen';
}

// --- OTP ---

export interface OTPRequest {
  destination: string; // phone number or email
  type: OTPType;
  tenantId?: string;
}

export interface OTPVerification {
  destination: string;
  code: string;
  type: OTPType;
  tenantId?: string;
}

export interface StoredOTP {
  code: string;
  type: OTPType;
  destination: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  verified: boolean;
}

// --- Social Auth ---

export interface SocialProfile {
  provider: AuthProvider;
  providerId: string;
  name: string;
  email: string | null;
  avatar: string | null;
  rawProfile?: Record<string, unknown>;
}

// --- Auth API Request/Response ---

export interface CitizenRegisterRequest {
  name: string;
  phone?: string;
  email?: string;
  idCardLast4?: string;
  address?: string;
  birthDate?: string; // ISO date string
  tenantId: string;
}

export interface CitizenLoginRequest {
  identifier: string; // phone or email
  type: 'phone' | 'email';
  tenantId: string;
}

export interface CitizenOTPVerifyRequest {
  identifier: string;
  code: string;
  type: OTPType;
  tenantId: string;
}

export interface CitizenLinkProviderRequest {
  citizenId: string;
  provider: AuthProvider;
  providerId: string;
  displayName?: string;
  email?: string;
  avatar?: string;
}

export interface CitizenAuthResponse {
  success: boolean;
  token?: string;
  citizen?: Omit<CitizenProfile, 'consentRecords'>;
  message?: string;
  error?: string;
}

// --- Activity & Consent ---

export interface CitizenActivity {
  id: string;
  citizenId: string;
  action: string; // 'login', 'register', 'update-profile', 'file-complaint', 'view-content'
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  tenantId: string;
  createdAt: Date;
}

export interface ConsentRecord {
  id: string;
  citizenId: string;
  consentType: string; // 'terms-of-service', 'privacy-policy', 'marketing', 'data-sharing'
  version: string;
  granted: boolean;
  grantedAt: Date;
  revokedAt: Date | null;
  ipAddress?: string;
  tenantId: string;
}

// --- CDP (City Data Platform) ---

export interface CDPDataPoint {
  id: string;
  citizenId: string;
  category: string; // 'service-usage', 'complaint', 'payment', 'visit', 'feedback'
  action: string;
  value?: number;
  metadata?: Record<string, unknown>;
  source: string; // 'web', 'app', 'line', 'kiosk'
  tenantId: string;
  timestamp: Date;
}
