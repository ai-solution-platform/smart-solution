'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import OTPInput from '@/components/shared/OTPInput';

export default function OTPVerifyPage() {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  // Mock data - in real app, read from query params or state
  const contactType: 'phone' | 'email' = 'phone';
  const maskedContact = contactType === 'phone' ? 'xxx-xxx-1234' : 'exa***@gmail.com';

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOTPComplete = useCallback(async (otp: string) => {
    setVerifying(true);
    setError(false);
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock: reject if OTP is 000000
      if (otp === '000000') {
        setError(true);
        setErrorMessage('รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่');
        setVerifying(false);
        return;
      }

      setVerified(true);
      // redirect to profile or complete registration
    } catch {
      setError(true);
      setErrorMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setVerifying(false);
    }
  }, []);

  const handleResend = () => {
    setCanResend(false);
    setCountdown(60);
    setError(false);
    setErrorMessage('');
    console.log('Resend OTP');
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ยืนยันตัวตนสำเร็จ</h1>
          <p className="text-gray-500 mb-8">ระบบกำลังนำท่านไปยังหน้าถัดไป...</p>
          <Link
            href="/auth/profile"
            className="inline-block py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-medium transition-colors min-h-[52px]"
          >
            ไปหน้าโปรไฟล์
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">ยืนยันตัวตน</h1>
          <p className="text-gray-500 text-base mb-2">
            กรอกรหัส OTP 6 หลักที่ส่งไปที่
          </p>
          <p className="text-gray-800 font-semibold text-lg mb-8">
            {maskedContact}
          </p>

          {/* OTP Input */}
          <OTPInput onComplete={handleOTPComplete} error={error} disabled={verifying} />

          {/* Error Message */}
          {error && errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Verifying state */}
          {verifying && (
            <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm font-medium">กำลังตรวจสอบ...</span>
            </div>
          )}

          {/* Resend Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            {canResend ? (
              <button
                onClick={handleResend}
                className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors min-h-[48px] text-base"
              >
                ส่งรหัสอีกครั้ง
              </button>
            ) : (
              <p className="text-gray-400 text-base">
                ส่งรหัสอีกครั้งใน{' '}
                <span className="font-semibold text-gray-600">{formatCountdown(countdown)}</span>
              </p>
            )}
          </div>

          {/* Change contact link */}
          <Link
            href="/auth/login"
            className="inline-block mt-4 text-blue-600 hover:underline text-base"
          >
            เปลี่ยน{contactType === 'phone' ? 'เบอร์โทร' : 'อีเมล'}
          </Link>
        </div>

        {/* Back to login */}
        <div className="text-center mt-6">
          <Link href="/auth/login" className="text-gray-400 hover:text-gray-600 text-sm">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}
