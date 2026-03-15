// ============================================================
// Citizen Authentication Configuration (NextAuth)
// Separate from admin auth - supports LINE, Google, Facebook, Phone OTP
// ============================================================

import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { verifyOTP } from '@/lib/otp';
import {
  AuthProvider,
  CitizenSession,
  OTPType,
  SocialProfile,
} from '@/types/citizen';

// Type augmentation is in src/types/next-auth.d.ts

// --- Helper: Find or create citizen from social profile ---

export async function findOrCreateCitizenFromSocial(
  profile: SocialProfile,
  tenantId: string
): Promise<{
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatar: string | null;
  linkedProviders: AuthProvider[];
  tenantId: string;
} | null> {
  try {
    // Check if a citizen is already linked with this provider
    const existingLink = await prisma.citizenSocialAccount.findUnique({
      where: {
        provider_providerId: {
          provider: profile.provider,
          providerId: profile.providerId,
        },
      },
      include: {
        citizen: {
          include: {
            socialAccounts: true,
          },
        },
      },
    });

    if (existingLink) {
      const citizen = existingLink.citizen;
      return {
        id: citizen.id,
        name: citizen.name,
        phone: citizen.phone,
        email: citizen.email,
        avatar: citizen.avatar,
        linkedProviders: citizen.socialAccounts.map(
          (p: { provider: string }) => p.provider as AuthProvider
        ),
        tenantId: citizen.tenantId,
      };
    }

    // Check if a citizen with the same email already exists
    if (profile.email) {
      const existingCitizen = await prisma.citizen.findFirst({
        where: {
          email: profile.email,
          tenantId,
        },
        include: { socialAccounts: true },
      });

      if (existingCitizen) {
        // Link the new provider to the existing citizen
        await prisma.citizenSocialAccount.create({
          data: {
            provider: profile.provider,
            providerId: profile.providerId,
            providerName: profile.name,
            providerEmail: profile.email,
            providerAvatar: profile.avatar,
            citizenId: existingCitizen.id,
          },
        });

        const updatedProviders = [
          ...existingCitizen.socialAccounts.map(
            (p: { provider: string }) => p.provider as AuthProvider
          ),
          profile.provider,
        ];

        return {
          id: existingCitizen.id,
          name: existingCitizen.name,
          phone: existingCitizen.phone,
          email: existingCitizen.email,
          avatar: existingCitizen.avatar ?? profile.avatar,
          linkedProviders: updatedProviders,
          tenantId: existingCitizen.tenantId,
        };
      }
    }

    // Create a new citizen account
    const newCitizen = await prisma.citizen.create({
      data: {
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        tenantId,
        isActive: true,
        socialAccounts: {
          create: {
            provider: profile.provider,
            providerId: profile.providerId,
            providerName: profile.name,
            providerEmail: profile.email,
            providerAvatar: profile.avatar,
          },
        },
      },
      include: { socialAccounts: true },
    });

    return {
      id: newCitizen.id,
      name: newCitizen.name,
      phone: newCitizen.phone,
      email: newCitizen.email,
      avatar: newCitizen.avatar,
      linkedProviders: newCitizen.socialAccounts.map(
        (p: { provider: string }) => p.provider as AuthProvider
      ),
      tenantId: newCitizen.tenantId,
    };
  } catch (error) {
    console.error('[CitizenAuth] findOrCreateCitizenFromSocial error:', error);
    return null;
  }
}

// --- Helper: Find citizen by phone/email for OTP login ---

async function findCitizenByIdentifier(
  identifier: string,
  tenantId: string
): Promise<{
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatar: string | null;
  linkedProviders: AuthProvider[];
  tenantId: string;
} | null> {
  const isEmail = identifier.includes('@');

  const citizen = await prisma.citizen.findFirst({
    where: {
      tenantId,
      ...(isEmail ? { email: identifier } : { phone: identifier }),
    },
    include: { socialAccounts: true },
  });

  if (!citizen) return null;

  return {
    id: citizen.id,
    name: citizen.name,
    phone: citizen.phone,
    email: citizen.email,
    avatar: citizen.avatar,
    linkedProviders: citizen.socialAccounts.map(
      (p: { provider: string }) => p.provider as AuthProvider
    ),
    tenantId: citizen.tenantId,
  };
}

// --- NextAuth Configuration for Citizens ---

export const citizenAuthOptions: NextAuthOptions = {
  providers: [
    // --- Phone/Email + OTP Login ---
    CredentialsProvider({
      id: 'citizen-otp',
      name: 'Phone or Email OTP',
      credentials: {
        identifier: {
          label: 'Phone or Email',
          type: 'text',
          placeholder: '0812345678 หรือ email@example.com',
        },
        code: { label: 'OTP Code', type: 'text', placeholder: '123456' },
        tenantId: { label: 'Tenant ID', type: 'hidden' },
      },
      async authorize(credentials) {
        if (
          !credentials?.identifier ||
          !credentials?.code ||
          !credentials?.tenantId
        ) {
          throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
        }

        // Verify OTP
        const otpResult = await verifyOTP(
          credentials.identifier,
          credentials.code,
          OTPType.LOGIN
        );

        if (!otpResult.success) {
          throw new Error(otpResult.error || 'รหัส OTP ไม่ถูกต้อง');
        }

        // Find citizen account
        const citizen = await findCitizenByIdentifier(
          credentials.identifier,
          credentials.tenantId
        );

        if (!citizen) {
          throw new Error('ไม่พบบัญชีผู้ใช้งาน กรุณาลงทะเบียนก่อน');
        }

        // Update last login
        await prisma.citizen.update({
          where: { id: citizen.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: citizen.id,
          citizenId: citizen.id,
          name: citizen.name,
          email: citizen.email,
          phone: citizen.phone,
          avatar: citizen.avatar,
          linkedProviders: citizen.linkedProviders,
          tenantId: citizen.tenantId,
          role: 'citizen' as const,
        };
      },
    }),

    // --- LINE Login ---
    // Configure via environment variables:
    //   LINE_CHANNEL_ID, LINE_CHANNEL_SECRET
    ...(process.env.LINE_CHANNEL_ID && process.env.LINE_CHANNEL_SECRET
      ? [
          {
            id: 'line',
            name: 'LINE',
            type: 'oauth' as const,
            authorization: {
              url: 'https://access.line.me/oauth2/v2.1/authorize',
              params: {
                scope: 'profile openid email',
                response_type: 'code',
              },
            },
            token: 'https://api.line.me/oauth2/v2.1/token',
            userinfo: 'https://api.line.me/v2/profile',
            clientId: process.env.LINE_CHANNEL_ID,
            clientSecret: process.env.LINE_CHANNEL_SECRET,
            profile(profile: Record<string, string>) {
              return {
                id: profile.userId,
                name: profile.displayName,
                email: null,
                image: profile.pictureUrl,
              };
            },
          },
        ]
      : []),

    // --- Google OAuth ---
    // Configure via environment variables:
    //   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          {
            id: 'google',
            name: 'Google',
            type: 'oauth' as const,
            authorization: {
              url: 'https://accounts.google.com/o/oauth2/v2/auth',
              params: {
                scope: 'openid email profile',
                response_type: 'code',
              },
            },
            token: 'https://oauth2.googleapis.com/token',
            userinfo: 'https://www.googleapis.com/oauth2/v3/userinfo',
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile: Record<string, string>) {
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
              };
            },
          },
        ]
      : []),

    // --- Facebook Login ---
    // Configure via environment variables:
    //   FACEBOOK_APP_ID, FACEBOOK_APP_SECRET
    ...(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET
      ? [
          {
            id: 'facebook',
            name: 'Facebook',
            type: 'oauth' as const,
            authorization: {
              url: 'https://www.facebook.com/v18.0/dialog/oauth',
              params: {
                scope: 'email public_profile',
                response_type: 'code',
              },
            },
            token: 'https://graph.facebook.com/v18.0/oauth/access_token',
            userinfo: {
              url: 'https://graph.facebook.com/me',
              params: { fields: 'id,name,email,picture.width(200)' },
            },
            clientId: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            profile(profile: Record<string, unknown>) {
              return {
                id: profile.id as string,
                name: profile.name as string,
                email: (profile.email as string) ?? null,
                image:
                  (
                    (profile.picture as { data?: { url?: string } })?.data
                      ?.url as string
                  ) ?? null,
              };
            },
          },
        ]
      : []),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, find or create citizen
      if (account && account.type === 'oauth' && account.provider) {
        const providerMap: Record<string, AuthProvider> = {
          line: AuthProvider.LINE,
          google: AuthProvider.GOOGLE,
          facebook: AuthProvider.FACEBOOK,
        };

        const authProvider = providerMap[account.provider];
        if (!authProvider) return true;

        const tenantId =
          (account as unknown as Record<string, unknown>).tenantId as string ||
          process.env.DEFAULT_TENANT_ID ||
          '';

        const socialProfile: SocialProfile = {
          provider: authProvider,
          providerId: account.providerAccountId || user.id,
          name: user.name || 'Citizen',
          email: user.email ?? null,
          avatar: (user as unknown as Record<string, unknown>).image as string | null,
        };

        const citizen = await findOrCreateCitizenFromSocial(
          socialProfile,
          tenantId
        );

        if (!citizen) {
          return false;
        }

        // Attach citizen data to user object for JWT callback
        (user as unknown as Record<string, unknown>).citizenId = citizen.id;
        (user as unknown as Record<string, unknown>).phone = citizen.phone;
        (user as unknown as Record<string, unknown>).avatar = citizen.avatar;
        (user as unknown as Record<string, unknown>).linkedProviders =
          citizen.linkedProviders;
        (user as unknown as Record<string, unknown>).tenantId = citizen.tenantId;
        (user as unknown as Record<string, unknown>).role = 'citizen';
      }

      return true;
    },

    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.citizenId = (user as unknown as Record<string, unknown>)
          .citizenId as string;
        token.name = user.name ?? null;
        token.email = user.email ?? null;
        token.phone = (user as unknown as Record<string, unknown>).phone as string | null;
        token.avatar = (user as unknown as Record<string, unknown>).avatar as
          | string
          | null;
        token.linkedProviders = (
          user as unknown as Record<string, unknown>
        ).linkedProviders as AuthProvider[];
        token.tenantId = (user as unknown as Record<string, unknown>)
          .tenantId as string;
        token.role = 'citizen';
      }
      return token;
    },

    async session({ session, token }): Promise<Session> {
      session.user = {
        citizenId: token.citizenId,
        name: token.name ?? '',
        phone: token.phone,
        email: token.email ?? null,
        avatar: token.avatar,
        linkedProviders: token.linkedProviders,
        tenantId: token.tenantId,
        role: 'citizen',
      };
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to citizen portal after auth
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/citizen`;
    },
  },

  pages: {
    signIn: '/citizen/login',
    error: '/citizen/login',
    newUser: '/citizen/register',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days for citizen sessions
  },

  cookies: {
    sessionToken: {
      name: 'citizen-session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
