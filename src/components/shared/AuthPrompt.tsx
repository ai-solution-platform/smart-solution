'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn, UserPlus, X } from 'lucide-react';

const DISMISS_KEY = 'auth-prompt-dismissed';

interface AuthPromptProps {
  message?: string;
  compact?: boolean;
  returnUrl?: string;
  dismissible?: boolean;
}

export default function AuthPrompt({
  message = 'เข้าสู่ระบบเพื่อกรอกข้อมูลอัตโนมัติ',
  compact = false,
  returnUrl,
  dismissible = true,
}: AuthPromptProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === 'true') {
        setDismissed(true);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      // sessionStorage unavailable
    }
  };

  if (dismissed) return null;

  const loginHref = returnUrl
    ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`
    : '/auth/login';

  const registerHref = returnUrl
    ? `/auth/register?returnUrl=${encodeURIComponent(returnUrl)}`
    : '/auth/register';

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 min-h-[44px]">
        <LogIn className="w-4 h-4 shrink-0" />
        <span className="text-blue-700">{message}</span>
        <Link
          href={loginHref}
          className="ml-auto font-medium underline underline-offset-2 hover:text-blue-800 whitespace-nowrap min-h-[44px] flex items-center"
        >
          เข้าสู่ระบบ
        </Link>
        {dismissible && (
          <button
            onClick={handleDismiss}
            aria-label="ปิดข้อความแนะนำเข้าสู่ระบบ"
            className="ml-1 p-1 rounded hover:bg-blue-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4 text-blue-400" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 relative">
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="ปิดข้อความแนะนำเข้าสู่ระบบ"
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-blue-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <LogIn className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-800 text-base">{message}</p>
          <p className="text-sm text-gray-500 mt-1">
            เข้าสู่ระบบหรือสมัครสมาชิกเพื่อใช้บริการเพิ่มเติม
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link
            href={loginHref}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
          >
            <LogIn className="w-4 h-4" />
            เข้าสู่ระบบ
          </Link>
          <Link
            href={registerHref}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg text-base font-medium hover:bg-blue-50 transition-colors min-h-[44px]"
          >
            <UserPlus className="w-4 h-4" />
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </div>
  );
}
