'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  MessageSquareWarning,
  ChevronRight,
  FileText,
  Eye,
  XCircle,
  User,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { useCitizenAuth } from '@/hooks/useCitizenAuth';
import AuthPrompt from '@/components/shared/AuthPrompt';

// ── Types ────────────────────────────────────────────────────────────

interface ComplaintDetail {
  trackingNumber: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  responseNote?: string;
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

// ── Constants ────────────────────────────────────────────────────────

const statusLabels: Record<string, string> = {
  SUBMITTED: 'ส่งเรื่อง',
  RECEIVED: 'รับเรื่อง',
  IN_PROGRESS: 'กำลังดำเนินการ',
  RESOLVED: 'แก้ไขแล้ว',
  REJECTED: 'ไม่รับเรื่อง',
};

const statusColors: Record<string, string> = {
  SUBMITTED: 'bg-gray-100 text-gray-600 border-gray-200',
  RECEIVED: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  RESOLVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
};

const timelineSteps = [
  { key: 'SUBMITTED', label: 'ส่งเรื่อง', description: 'ส่งเรื่องร้องเรียนเข้าระบบเรียบร้อย' },
  { key: 'RECEIVED', label: 'รับเรื่อง', description: 'เจ้าหน้าที่รับเรื่องและตรวจสอบแล้ว' },
  { key: 'IN_PROGRESS', label: 'กำลังดำเนินการ', description: 'เจ้าหน้าที่กำลังดำเนินการแก้ไข' },
  { key: 'RESOLVED', label: 'แก้ไขแล้ว', description: 'ดำเนินการแก้ไขเสร็จสิ้น' },
];

const stepOrder: Record<string, number> = {
  SUBMITTED: 0,
  RECEIVED: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
};

const timelineCircleColors: Record<number, { active: string; line: string }> = {
  0: { active: 'bg-gray-200 text-gray-600', line: 'bg-gray-300' },
  1: { active: 'bg-blue-100 text-blue-600', line: 'bg-blue-300' },
  2: { active: 'bg-yellow-100 text-yellow-600', line: 'bg-yellow-300' },
  3: { active: 'bg-green-100 text-green-600', line: 'bg-green-300' },
};

// ── Helpers ──────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function formatDateShort(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ── Main Component ───────────────────────────────────────────────────

export default function ComplaintTrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <ComplaintTrackContent />
    </Suspense>
  );
}

function ComplaintTrackContent() {
  const searchParams = useSearchParams();
  const initialNumber = searchParams.get('number') || '';

  const { isLoggedIn, isLoading: authLoading, citizen, logout } = useCitizenAuth();

  const [trackingNumber, setTrackingNumber] = useState(initialNumber);
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Logged-in user's complaints
  const [myComplaints, setMyComplaints] = useState<ComplaintRecord[]>([]);
  const [myComplaintsLoading, setMyComplaintsLoading] = useState(false);

  // Auto-search if number provided in URL
  useEffect(() => {
    if (initialNumber) {
      searchComplaint(initialNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNumber]);

  // Auto-load citizen complaints when logged in
  useEffect(() => {
    if (isLoggedIn && !authLoading) {
      loadMyComplaints();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, authLoading]);

  const searchComplaint = async (num: string) => {
    const trimmed = num.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const res = await fetch(`/api/complaints/${encodeURIComponent(trimmed)}?public=true`);
      if (res.ok) {
        const data = await res.json();
        setComplaint(data);
      } else if (res.status === 404) {
        setError('ไม่พบเรื่องร้องเรียนหมายเลขนี้ กรุณาตรวจสอบเลขที่ติดตามอีกครั้ง');
      } else {
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSearch = () => {
    searchComplaint(trackingNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-3">
                <Search className="w-8 h-8" />
                ติดตามสถานะเรื่องร้องเรียน
              </h1>
              <p className="text-blue-100">ตรวจสอบความคืบหน้าเรื่องร้องเรียนของคุณ</p>
              <div className="flex items-center gap-2 mt-3 text-sm text-blue-200">
                <Link href="/" className="hover:text-white">หน้าแรก</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/complaints" className="hover:text-white">ร้องเรียน</Link>
                <ChevronRight className="w-3 h-3" />
                <span>ติดตามสถานะ</span>
              </div>
            </div>

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Auth Prompt for guests */}
        {!authLoading && !isLoggedIn && (
          <div className="mb-6">
            <AuthPrompt
              message="เข้าสู่ระบบเพื่อดูเรื่องร้องเรียนทั้งหมดของคุณอัตโนมัติ"
              compact
              returnUrl="/complaints/track"
            />
          </div>
        )}

        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-6 mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-3">ค้นหาด้วยเลขที่ติดตาม</h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => {
                  setTrackingNumber(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="CMP-XXXXXXXX-XXXX"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !trackingNumber.trim()}
              className="bg-blue-600 text-white px-6 py-3 min-h-[44px] rounded-lg font-medium hover:bg-blue-700 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ค้นหา'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center mb-8">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
            <p className="text-red-600">{error}</p>
            <Link
              href="/complaints"
              className="text-sm text-red-500 hover:underline mt-2 inline-block"
            >
              กลับไปหน้าร้องเรียน
            </Link>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-12 text-center mb-8">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-gray-500">กำลังค้นหาเรื่องร้องเรียน...</p>
          </div>
        )}

        {/* ── Complaint Detail ───────────────────────────────── */}
        {complaint && !loading && (
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">เลขที่ติดตาม</p>
                  <p className="text-xl font-mono font-bold text-blue-600">
                    {complaint.trackingNumber}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full font-medium border ${
                    statusColors[complaint.status] || 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {complaint.status === 'RESOLVED' && <CheckCircle className="w-4 h-4" />}
                  {complaint.status === 'IN_PROGRESS' && <Loader2 className="w-4 h-4" />}
                  {complaint.status === 'RECEIVED' && <Eye className="w-4 h-4" />}
                  {complaint.status === 'SUBMITTED' && <Clock className="w-4 h-4" />}
                  {complaint.status === 'REJECTED' && <XCircle className="w-4 h-4" />}
                  {statusLabels[complaint.status] || complaint.status}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-0.5">หัวข้อเรื่อง</span>
                  <span className="text-gray-800 font-medium">{complaint.subject}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">ประเภท</span>
                  <span className="text-gray-800">{complaint.category}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">วันที่แจ้ง</span>
                  <span className="text-gray-800">{formatDate(complaint.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">อัปเดตล่าสุด</span>
                  <span className="text-gray-800">{formatDate(complaint.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Response Note */}
            {complaint.responseNote && (
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquareWarning className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">หมายเหตุจากเจ้าหน้าที่</p>
                    <p className="text-sm text-blue-700">{complaint.responseNote}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div className="px-6 py-6">
              <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                ขั้นตอนการดำเนินการ
              </h3>

              {complaint.status === 'REJECTED' ? (
                <div className="bg-red-50 border border-red-100 rounded-lg p-5 text-center">
                  <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                  <p className="text-red-700 font-medium">เรื่องร้องเรียนนี้ไม่ได้รับการดำเนินการ</p>
                  <p className="text-sm text-red-500 mt-1">กรุณาติดต่อเจ้าหน้าที่สำหรับข้อมูลเพิ่มเติม</p>
                </div>
              ) : (
                <div className="relative">
                  {timelineSteps.map((step, i) => {
                    const currentStep = stepOrder[complaint.status] ?? -1;
                    const completed = i <= currentStep;
                    const isCurrent = i === currentStep;
                    const colors = timelineCircleColors[i] || timelineCircleColors[0];

                    const circleClass = completed
                      ? `${colors.active} ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`
                      : 'bg-gray-100 text-gray-300';

                    const lineClass = completed && i < currentStep ? colors.line : 'bg-gray-200';

                    // Show date for completed steps
                    let dateText = '';
                    if (completed && i === 0) {
                      dateText = formatDate(complaint.createdAt);
                    } else if (completed && i === currentStep) {
                      dateText = formatDate(complaint.updatedAt);
                    } else if (completed) {
                      dateText = ''; // intermediate steps don't have exact dates
                    }

                    return (
                      <div key={step.key} className="flex gap-4 mb-0 last:mb-0">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${circleClass}`}
                          >
                            {completed ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>
                          {i < timelineSteps.length - 1 && (
                            <div className={`w-0.5 h-12 ${lineClass}`} />
                          )}
                        </div>
                        <div className="pt-1.5 pb-6">
                          <h5
                            className={`font-medium text-sm ${
                              completed ? 'text-gray-800' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </h5>
                          <p
                            className={`text-xs mt-0.5 ${
                              completed ? 'text-gray-500' : 'text-gray-300'
                            }`}
                          >
                            {step.description}
                          </p>
                          {dateText && (
                            <p className="text-xs text-gray-400 mt-1">{dateText}</p>
                          )}
                          {!completed && (
                            <p className="text-xs text-gray-300 mt-1">รอดำเนินการ</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── My Complaints (logged-in) ──────────────────────── */}
        {isLoggedIn && !authLoading && (
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              เรื่องร้องเรียนทั้งหมดของฉัน
            </h2>

            {myComplaintsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">กำลังโหลด...</p>
              </div>
            ) : myComplaints.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">ยังไม่มีเรื่องร้องเรียน</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {myComplaints.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setTrackingNumber(c.trackingNumber);
                      searchComplaint(c.trackingNumber);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full text-left py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-sm text-blue-600 font-medium">
                          {c.trackingNumber}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            statusColors[c.status]?.replace('border-', '').split(' ').slice(0, 2).join(' ') ||
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {statusLabels[c.status] || c.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 truncate">{c.subject}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c.category} | {formatDateShort(c.createdAt)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/complaints"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
          >
            <MessageSquareWarning className="w-4 h-4" />
            กลับไปหน้าร้องเรียน
          </Link>
        </div>
      </div>
    </div>
  );
}
