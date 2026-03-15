'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// =============================================================================
// ActivityTracker - ตัวติดตามกิจกรรมผู้ใช้งาน (PDPA Compliant)
// คอมโพเนนต์ที่มองไม่เห็น สำหรับติดตามการเข้าชมหน้าเว็บ
// ตรวจสอบความยินยอม PDPA ก่อนส่งข้อมูล
// =============================================================================

const CONSENT_KEY = 'pdpa_consent';
const SESSION_START_KEY = 'session_start';
const DEBOUNCE_MS = 2000;
const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || '';

interface TrackingPayload {
  tenantId: string;
  path: string;
  referrer: string;
  deviceType: string;
  sessionDuration: number;
  citizenId?: string;
}

function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|android|iphone/i.test(ua)) return 'mobile';
  return 'desktop';
}

function getSessionDuration(): number {
  if (typeof window === 'undefined') return 0;
  const start = sessionStorage.getItem(SESSION_START_KEY);
  if (!start) {
    sessionStorage.setItem(SESSION_START_KEY, String(Date.now()));
    return 0;
  }
  return Math.floor((Date.now() - Number(start)) / 1000);
}

function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) return false;
    const parsed = JSON.parse(consent);
    return parsed.analytics === true || parsed.accepted === true;
  } catch {
    return false;
  }
}

function getCitizenId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const session = localStorage.getItem('citizen_session');
    if (!session) return undefined;
    const parsed = JSON.parse(session);
    return parsed.citizenId || undefined;
  } catch {
    return undefined;
  }
}

export default function ActivityTracker({
  tenantId,
}: {
  tenantId?: string;
}) {
  const pathname = usePathname();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastTrackedPath = useRef<string>('');

  const trackPageView = useCallback(
    async (payload: TrackingPayload) => {
      try {
        await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantId: payload.tenantId,
            path: payload.path,
            referrer: payload.referrer,
            deviceType: payload.deviceType,
            sessionDuration: payload.sessionDuration,
            citizenId: payload.citizenId,
          }),
        });
      } catch (error) {
        // Fail silently - tracking should not disrupt user experience
        console.debug('[ActivityTracker] Failed to send tracking data:', error);
      }
    },
    []
  );

  useEffect(() => {
    // Skip if no pathname or same as last tracked
    if (!pathname || pathname === lastTrackedPath.current) return;

    // Skip admin paths
    if (pathname.startsWith('/admin')) return;

    // Check PDPA consent
    if (!hasConsent()) return;

    // Debounce to avoid excessive API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const resolvedTenantId = tenantId || DEFAULT_TENANT_ID;
      if (!resolvedTenantId) return;

      const payload: TrackingPayload = {
        tenantId: resolvedTenantId,
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        deviceType: getDeviceType(),
        sessionDuration: getSessionDuration(),
        citizenId: getCitizenId(),
      };

      trackPageView(payload);
      lastTrackedPath.current = pathname;
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [pathname, tenantId, trackPageView]);

  // Initialize session start time
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sessionStorage.getItem(SESSION_START_KEY)) {
      sessionStorage.setItem(SESSION_START_KEY, String(Date.now()));
    }
  }, []);

  // Track session duration on beforeunload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hasConsent()) return;

    const handleBeforeUnload = () => {
      const resolvedTenantId = tenantId || DEFAULT_TENANT_ID;
      if (!resolvedTenantId) return;

      const duration = getSessionDuration();
      if (duration < 3) return; // Ignore very short sessions

      // Use sendBeacon for reliable delivery during page unload
      const data = JSON.stringify({
        tenantId: resolvedTenantId,
        path: pathname,
        deviceType: getDeviceType(),
        sessionDuration: duration,
        citizenId: getCitizenId(),
        eventType: 'session_end',
      });

      navigator.sendBeacon('/api/stats', data);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pathname, tenantId]);

  // This component renders nothing - it's invisible
  return null;
}
