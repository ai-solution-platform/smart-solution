'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SocialLoginButtons from '@/components/shared/SocialLoginButtons';
import OTPInput from '@/components/shared/OTPInput';

interface ProfileData {
  fullName: string;
  phone: string;
  email: string;
  idLast4: string;
  birthDate: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
}

export default function CitizenRegisterPage() {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'social' | 'phone' | 'email' | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [pdpaConsent, setPdpaConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    phone: '',
    email: '',
    idLast4: '',
    birthDate: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
  });

  const handleSocialLogin = (provider: 'line' | 'google' | 'facebook') => {
    setMethod('social');
    console.log('Social register:', provider);
    // After OAuth, skip to step 3
    setStep(3);
  };

  const handleSendOTP = () => {
    setStep(2);
  };

  const handleOTPComplete = (otp: string) => {
    console.log('OTP:', otp);
    // Verify OTP then proceed
    if (otp === '000000') {
      setOtpError(true);
      return;
    }
    setOtpError(false);
    setStep(3);
  };

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!pdpaConsent) return;
    console.log('Register:', { profile, pdpaConsent, marketingConsent });
    // Submit registration
  };

  const isPhoneValid = /^0[0-9]{8,9}$/.test(phone.replace(/[-\s]/g, ''));
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmitProfile = profile.fullName.trim() !== '' && pdpaConsent;

  const steps = [
    { number: 1, label: 'เลือกวิธีสมัคร' },
    { number: 2, label: 'ยืนยันตัวตน' },
    { number: 3, label: 'กรอกข้อมูล' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            สมัครสมาชิก
          </h1>
          <p className="text-gray-500 text-base">
            สร้างบัญชีเพื่อใช้บริการของเทศบาล
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, index) => (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-colors ${
                    step > s.number
                      ? 'bg-green-500 text-white'
                      : step === s.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.number ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.number
                  )}
                </div>
                <span className={`text-xs sm:text-sm mt-1 ${step > s.number ? 'text-green-600 font-medium' : step === s.number ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 sm:w-20 h-1 mx-2 rounded-full mb-5 ${step > s.number ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Step 1: Choose Method */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                เลือกวิธีสมัครสมาชิก
              </h2>

              <SocialLoginButtons variant="full" onLogin={handleSocialLogin} />

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-gray-400 text-sm">หรือ</span>
                </div>
              </div>

              {/* Phone/Email Toggle */}
              <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
                <button
                  onClick={() => setMethod('phone')}
                  className={`flex-1 py-3 rounded-lg text-base font-medium transition-all min-h-[48px] ${
                    method === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  เบอร์โทรศัพท์
                </button>
                <button
                  onClick={() => setMethod('email')}
                  className={`flex-1 py-3 rounded-lg text-base font-medium transition-all min-h-[48px] ${
                    method === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  อีเมล
                </button>
              </div>

              {method === 'phone' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="reg-phone" className="block text-base font-medium text-gray-700 mb-2">
                      เบอร์โทรศัพท์
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-4 bg-gray-100 rounded-xl text-gray-500 font-medium min-h-[52px]">
                        +66
                      </div>
                      <input
                        id="reg-phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="0812345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ''))}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px]"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSendOTP}
                    disabled={!isPhoneValid}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-lg font-medium transition-colors min-h-[52px]"
                  >
                    ส่งรหัส OTP
                  </button>
                </div>
              )}

              {method === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="reg-email" className="block text-base font-medium text-gray-700 mb-2">
                      อีเมล
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px]"
                    />
                  </div>
                  <button
                    onClick={handleSendOTP}
                    disabled={!isEmailValid}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-lg font-medium transition-colors min-h-[52px]"
                  >
                    ส่งรหัส OTP
                  </button>
                </div>
              )}

              <p className="text-center text-gray-500 mt-6 text-base">
                มีบัญชีอยู่แล้ว?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">ยืนยันตัวตน</h2>
              <p className="text-gray-500 mb-6">
                {method === 'phone'
                  ? `ส่งรหัส OTP ไปที่ ${phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}`
                  : `ส่งรหัส OTP ไปที่ ${email}`}
              </p>

              <OTPInput onComplete={handleOTPComplete} error={otpError} />

              {otpError && (
                <p className="text-red-500 text-sm mt-3">รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่</p>
              )}

              <button
                onClick={() => setStep(1)}
                className="mt-6 text-blue-600 hover:underline text-base"
              >
                เปลี่ยน{method === 'phone' ? 'เบอร์โทร' : 'อีเมล'}
              </button>
            </div>
          )}

          {/* Step 3: Complete Profile */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                กรอกข้อมูลส่วนตัว
              </h2>

              <div className="space-y-5">
                {/* Full Name - Required */}
                <div>
                  <label htmlFor="fullName" className="block text-base font-medium text-gray-700 mb-2">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="กรอกชื่อ-นามสกุล"
                    value={profile.fullName}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px]"
                  />
                </div>

                {/* Phone - Required if not via phone */}
                {method !== 'phone' && (
                  <div>
                    <label htmlFor="profilePhone" className="block text-base font-medium text-gray-700 mb-2">
                      เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="profilePhone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="0812345678"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value.replace(/[^\d]/g, ''))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px]"
                      maxLength={10}
                    />
                  </div>
                )}

                {/* Email - Optional */}
                <div>
                  <label htmlFor="profileEmail" className="block text-base font-medium text-gray-700 mb-2">
                    อีเมล <span className="text-gray-400 text-xs">(ไม่บังคับ)</span>
                  </label>
                  <input
                    id="profileEmail"
                    type="email"
                    placeholder="example@gmail.com"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px]"
                  />
                </div>

                {/* National ID last 4 - Optional */}
                <div>
                  <label htmlFor="idLast4" className="block text-sm font-medium text-gray-700 mb-1">
                    เลขบัตรประชาชน 4 ตัวท้าย <span className="text-gray-400 text-xs">(ไม่บังคับ)</span>
                  </label>
                  <p className="text-xs text-gray-400 mb-2">
                    ใช้เพื่อยืนยันตัวตนในการขอเอกสารราชการ
                  </p>
                  <input
                    id="idLast4"
                    type="text"
                    inputMode="numeric"
                    placeholder="xxxx"
                    maxLength={4}
                    value={profile.idLast4}
                    onChange={(e) => handleProfileChange('idLast4', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px]"
                  />
                </div>

                {/* Birth Date - Optional */}
                <div>
                  <label htmlFor="birthDate" className="block text-base font-medium text-gray-700 mb-2">
                    วันเดือนปีเกิด <span className="text-gray-400 text-xs">(ไม่บังคับ)</span>
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => handleProfileChange('birthDate', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px]"
                  />
                </div>

                {/* Address - Optional */}
                <div>
                  <label htmlFor="address" className="block text-base font-medium text-gray-700 mb-2">
                    ที่อยู่ <span className="text-gray-400 text-xs">(ไม่บังคับ)</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="บ้านเลขที่ หมู่ ซอย ถนน"
                    value={profile.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px]"
                  />
                </div>

                {/* Sub-district / District / Province */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="subDistrict" className="block text-xs font-medium text-gray-700 mb-1">
                      ตำบล
                    </label>
                    <select
                      id="subDistrict"
                      value={profile.subDistrict}
                      onChange={(e) => handleProfileChange('subDistrict', e.target.value)}
                      className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px] bg-white"
                    >
                      <option value="">เลือกตำบล</option>
                      <option value="sample">ตัวอย่าง</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="district" className="block text-xs font-medium text-gray-700 mb-1">
                      อำเภอ
                    </label>
                    <select
                      id="district"
                      value={profile.district}
                      onChange={(e) => handleProfileChange('district', e.target.value)}
                      className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px] bg-white"
                    >
                      <option value="">เลือกอำเภอ</option>
                      <option value="sample">ตัวอย่าง</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="province" className="block text-xs font-medium text-gray-700 mb-1">
                      จังหวัด
                    </label>
                    <select
                      id="province"
                      value={profile.province}
                      onChange={(e) => handleProfileChange('province', e.target.value)}
                      className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[52px] bg-white"
                    >
                      <option value="">เลือกจังหวัด</option>
                      <option value="sample">ตัวอย่าง</option>
                    </select>
                  </div>
                </div>

                {/* Consent Checkboxes */}
                <div className="border-t border-gray-100 pt-5 space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pdpaConsent}
                      onChange={(e) => setPdpaConsent(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                    />
                    <span className="text-base text-gray-700">
                      <span className="text-red-500">*</span>{' '}
                      ยินยอมให้เทศบาลเก็บข้อมูลเพื่อการให้บริการ ตาม{' '}
                      <a href="/privacy-policy" className="text-blue-600 hover:underline">
                        นโยบายความเป็นส่วนตัว
                      </a>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                    />
                    <span className="text-base text-gray-500">
                      รับข่าวสารและประชาสัมพันธ์จากเทศบาล{' '}
                      <span className="text-gray-400 text-sm">(ไม่บังคับ)</span>
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmitProfile}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-lg font-medium transition-colors min-h-[52px]"
                >
                  สมัครสมาชิก
                </button>
              </div>
            </div>
          )}
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
