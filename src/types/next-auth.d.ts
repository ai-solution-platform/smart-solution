import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';
import { AuthProvider } from './citizen';

declare module 'next-auth' {
  interface User extends DefaultUser {
    role?: string;
    tenantId?: string;
    tenantName?: string;
    tenantSlug?: string;
    citizenId?: string;
    phone?: string | null;
    avatar?: string | null;
    linkedProviders?: AuthProvider[];
  }

  interface Session {
    user: {
      id?: string;
      role?: string;
      tenantId?: string;
      tenantName?: string;
      tenantSlug?: string;
      citizenId?: string;
      phone?: string | null;
      avatar?: string | null;
      linkedProviders?: AuthProvider[];
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: string;
    tenantId?: string;
    tenantName?: string;
    tenantSlug?: string;
    citizenId?: string;
    phone?: string | null;
    avatar?: string | null;
    linkedProviders?: AuthProvider[];
  }
}
