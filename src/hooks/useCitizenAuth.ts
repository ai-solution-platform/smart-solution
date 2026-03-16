'use client';

import { useState, useCallback } from 'react';
import type { CitizenProfile } from '@/types/citizen';

// Demo mode: always return a mock logged-in citizen
// This allows the static demo site to show full UX without real auth
const DEMO_CITIZEN: CitizenProfile = {
  id: 'demo-citizen-001',
  name: 'สมชาย ตัวอย่าง',
  email: 'somchai@example.com',
  phone: '081-234-5678',
  avatar: null,
  idCardLast4: null,
  address: '999 ถ.เทศบาล 1 ต.สมาร์ทซิตี้ อ.เมือง',
  birthDate: null,
  isActive: true,
  linkedProviders: [],
  tenantId: 'demo-tenant',
  phoneVerified: true,
  emailVerified: true,
  consentRecords: [],
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

interface UseCitizenAuthReturn {
  isLoggedIn: boolean;
  isLoading: boolean;
  citizen: CitizenProfile | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<CitizenProfile>) => void;
  token: string | null;
}

export function useCitizenAuth(): UseCitizenAuthReturn {
  const [citizen, setCitizen] = useState<CitizenProfile>(DEMO_CITIZEN);

  const logout = useCallback(() => {
    // In demo mode, just reset to demo citizen
    setCitizen(DEMO_CITIZEN);
  }, []);

  const login = useCallback(async () => {
    setCitizen(DEMO_CITIZEN);
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<CitizenProfile>) => {
      setCitizen((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  return {
    isLoggedIn: true,
    isLoading: false,
    citizen,
    login,
    logout,
    updateProfile,
    token: 'demo-token',
  };
}
