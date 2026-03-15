'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Building2,
  Globe,
  Paperclip,
  X,
  MessageSquare,
  LogIn,
  History,
} from 'lucide-react';
import { useCitizenAuth } from '@/hooks/useCitizenAuth';
import AuthPrompt from '@/components/shared/AuthPrompt';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  wantCallback: boolean;
  attachment: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  attachment?: string;
}

interface ContactHistoryItem {
  id: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'REPLIED' | 'CLOSED';
  createdAt: string;
  repliedAt?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  NEW: { label: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-700' },
  IN_PROGRESS: { label: 'กำลังดำเนินการ', color: 'bg-blue-100 text-blue-700' },
  REPLIED: { label: 'ตอบกลับแล้ว', color: 'bg-green-100 text-green-700' },
  CLOSED: { label: 'ปิดเรื่อง', color: 'bg-gray-100 text-gray-600' },
};

export default function ContactPage() {
  const { isLoggedIn, isLoading: authLoading, citizen, token } = useCitizenAuth();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    wantCallback: false,
    attachment: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contactHistory, setContactHistory] = useState<ContactHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Pre-fill form from citizen profile when logged in
  useEffect(() => {
    if (isLoggedIn && citizen) {
      setFormData((prev) => ({
        ...prev,
        name: citizen.name || prev.name,
        email: citizen.email || prev.email,
        phone: citizen.phone || prev.phone,
      }));
    }
  }, [isLoggedIn, citizen]);

  // Load contact history when logged in
  useEffect(() => {
    if (isLoggedIn && token) {
      setHistoryLoading(true);
      fetch('/api/contact?history=true', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => setContactHistory(data.history || []))
        .catch(() => setContactHistory([]))
        .finally(() => setHistoryLoading(false));
    }
  }, [isLoggedIn, token]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'กรุณากรอกชื่อ-นามสกุล';
    if (!formData.email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^[0-9-]{9,13}$/.test(formData.phone)) {
      newErrors.phone = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง';
    }
    if (!formData.subject.trim()) newErrors.subject = 'กรุณากรอกเรื่อง';
    if (!formData.message.trim()) {
      newErrors.message = 'กรุณากรอกข้อความ';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'ข้อความต้องมีอย่างน้อย 10 ตัวอักษร';
    }
    if (formData.attachment) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (formData.attachment.size > maxSize) {
        newErrors.attachment = 'ไฟล์แนบต้องมีขนาดไม่เกิน 10 MB';
      }
      const allowed = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowed.includes(formData.attachment.type)) {
        newErrors.attachment = 'รองรับเฉพาะไฟล์ PDF, รูปภาพ (JPG, PNG) และ Word';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        tenantId: 'default',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        wantCallback: formData.wantCallback,
      };

      if (isLoggedIn && citizen) {
        body.citizenId = citizen.id;
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // silently handle
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field as keyof FormErrors];
        return copy;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange('attachment', file);
  };

  const removeAttachment = () => {
    handleChange('attachment', null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ติดต่อเรา</h1>
          <p className="text-blue-100 text-lg">ช่องทางการติดต่อเทศบาลตำบลสมาร์ทซิตี้</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <a href="/" className="hover:text-white">
              หน้าแรก
            </a>
            <span>/</span>
            <span>ติดต่อเรา</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Auth Prompt (only when not logged in and not loading) */}
        {!authLoading && !isLoggedIn && (
          <div className="mb-8">
            <AuthPrompt
              message="เข้าสู่ระบบเพื่อกรอกข้อมูลอัตโนมัติ"
              compact
              returnUrl="/contact"
            />
          </div>
        )}

        {/* Contact Info Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">ที่อยู่</h3>
            <p className="text-sm text-gray-600">
              เลขที่ 999 ถนนเทศบาล 1<br />
              ตำบลสมาร์ทซิตี้ อำเภอเมือง<br />
              จังหวัดสมาร์ท 10000
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">โทรศัพท์</h3>
            <p className="text-sm text-gray-600">
              02-XXX-XXXX (สายตรง)<br />
              02-XXX-XXXX ต่อ 101-110<br />
              สายด่วน: 1132
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">อีเมลและแฟกซ์</h3>
            <p className="text-sm text-gray-600">
              info@smartcity.go.th<br />
              แฟกซ์: 02-XXX-XXXX
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">เวลาทำการ</h3>
            <p className="text-sm text-gray-600">
              จันทร์ - ศุกร์<br />
              08:30 - 16:30 น.<br />
              (ปิดวันเสาร์-อาทิตย์ และวันหยุดนักขัตฤกษ์)
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Send className="w-6 h-6 text-blue-600" />
              ส่งข้อความถึงเรา
            </h2>

            {/* Logged in indicator */}
            {isLoggedIn && citizen && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-2.5 mb-5">
                <CheckCircle className="w-4 h-4" />
                <span>
                  กำลังส่งในนาม <strong>{citizen.name}</strong>
                </span>
              </div>
            )}

            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">ส่งข้อความสำเร็จ!</h3>
                <p className="text-gray-600 mb-6">
                  ขอบคุณสำหรับข้อความ เราจะตอบกลับภายใน 1-3 วันทำการ
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: citizen?.name || '',
                      email: citizen?.email || '',
                      phone: citizen?.phone || '',
                      subject: '',
                      message: '',
                      wantCallback: false,
                      attachment: null,
                    });
                  }}
                  className="bg-blue-600 text-white px-6 py-3 min-h-[44px] rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ส่งข้อความใหม่
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อีเมล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="08X-XXX-XXXX"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เรื่อง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="ระบุหัวข้อเรื่อง"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ข้อความ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="รายละเอียดข้อความ..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* File Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ไฟล์แนบ (ไม่บังคับ)
                  </label>
                  {formData.attachment ? (
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 flex-1 truncate">
                        {formData.attachment.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {(formData.attachment.size / 1024).toFixed(0)} KB
                      </span>
                      <button
                        type="button"
                        onClick={removeAttachment}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-4 py-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                      <Paperclip className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        คลิกเพื่อแนบไฟล์ (PDF, รูปภาพ, Word - สูงสุด 10MB)
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                  {errors.attachment && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.attachment}
                    </p>
                  )}
                </div>

                {/* Want Callback Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="wantCallback"
                    checked={formData.wantCallback}
                    onChange={(e) => handleChange('wantCallback', e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="wantCallback" className="text-sm text-gray-700">
                    <span className="font-medium">ต้องการรับการติดต่อกลับ</span>
                    <br />
                    <span className="text-gray-500">
                      เจ้าหน้าที่จะติดต่อกลับทางโทรศัพท์หรืออีเมลที่ระบุไว้
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-3 min-h-[44px] rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      กำลังส่ง...
                    </span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      ส่งข้อความ
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact History (logged in only) */}
            {isLoggedIn && (
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  ข้อความที่ส่งไปแล้ว
                </h3>
                {historyLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full mx-auto" />
                    <p className="text-sm text-gray-400 mt-3">กำลังโหลด...</p>
                  </div>
                ) : contactHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">ยังไม่มีข้อความที่ส่ง</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {contactHistory.map((item) => {
                      const st = statusConfig[item.status] || statusConfig.NEW;
                      return (
                        <div
                          key={item.id}
                          className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-800 truncate flex-1">
                              {item.subject}
                            </h4>
                            <span
                              className={`text-xs rounded-full px-3 py-1 text-sm whitespace-nowrap ${st.color}`}
                            >
                              {st.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2">{item.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            ส่งเมื่อ: {new Date(item.createdAt).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Google Maps Placeholder */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 overflow-hidden">
              <div className="h-80 bg-gray-200 flex items-center justify-center relative">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Google Maps</p>
                  <p className="text-gray-400 text-xs mt-1">
                    แผนที่เทศบาลตำบลสมาร์ทซิตี้
                  </p>
                </div>
              </div>
            </div>

            {/* Department Contacts */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                เบอร์โทรศัพท์ภายใน
              </h3>
              <div className="space-y-3">
                {[
                  { dept: 'สำนักปลัดเทศบาล', ext: '101-103' },
                  { dept: 'กองคลัง', ext: '201-203' },
                  { dept: 'กองช่าง', ext: '301-303' },
                  { dept: 'กองสาธารณสุขฯ', ext: '401-403' },
                  { dept: 'กองการศึกษา', ext: '501-503' },
                  { dept: 'กองสวัสดิการสังคม', ext: '601-603' },
                  { dept: 'งานป้องกันฯ (เหตุด่วน)', ext: '199' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-700">{item.dept}</span>
                    <span className="text-sm font-mono text-blue-600">ต่อ {item.ext}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                ช่องทางออนไลน์
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Facebook', handle: 'เทศบาลตำบลสมาร์ทซิตี้', icon: LogIn },
                  { name: 'LINE Official', handle: '@smartcity', icon: MessageSquare },
                  { name: 'เว็บไซต์', handle: 'www.smartcity.go.th', icon: Globe },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.handle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
