// ============================================================
// Social Auth Callback Handler for Citizens
// GET /api/auth/citizen/providers
// Handles OAuth callbacks from LINE, Google, Facebook
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { findOrCreateCitizenFromSocial } from '@/lib/citizen-auth';
import { AuthProvider, SocialProfile } from '@/types/citizen';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

// --- Constants ---

const CITIZEN_SESSION_COOKIE = 'citizen-session-token';
const JWT_EXPIRY = '7d';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// --- Provider Configuration ---

interface ProviderConfig {
  tokenUrl: string;
  profileUrl: string;
  profileFields?: string;
  clientIdEnv: string;
  clientSecretEnv: string;
  mapProfile: (data: Record<string, unknown>) => {
    providerId: string;
    name: string;
    email: string | null;
    avatar: string | null;
  };
}

const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  line: {
    tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
    profileUrl: 'https://api.line.me/v2/profile',
    clientIdEnv: 'LINE_CHANNEL_ID',
    clientSecretEnv: 'LINE_CHANNEL_SECRET',
    mapProfile: (data) => ({
      providerId: data.userId as string,
      name: (data.displayName as string) || 'LINE User',
      email: null, // LINE does not always provide email via profile API
      avatar: (data.pictureUrl as string) || null,
    }),
  },
  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    profileUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    clientIdEnv: 'GOOGLE_CLIENT_ID',
    clientSecretEnv: 'GOOGLE_CLIENT_SECRET',
    mapProfile: (data) => ({
      providerId: data.sub as string,
      name: (data.name as string) || 'Google User',
      email: (data.email as string) || null,
      avatar: (data.picture as string) || null,
    }),
  },
  facebook: {
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    profileUrl: 'https://graph.facebook.com/me',
    profileFields: 'id,name,email,picture.width(200)',
    clientIdEnv: 'FACEBOOK_APP_ID',
    clientSecretEnv: 'FACEBOOK_APP_SECRET',
    mapProfile: (data) => ({
      providerId: data.id as string,
      name: (data.name as string) || 'Facebook User',
      email: (data.email as string) || null,
      avatar:
        ((data.picture as Record<string, unknown>)?.data as Record<string, unknown>)
          ?.url as string || null,
    }),
  },
};

// --- Helpers ---

function getBaseUrl(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('host') || 'localhost:3000';
  return `${proto}://${host}`;
}

function createSessionToken(citizen: {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatar: string | null;
  linkedProviders: AuthProvider[];
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
    { expiresIn: JWT_EXPIRY }
  );
}

// --- GET Handler: OAuth Callback ---

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerName = searchParams.get('provider');
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const baseUrl = getBaseUrl(request);

    // Handle OAuth errors
    if (error) {
      console.error(`[CitizenAuth Callback] OAuth error: ${error}`);
      const errorDescription = searchParams.get('error_description') || 'การเข้าสู่ระบบถูกยกเลิก';
      return NextResponse.redirect(
        `${baseUrl}/citizen/login?error=${encodeURIComponent(errorDescription)}`
      );
    }

    // Validate required params
    if (!providerName || !code) {
      return NextResponse.redirect(
        `${baseUrl}/citizen/login?error=${encodeURIComponent('ข้อมูลไม่ครบถ้วน กรุณาลองใหม่')}`
      );
    }

    const providerConfig = PROVIDER_CONFIGS[providerName];
    if (!providerConfig) {
      return NextResponse.redirect(
        `${baseUrl}/citizen/login?error=${encodeURIComponent('Provider ไม่รองรับ')}`
      );
    }

    // Parse state (contains tenantId and optional redirect URL)
    let tenantId = process.env.DEFAULT_TENANT_ID || '';
    let redirectTo = '/citizen';

    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        tenantId = stateData.tenantId || tenantId;
        redirectTo = stateData.redirectTo || redirectTo;
      } catch {
        // State might be just a tenantId string
        tenantId = state || tenantId;
      }
    }

    // Get client credentials
    const clientId = process.env[providerConfig.clientIdEnv];
    const clientSecret = process.env[providerConfig.clientSecretEnv];

    if (!clientId || !clientSecret) {
      console.error(`[CitizenAuth Callback] Missing credentials for ${providerName}`);
      return NextResponse.redirect(
        `${baseUrl}/citizen/login?error=${encodeURIComponent('การตั้งค่า provider ไม่ครบถ้วน')}`
      );
    }

    // Exchange authorization code for access token
    const redirectUri = `${baseUrl}/api/auth/citizen/providers?provider=${providerName}`;

    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const tokenResponse = await fetch(providerConfig.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error(`[CitizenAuth Callback] Token exchange failed:`, tokenError);
      return NextResponse.redirect(
        `${baseUrl}/citizen/login?error=${encodeURIComponent('ไม่สามารถยืนยันตัวตนกับ provider ได้')}`
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('[CitizenAuth Callback] No access token in response');
      return NextResponse.redirect(
        `${baseUrl}/citizen/login?error=${encodeURIComponent('ไม่ได้รับ access token')}`
      );
    }

    // Fetch user profile from provider
    let profileUrl = providerConfig.profileUrl;
    if (providerConfig.profileFields) {
      profileUrl += `?fields=${providerConfig.profileFields}`;
    }

    const profileResponse = await fetch(profileUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileResponse.ok) {
      const profileError = await profileResponse.text();
      console.error(`[CitizenAuth Callback] Profile fetch failed:`, profileError);
      return NextResponse.redirect(
        `${baseUrl}/citizen/login?error=${encodeURIComponent('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')}`
      );
    }

    const profileData = await profileResponse.json();
    const mappedProfile = providerConfig.mapProfile(profileData);

    // Map provider name to AuthProvider enum
    const providerMap: Record<string, AuthProvider> = {
      line: AuthProvider.LINE,
      google: AuthProvider.GOOGLE,
      facebook: AuthProvider.FACEBOOK,
    };

    const socialProfile: SocialProfile = {
      provider: providerMap[providerName],
      providerId: mappedProfile.providerId,
      name: mappedProfile.name,
      email: mappedProfile.email,
      avatar: mappedProfile.avatar,
      rawProfile: profileData,
    };

    // Find or create citizen account
    const citizen = await findOrCreateCitizenFromSocial(socialProfile, tenantId);

    if (!citizen) {
      return NextResponse.redirect(
        `${baseUrl}/citizen/login?error=${encodeURIComponent('ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่')}`
      );
    }

    // Update last login
    await prisma.citizen.update({
      where: { id: citizen.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session token
    const sessionToken = createSessionToken(citizen);

    // Set session cookie and redirect
    const cookieStore = cookies();
    cookieStore.set(CITIZEN_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });

    return NextResponse.redirect(`${baseUrl}${redirectTo}`);
  } catch (error) {
    console.error('[CitizenAuth Callback] Unexpected error:', error);
    const baseUrl = getBaseUrl(request);
    return NextResponse.redirect(
      `${baseUrl}/citizen/login?error=${encodeURIComponent('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')}`
    );
  }
}
