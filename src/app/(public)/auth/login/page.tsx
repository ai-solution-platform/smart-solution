'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SocialLoginButtons from '@/components/shared/SocialLoginButtons';

export default function CitizenLoginPage() {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSocialLogin = (provider: 'line' | 'google' | 'facebook') => {
    // OAuth redirect logic
    console.log('Social login:', provider);
  };

  const handleSendOTP = async () => {
    setSending(true);
    try {
      // Send OTP logic
      const target = loginMethod === 'phone' ? phone : email;
      console.log('Send OTP to:', target);
      // redirect to /auth/verify
    } finally {
      setSending(false);
    }
  };

  const isPhoneValid = /^0[0-9]{8,9}$/.test(phone.replace(/[-\s]/g, ''));
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSendOTP = loginMethod === 'phone' ? isPhoneValid : isEmailValid;

  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      text: 'ติดตามสถานะเรื่องร้องเรียน',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      text: 'รับแจ้งเตือนข่าวสาร',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      text: 'ดาวน์โหลดเอกสารได้สะดวก',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      text: 'ใช้บริการ e-Service',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            เข้าสู่ระบบสำหรับประชาชน
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            เข้าสู่ระบบเพื่อใช้บริการได้อย่างครบถ้วน
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          {/* Social Login */}
          <SocialLoginButtons variant="full" onLogin={handleSocialLogin} />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-gray-400 text-sm">หรือ</span>
            </div>
          </div>

          {/* Method Toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-3 rounded-lg text-base font-medium transition-all min-h-[48px] ${
                loginMethod === 'phone'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              เบอร์โทรศัพท์
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-3 rounded-lg text-base font-medium transition-all min-h-[48px] ${
                loginMethod === 'email'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              อีเมล
            </button>
          </div>

          {/* Phone Input */}
          {loginMethod === 'phone' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-2">
                  เบอร์โทรศัพท์
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 bg-gray-100 rounded-xl text-gray-500 font-medium text-base min-h-[52px]">
                    +66
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="0812345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d-\s]/g, ''))}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px]"
                    maxLength={12}
                  />
                </div>
              </div>
              <button
                onClick={handleSendOTP}
                disabled={!isPhoneValid || sending}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-lg font-medium transition-colors min-h-[52px]"
              >
                {sending ? 'กำลังส่ง...' : 'ส่งรหัส OTP'}
              </button>
            </div>
          )}

          {/* Email Input */}
          {loginMethod === 'email' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
                  อีเมล
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px]"
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={!isEmailValid || sending}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-lg font-medium transition-colors min-h-[52px]"
              >
                {sending ? 'กำลังส่ง...' : 'ส่งรหัส OTP'}
              </button>
            </div>
          )}

          {/* Register Link */}
          <p className="text-center text-gray-500 mt-6 text-base">
            ยังไม่มีบัญชี?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
              สมัครสมาชิก
            </Link>
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center">
            ทำไมต้องเข้าสู่ระบบ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50"
              >
                <div className="text-blue-600 flex-shrink-0">{benefit.icon}</div>
                <span className="text-gray-700 text-base font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PDPA Notice */}
        <div className="text-center px-4 pb-8">
          <div className="flex items-start gap-2 justify-center text-sm text-gray-400">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p>
              การเข้าสู่ระบบถือว่าคุณยินยอมตาม{' '}
              <a href="/privacy-policy" className="text-blue-500 hover:underline">
                นโยบายความเป็นส่วนตัว
              </a>{' '}
              และ{' '}
              <a href="/terms" className="text-blue-500 hover:underline">
                เงื่อนไขการใช้งาน
              </a>{' '}
              ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
