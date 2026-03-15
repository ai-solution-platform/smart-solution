'use client';

import { useState } from 'react';
import {
  Palette,
  Type,
  Layout,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Monitor,
  Eye,
  Building2,
  FileText,
} from 'lucide-react';
import ColorPicker from '@/components/admin/ColorPicker';
import ImageUpload from '@/components/admin/ImageUpload';
import Toast, { useToast } from '@/components/admin/Toast';

const fontOptions = [
  { value: 'Prompt', label: 'Prompt' },
  { value: 'Sarabun', label: 'Sarabun' },
  { value: 'Kanit', label: 'Kanit' },
  { value: 'IBM Plex Sans Thai', label: 'IBM Plex Sans Thai' },
];

const defaultTheme = {
  primaryColor: '#1e40af',
  secondaryColor: '#1e3a8a',
  accentColor: '#f59e0b',
  fontFamily: 'Prompt',
  orgName: 'องค์การบริหารส่วนตำบลตัวอย่าง',
  orgDescription: 'ยินดีต้อนรับสู่เว็บไซต์องค์การบริหารส่วนตำบลตัวอย่าง จังหวัดตัวอย่าง',
  headerStyle: '1',
  footerContent:
    'องค์การบริหารส่วนตำบลตัวอย่าง\n123 หมู่ 4 ตำบลตัวอย่าง อำเภอตัวอย่าง จังหวัดตัวอย่าง 10000\nโทร. 02-xxx-xxxx | แฟกซ์. 02-xxx-xxxx',
  logoUrl: null as string | null,
  faviconUrl: null as string | null,
};

export default function ThemePage() {
  const [theme, setTheme] = useState(defaultTheme);
  const { showToast, ToastContainer } = useToast();

  const update = (key: keyof typeof defaultTheme, value: string | null) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    showToast('บันทึกการตั้งค่าธีมสำเร็จ', 'success');
  };

  const handleReset = () => {
    setTheme(defaultTheme);
    showToast('รีเซ็ตธีมเป็นค่าเริ่มต้นแล้ว', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gov-50 rounded-lg">
              <Palette className="w-6 h-6 text-gov-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">ปรับแต่งธีมและอัตลักษณ์</h1>
              <p className="text-sm text-gray-500">กำหนดสี โลโก้ ฟอนต์ และรูปแบบเว็บไซต์</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              รีเซ็ตค่าเริ่มต้น
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-sm text-white bg-gov-600 rounded-lg hover:bg-gov-700 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              บันทึก
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organization Info */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Building2 className="w-5 h-5 text-gov-600" />
                <h2 className="text-lg font-semibold text-gray-800">ข้อมูลองค์กร</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อหน่วยงาน</label>
                  <input
                    type="text"
                    value={theme.orgName}
                    onChange={(e) => update('orgName', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:border-gov-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">คำอธิบายหน่วยงาน</label>
                  <textarea
                    value={theme.orgDescription}
                    onChange={(e) => update('orgDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:border-gov-500 text-sm resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Colors */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Palette className="w-5 h-5 text-gov-600" />
                <h2 className="text-lg font-semibold text-gray-800">สีของเว็บไซต์</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <ColorPicker
                  label="สีหลัก (Primary)"
                  value={theme.primaryColor}
                  onChange={(c) => update('primaryColor', c)}
                />
                <ColorPicker
                  label="สีรอง (Secondary)"
                  value={theme.secondaryColor}
                  onChange={(c) => update('secondaryColor', c)}
                />
                <ColorPicker
                  label="สีเน้น (Accent)"
                  value={theme.accentColor}
                  onChange={(c) => update('accentColor', c)}
                />
              </div>
            </section>

            {/* Logo & Favicon */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <ImageIcon className="w-5 h-5 text-gov-600" />
                <h2 className="text-lg font-semibold text-gray-800">โลโก้และไอคอน</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ImageUpload
                  label="โลโก้หน่วยงาน"
                  value={theme.logoUrl || undefined}
                  onChange={(_, url) => update('logoUrl', url)}
                  description="แนะนำขนาด 200x60 พิกเซล รองรับ PNG, SVG"
                />
                <ImageUpload
                  label="Favicon"
                  value={theme.faviconUrl || undefined}
                  onChange={(_, url) => update('faviconUrl', url)}
                  description="ขนาด 32x32 หรือ 64x64 พิกเซล"
                  maxSizeMB={1}
                />
              </div>
            </section>

            {/* Font & Typography */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Type className="w-5 h-5 text-gov-600" />
                <h2 className="text-lg font-semibold text-gray-800">ฟอนต์</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ฟอนต์หลัก</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {fontOptions.map((font) => (
                    <label
                      key={font.value}
                      className={`relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        theme.fontFamily === font.value
                          ? 'border-gov-500 bg-gov-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fontFamily"
                        value={font.value}
                        checked={theme.fontFamily === font.value}
                        onChange={(e) => update('fontFamily', e.target.value)}
                        className="sr-only"
                      />
                      <span
                        className="text-2xl font-bold text-gray-700 mb-1"
                        style={{ fontFamily: font.value }}
                      >
                        อบต.
                      </span>
                      <span className="text-xs text-gray-500">{font.label}</span>
                      {theme.fontFamily === font.value && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-gov-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Header Style */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Layout className="w-5 h-5 text-gov-600" />
                <h2 className="text-lg font-semibold text-gray-800">รูปแบบส่วนหัว</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['1', '2', '3'].map((style) => (
                  <label
                    key={style}
                    className={`relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
                      theme.headerStyle === style
                        ? 'border-gov-500 ring-2 ring-gov-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="headerStyle"
                      value={style}
                      checked={theme.headerStyle === style}
                      onChange={(e) => update('headerStyle', e.target.value)}
                      className="sr-only"
                    />
                    {/* Mini preview of header styles */}
                    <div className="aspect-video bg-gray-50 p-3">
                      {style === '1' && (
                        <div>
                          <div className="h-2 bg-gov-600 rounded mb-1 w-full" style={{ backgroundColor: theme.primaryColor }} />
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-4 h-4 rounded bg-gray-300" />
                            <div className="h-2 bg-gray-300 rounded flex-1" />
                          </div>
                          <div className="flex gap-2 mt-2">
                            <div className="h-1.5 bg-gray-200 rounded w-8" />
                            <div className="h-1.5 bg-gray-200 rounded w-8" />
                            <div className="h-1.5 bg-gray-200 rounded w-8" />
                          </div>
                        </div>
                      )}
                      {style === '2' && (
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded bg-gray-300" />
                              <div className="h-2 bg-gray-300 rounded w-12" />
                            </div>
                            <div className="flex gap-1">
                              <div className="h-1.5 bg-gray-200 rounded w-6" />
                              <div className="h-1.5 bg-gray-200 rounded w-6" />
                            </div>
                          </div>
                          <div className="h-2 mt-2 rounded w-full" style={{ backgroundColor: theme.primaryColor }} />
                        </div>
                      )}
                      {style === '3' && (
                        <div>
                          <div className="h-8 rounded mb-1" style={{ backgroundColor: theme.primaryColor, opacity: 0.8 }}>
                            <div className="flex items-center justify-center h-full gap-1">
                              <div className="w-3 h-3 rounded bg-white/40" />
                              <div className="h-1.5 bg-white/40 rounded w-10" />
                            </div>
                          </div>
                          <div className="flex justify-center gap-2 mt-1">
                            <div className="h-1.5 bg-gray-200 rounded w-6" />
                            <div className="h-1.5 bg-gray-200 rounded w-6" />
                            <div className="h-1.5 bg-gray-200 rounded w-6" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-2 text-center">
                      <span className="text-xs font-medium text-gray-600">สไตล์ {style}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Footer */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="w-5 h-5 text-gov-600" />
                <h2 className="text-lg font-semibold text-gray-800">เนื้อหาส่วนท้าย</h2>
              </div>
              <textarea
                value={theme.footerContent}
                onChange={(e) => update('footerContent', e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:border-gov-500 text-sm resize-none font-mono"
                placeholder="เนื้อหาส่วนท้ายของเว็บไซต์..."
              />
            </section>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">ตัวอย่างเว็บไซต์</span>
                </div>

                {/* Mini browser preview */}
                <div className="p-3">
                  <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                    {/* Browser chrome */}
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border-b border-gray-200">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 mx-2">
                        <div className="h-4 bg-white rounded text-[8px] text-gray-400 flex items-center px-2">
                          www.example.go.th
                        </div>
                      </div>
                    </div>

                    {/* Preview content */}
                    <div style={{ fontFamily: theme.fontFamily }}>
                      {/* Header */}
                      <div
                        className="px-3 py-2 text-white text-center"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {theme.logoUrl ? (
                            <img src={theme.logoUrl} alt="logo" className="h-5 w-auto" />
                          ) : (
                            <div className="w-5 h-5 rounded bg-white/30" />
                          )}
                          <span className="text-[10px] font-bold truncate">{theme.orgName}</span>
                        </div>
                      </div>

                      {/* Nav */}
                      <div
                        className="flex justify-center gap-3 px-2 py-1.5 text-white text-[7px]"
                        style={{ backgroundColor: theme.secondaryColor }}
                      >
                        <span>หน้าหลัก</span>
                        <span>เกี่ยวกับ</span>
                        <span>ข่าวสาร</span>
                        <span>บริการ</span>
                        <span>ติดต่อ</span>
                      </div>

                      {/* Hero */}
                      <div className="px-3 py-4">
                        <div
                          className="rounded-md p-3 text-white text-center"
                          style={{
                            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                          }}
                        >
                          <p className="text-[9px] font-bold">{theme.orgName}</p>
                          <p className="text-[7px] mt-0.5 opacity-80">ยินดีต้อนรับ</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-3 pb-3">
                        <div className="grid grid-cols-3 gap-1.5 mb-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-50 rounded p-1.5 text-center">
                              <div
                                className="w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center"
                                style={{ backgroundColor: theme.accentColor }}
                              >
                                <span className="text-white text-[6px]">+</span>
                              </div>
                              <div className="h-1 bg-gray-200 rounded w-8 mx-auto" />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 bg-gray-100 rounded w-full" />
                          <div className="h-1.5 bg-gray-100 rounded w-3/4" />
                          <div className="h-1.5 bg-gray-100 rounded w-5/6" />
                        </div>
                      </div>

                      {/* Button preview */}
                      <div className="px-3 pb-3 flex gap-2 justify-center">
                        <div
                          className="px-3 py-1 rounded text-[7px] text-white font-medium"
                          style={{ backgroundColor: theme.primaryColor }}
                        >
                          ปุ่มหลัก
                        </div>
                        <div
                          className="px-3 py-1 rounded text-[7px] text-white font-medium"
                          style={{ backgroundColor: theme.accentColor }}
                        >
                          ปุ่มเน้น
                        </div>
                      </div>

                      {/* Footer */}
                      <div
                        className="px-3 py-2 text-white text-[6px] text-center leading-relaxed"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        {theme.footerContent.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current settings summary */}
                <div className="px-4 py-3 border-t border-gray-100 space-y-2">
                  <p className="text-xs font-medium text-gray-500">การตั้งค่าปัจจุบัน</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>สี:</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.primaryColor }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.secondaryColor }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.accentColor }} />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span>ฟอนต์: </span>
                    <span className="font-medium">{theme.fontFamily}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span>ส่วนหัว: </span>
                    <span className="font-medium">สไตล์ {theme.headerStyle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
