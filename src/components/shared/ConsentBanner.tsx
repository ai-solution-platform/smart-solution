'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = 'pdpa_consent';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ConsentSettings>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const saveConsent = useCallback((consent: ConsentSettings) => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ ...consent, timestamp: new Date().toISOString() })
      );
    } catch {
      // localStorage unavailable
    }
    setVisible(false);
    setShowSettings(false);
  }, []);

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const saveSelected = () => {
    saveConsent(settings);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop for settings modal */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/40 z-[9998]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl z-[9999] p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            ตั้งค่าคุกกี้
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            คุณสามารถเลือกประเภทคุกกี้ที่ต้องการอนุญาตได้
          </p>

          <div className="space-y-4">
            {/* Necessary */}
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-800">คุกกี้ที่จำเป็น</p>
                <p className="text-sm text-gray-500 mt-1">
                  จำเป็นสำหรับการทำงานของเว็บไซต์ ไม่สามารถปิดได้
                </p>
              </div>
              <div className="w-12 h-7 bg-blue-500 rounded-full relative cursor-not-allowed opacity-70">
                <div className="absolute right-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow" />
              </div>
            </label>

            {/* Analytics */}
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
              <div>
                <p className="font-medium text-gray-800">คุกกี้วิเคราะห์</p>
                <p className="text-sm text-gray-500 mt-1">
                  ช่วยให้เราเข้าใจการใช้งานเว็บไซต์เพื่อปรับปรุงบริการ
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.analytics}
                onClick={() => setSettings((s) => ({ ...s, analytics: !s.analytics }))}
                className={`w-12 h-7 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
                  settings.analytics ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                    settings.analytics ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>

            {/* Marketing */}
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
              <div>
                <p className="font-medium text-gray-800">คุกกี้การตลาด</p>
                <p className="text-sm text-gray-500 mt-1">
                  ใช้เพื่อแสดงข่าวสารและประชาสัมพันธ์ที่เกี่ยวข้อง
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.marketing}
                onClick={() => setSettings((s) => ({ ...s, marketing: !s.marketing }))}
                className={`w-12 h-7 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
                  settings.marketing ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                    settings.marketing ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={saveSelected}
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors min-h-[48px]"
            >
              บันทึกการตั้งค่า
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors min-h-[48px]"
            >
              ยอมรับทั้งหมด
            </button>
          </div>
        </div>
      )}

      {/* Bottom Banner */}
      {!showSettings && (
        <div className="fixed bottom-0 inset-x-0 z-[9998] bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 sm:p-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="font-medium text-gray-800">ความเป็นส่วนตัวของคุณ</p>
              </div>
              <p className="text-sm text-gray-600">
                เว็บไซต์นี้ใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งาน{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 sm:flex-none py-3 px-5 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-medium transition-colors min-h-[48px]"
              >
                ตั้งค่า
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 sm:flex-none py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors min-h-[48px]"
              >
                ยอมรับทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
