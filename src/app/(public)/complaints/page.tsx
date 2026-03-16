'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquareWarning,
  Send,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileUp,
  MapPin,
  Phone,
  Mail,
  User,
  Loader2,
  ClipboardList,
  LogOut,
  ChevronRight,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useCitizenAuth } from '@/hooks/useCitizenAuth';
import AuthPrompt from '@/components/shared/AuthPrompt';

interface ComplaintForm {
  name: string;
  phone: string;
  email: string;
  category: string;
  subject: string;
  description: string;
  location: string;
  file: File | null;
}

interface FormErrors {
  [key: string]: string;
}

interface ComplaintRecord {
  id: string;
  trackingNumber: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  responseNote?: string;
}

const complaintCategories = [
  'ถนน/ทางเท้าชำรุด',
  'ไฟฟ้าสาธารณะดับ',
  'น้ำประปา',
  'ขยะมูลฝอย/ความสะอาด',
  'เสียงรบกวน',
  'น้ำท่วม/ระบายน้ำ',
  'สิ่งแวดล้อม',
  'สัตว์จรจัด',
  'อื่น ๆ',
];

const statusLabels: Record<string, string> = {
  SUBMITTED: 'ส่งเรื่อง',
  RECEIVED: 'รับเรื่อง',
  IN_PROGRESS: 'กำลังดำเนินการ',
  RESOLVED: 'แก้ไขแล้ว',
  REJECTED: 'ไม่รับเรื่อง',
};

const statusColors: Record<string, string> = {
  SUBMITTED: 'bg-gray-100 text-gray-600',
  RECEIVED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  RESOLVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function ComplaintsPage() {
  const { isLoggedIn, isLoading: authLoading, citizen, logout } = useCitizenAuth();

  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'my'>('submit');
  const [formData, setFormData] = useState<ComplaintForm>({
    name: '',
    phone: '',
    email: '',
    category: '',
    subject: '',
    description: '',
    location: '',
    file: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultTrackingNumber, setResultTrackingNumber] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<ComplaintRecord | null>(null);
  const [trackingError, setTrackingError] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);

  // My complaints (logged-in only)
  const [myComplaints, setMyComplaints] = useState<ComplaintRecord[]>([]);
  const [myComplaintsLoading, setMyComplaintsLoading] = useState(false);

  // Pre-fill form when citizen is logged in
  useEffect(() => {
    if (citizen && !submitted) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || citizen.name || '',
        phone: prev.phone || citizen.phone || '',
        email: prev.email || citizen.email || '',
      }));
    }
  }, [citizen, submitted]);

  // Load my complaints when tab is active and user is logged in
  useEffect(() => {
    if (activeTab === 'my' && isLoggedIn) {
      loadMyComplaints();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isLoggedIn]);

  const loadMyComplaints = async () => {
    setMyComplaintsLoading(true);
    try {
      const token = localStorage.getItem('citizen-auth-token');
      const res = await fetch('/api/citizen/complaints', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMyComplaints(data.items || []);
      }
    } catch {
      // Silently fail
    } finally {
      setMyComplaintsLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'กรุณากรอกชื่อ-นามสกุล';
    if (!formData.phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    if (!formData.category) newErrors.category = 'กรุณาเลือกประเภทเรื่องร้องเรียน';
    if (!formData.subject.trim()) newErrors.subject = 'กรุณากรอกหัวข้อเรื่อง';
    if (!formData.description.trim()) {
      newErrors.description = 'กรุณากรอกรายละเอียด';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'กรุณากรอกรายละเอียดอย่างน้อย 20 ตัวอักษร';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const token = isLoggedIn ? localStorage.getItem('citizen-auth-token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tenantId: 'default',
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          category: formData.category,
          subject: formData.subject.trim(),
          description: formData.description.trim(),
          location: formData.location.trim() || undefined,
          citizenId: citizen?.id || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResultTrackingNumber(data.trackingNumber);
        setSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.error || data.errors?.join(', ') || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    } catch {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof ComplaintForm, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleTrack = async () => {
    const num = trackingNumber.trim();
    if (!num) return;

    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResult(null);

    try {
      const res = await fetch(`/api/complaints/${encodeURIComponent(num)}?public=true`);
      if (res.ok) {
        const data = await res.json();
        setTrackingResult(data);
      } else if (res.status === 404) {
        setTrackingError('ไม่พบเรื่องร้องเรียนหมายเลขนี้ กรุณาตรวจสอบเลขที่ติดตามอีกครั้ง');
      } else {
        setTrackingError('เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    } catch {
      setTrackingError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่');
    } finally {
      setTrackingLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setResultTrackingNumber('');
    setFormData({
      name: citizen?.name || '',
      phone: citizen?.phone || '',
      email: citizen?.email || '',
      category: '',
      subject: '',
      description: '',
      location: '',
      file: null,
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                <MessageSquareWarning className="w-9 h-9" />
                ร้องเรียน / ร้องทุกข์
              </h1>
              <p className="text-blue-100 text-lg">ช่องทางรับเรื่องร้องเรียน ร้องทุกข์ และติดตามสถานะ</p>
              <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
                <Link href="/" className="hover:text-white">หน้าแรก</Link>
                <span>/</span>
                <span>ร้องเรียน</span>
              </div>
            </div>

            {/* Auth status indicator */}
            {!authLoading && isLoggedIn && citizen && (
              <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">สวัสดี {citizen.name}</p>
                  <button
                    onClick={logout}
                    className="text-blue-200 hover:text-white text-xs flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Auth Prompt for guests */}
        {!authLoading && !isLoggedIn && (
          <div className="mb-6">
            <AuthPrompt
              message="เข้าสู่ระบบเพื่อกรอกข้อมูลอัตโนมัติ และติดตามสถานะเรื่องร้องเรียน"
              compact
              returnUrl="/complaints"
            />
          </div>
        )}

        {/* Logged-in greeting on mobile */}
        {!authLoading && isLoggedIn && citizen && (
          <div className="sm:hidden bg-white rounded-xl border border-gray-100 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">สวัสดี {citizen.name}</p>
                <p className="text-xs text-gray-500">{citizen.phone || citizen.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              ออกจากระบบ
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
              activeTab === 'submit'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Send className="w-4 h-4 inline mr-2" />
            ยื่นเรื่องร้องเรียน
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
              activeTab === 'track'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            ติดตามสถานะ
          </button>
          {isLoggedIn && (
            <button
              onClick={() => setActiveTab('my')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                activeTab === 'my'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ClipboardList className="w-4 h-4 inline mr-2" />
              เรื่องร้องเรียนของฉัน
            </button>
          )}
        </div>

        {/* ============ SUBMIT TAB ============ */}
        {activeTab === 'submit' && (
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">ส่งเรื่องร้องเรียนสำเร็จ!</h3>
                <p className="text-gray-600 mb-4">
                  เลขที่ติดตาม:{' '}
                  <span className="font-mono font-bold text-blue-600 text-lg">
                    {resultTrackingNumber}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  กรุณาจดเลขที่ติดตามไว้เพื่อใช้ตรวจสอบสถานะ
                </p>
                {isLoggedIn && (
                  <p className="text-sm text-green-600 mb-4">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    เรื่องร้องเรียนนี้เชื่อมกับบัญชีของคุณแล้ว สามารถติดตามได้ที่แท็บ &quot;เรื่องร้องเรียนของฉัน&quot;
                  </p>
                )}
                <p className="text-sm text-gray-500 mb-6">
                  เจ้าหน้าที่จะดำเนินการภายใน 3-5 วันทำการ
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={resetForm}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ส่งเรื่องใหม่
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('track');
                      setTrackingNumber(resultTrackingNumber);
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    ติดตามสถานะ
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">แบบฟอร์มร้องเรียน / ร้องทุกข์</h2>

                {/* Pre-filled indicator */}
                {isLoggedIn && citizen && (
                  <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-2 text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    กรอกข้อมูลส่วนตัวจากบัญชีของคุณอัตโนมัติแล้ว
                  </div>
                )}

                {/* Personal Info */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="w-4 h-4 inline mr-1" />
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } ${isLoggedIn && citizen?.name ? 'bg-gray-50' : ''}`}
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="w-4 h-4 inline mr-1" />
                      เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } ${isLoggedIn && citizen?.phone ? 'bg-gray-50' : ''}`}
                      placeholder="08X-XXX-XXXX"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    อีเมล (ไม่บังคับ)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } ${isLoggedIn && citizen?.email ? 'bg-gray-50' : ''}`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    หัวข้อเรื่อง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="ระบุหัวข้อเรื่องร้องเรียน"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ประเภทเรื่องร้องเรียน <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- เลือกประเภท --</option>
                    {complaintCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รายละเอียดเรื่องร้องเรียน <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="อธิบายรายละเอียดเรื่องร้องเรียนให้ชัดเจน..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    สถานที่เกิดเหตุ (ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ระบุสถานที่ เช่น ซอยเทศบาล 5 หมู่ 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileUp className="w-4 h-4 inline mr-1" />
                    แนบไฟล์ (ไม่บังคับ)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) =>
                        handleChange('file', e.target.files?.[0] || null)
                      }
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        {formData.file
                          ? formData.file.name
                          : 'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวาง'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        รองรับ: รูปภาพ, PDF, DOC (สูงสุด 10 MB)
                      </p>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-3 min-h-[44px] rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      กำลังส่ง...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      ส่งเรื่องร้องเรียน
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ============ TRACK TAB ============ */}
        {activeTab === 'track' && (
          <div>
            {/* Search */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-8 mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">ติดตามสถานะเรื่องร้องเรียน</h2>
              <p className="text-sm text-gray-500 mb-4">
                กรอกเลขที่ติดตามที่ได้รับหลังจากส่งเรื่องร้องเรียน
              </p>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => {
                      setTrackingNumber(e.target.value.toUpperCase());
                      setTrackingResult(null);
                      setTrackingError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="CMP-XXXXXXXX-XXXX"
                  />
                </div>
                <button
                  onClick={handleTrack}
                  disabled={trackingLoading}
                  className="bg-blue-600 text-white px-6 py-3 min-h-[44px] rounded-lg font-medium hover:bg-blue-700 transition-colors shrink-0 disabled:opacity-60"
                >
                  {trackingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ค้นหา'}
                </button>
              </div>

              {isLoggedIn && (
                <p className="text-xs text-gray-400 mt-3">
                  หรือดูเรื่องร้องเรียนทั้งหมดของคุณที่แท็บ{' '}
                  <button
                    onClick={() => setActiveTab('my')}
                    className="text-blue-500 hover:underline"
                  >
                    เรื่องร้องเรียนของฉัน
                  </button>
                </p>
              )}
            </div>

            {/* Error */}
            {trackingError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center mb-8">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                <p className="text-red-600">{trackingError}</p>
              </div>
            )}

            {/* Tracking Result */}
            {trackingResult && (
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-8">
                {/* Summary */}
                <div className="mb-8 pb-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      เลขที่: <span className="text-blue-600 font-mono">{trackingResult.trackingNumber}</span>
                    </h3>
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-medium ${
                        statusColors[trackingResult.status] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {statusLabels[trackingResult.status] || trackingResult.status}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">หัวข้อ:</span>
                      <span className="ml-2 text-gray-800">{trackingResult.subject}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">ประเภท:</span>
                      <span className="ml-2 text-gray-800">{trackingResult.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">วันที่แจ้ง:</span>
                      <span className="ml-2 text-gray-800">{formatDate(trackingResult.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">อัปเดตล่าสุด:</span>
                      <span className="ml-2 text-gray-800">{formatDate(trackingResult.updatedAt)}</span>
                    </div>
                    {trackingResult.responseNote && (
                      <div className="sm:col-span-2">
                        <span className="text-gray-500">หมายเหตุจากเจ้าหน้าที่:</span>
                        <span className="ml-2 text-gray-800">{trackingResult.responseNote}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Timeline */}
                <StatusTimeline status={trackingResult.status} />

                {/* Full detail link */}
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <Link
                    href={`/complaints/track?number=${trackingResult.trackingNumber}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                  >
                    ดูรายละเอียดเพิ่มเติม
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ MY COMPLAINTS TAB ============ */}
        {activeTab === 'my' && isLoggedIn && (
          <div>
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                เรื่องร้องเรียนของฉัน
              </h2>

              {myComplaintsLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
                  <p className="text-gray-500">กำลังโหลด...</p>
                </div>
              ) : myComplaints.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">ยังไม่มีเรื่องร้องเรียน</p>
                  <p className="text-sm text-gray-400 mb-4">
                    เรื่องร้องเรียนที่ส่งขณะเข้าสู่ระบบจะแสดงที่นี่
                  </p>
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    ส่งเรื่องร้องเรียน
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm text-blue-600 font-medium">
                              {complaint.trackingNumber}
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-sm ${
                                statusColors[complaint.status] || 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {statusLabels[complaint.status] || complaint.status}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {complaint.subject}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {complaint.category} | {formatDate(complaint.createdAt)}
                          </p>
                        </div>
                        <Link
                          href={`/complaints/track?number=${complaint.trackingNumber}`}
                          className="shrink-0 text-blue-600 hover:text-blue-700 p-2"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Status Timeline Sub-Component ───────────────────────────────────

interface StatusTimelineProps {
  status: string;
}

const timelineSteps = [
  { key: 'SUBMITTED', label: 'ส่งเรื่อง', description: 'ส่งเรื่องร้องเรียนเข้าระบบ' },
  { key: 'RECEIVED', label: 'รับเรื่อง', description: 'เจ้าหน้าที่รับเรื่องแล้ว' },
  { key: 'IN_PROGRESS', label: 'กำลังดำเนินการ', description: 'กำลังตรวจสอบและดำเนินการ' },
  { key: 'RESOLVED', label: 'แก้ไขแล้ว', description: 'ดำเนินการเสร็จสิ้น' },
];

const stepOrder: Record<string, number> = {
  SUBMITTED: 0,
  RECEIVED: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  REJECTED: -1,
};

function StatusTimeline({ status }: StatusTimelineProps) {
  const currentStep = stepOrder[status] ?? -1;
  const isRejected = status === 'REJECTED';

  if (isRejected) {
    return (
      <div>
        <h4 className="font-semibold text-gray-800 mb-4">สถานะการดำเนินการ</h4>
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 font-medium">เรื่องร้องเรียนนี้ไม่ได้รับการดำเนินการ</p>
          <p className="text-sm text-red-500 mt-1">กรุณาติดต่อเจ้าหน้าที่สำหรับข้อมูลเพิ่มเติม</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-semibold text-gray-800 mb-6">สถานะการดำเนินการ</h4>
      <div className="relative">
        {timelineSteps.map((step, i) => {
          const completed = i <= currentStep;
          const isCurrent = i === currentStep;

          let circleColor = 'bg-gray-100 text-gray-400';
          if (completed && i === 0) circleColor = 'bg-gray-200 text-gray-600';
          if (completed && i === 1) circleColor = 'bg-blue-100 text-blue-600';
          if (completed && i === 2) circleColor = 'bg-yellow-100 text-yellow-600';
          if (completed && i === 3) circleColor = 'bg-green-100 text-green-600';

          return (
            <div key={step.key} className="flex gap-4 mb-6 last:mb-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${circleColor} ${
                    isCurrent ? 'ring-2 ring-offset-2 ring-blue-400' : ''
                  }`}
                >
                  {completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                {i < timelineSteps.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 mt-1 ${
                      completed && i < currentStep ? 'bg-blue-200' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="pb-4">
                <h5
                  className={`font-medium ${
                    completed ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </h5>
                <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
