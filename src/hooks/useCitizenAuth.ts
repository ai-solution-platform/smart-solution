'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CitizenProfile } from '@/types/citizen';

const TOKEN_KEY = 'citizen-auth-token';
const PROFILE_KEY = 'citizen-profile';

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
  const [citizen, setCitizen] = useState<CitizenProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored session on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedProfile = localStorage.getItem(PROFILE_KEY);

      if (storedToken && storedProfile) {
        setToken(storedToken);
        setCitizen(JSON.parse(storedProfile));
      }
    } catch {
      // Clear corrupted data
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PROFILE_KEY);
      } catch {
        // localStorage unavailable
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setCitizen(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILE_KEY);
    } catch {
      // localStorage unavailable
    }
  }, []);

  // Auto-refresh profile when token exists
  useEffect(() => {
    if (!token) return;

    const refreshProfile = async () => {
      try {
        const res = await fetch('/api/citizen/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setCitizen(data.citizen);
          localStorage.setItem(PROFILE_KEY, JSON.stringify(data.citizen));
        } else if (res.status === 401) {
          // Token expired
          logout();
        }
      } catch {
        // Silently fail - keep cached profile
      }
    };

    refreshProfile();
    // Refresh every 5 minutes
    const interval = setInterval(refreshProfile, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token, logout]);

  const login = useCallback(async (newToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/citizen/profile', {
        headers: { Authorization: `Bearer ${newToken}` },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await res.json();
      setToken(newToken);
      setCitizen(data.citizen);
      try {
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(data.citizen));
      } catch {
        // localStorage unavailable
      }
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    (updates: Partial<CitizenProfile>) => {
      if (!citizen) return;
      const updated = { ...citizen, ...updates };
      setCitizen(updated);
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage unavailable
      }
    },
    [citizen]
  );

  return {
    isLoggedIn: !!citizen && !!token,
    isLoading,
    citizen,
    login,
    logout,
    updateProfile,
    token,
  };
}
