'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Shield,
  UserCheck,
  UserX,
  AlertTriangle,
  Calendar,
  Activity,
  FileText,
  MessageSquare,
  Link2,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

interface CitizenListItem {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  avatar: string | null;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isActive: boolean;
  loginCount: number;
  lastLoginAt: string | null;
  createdAt: string;
  providers: string[];
}

interface CitizenProfile360 {
  citizen: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    avatar: string | null;
    subdistrict: string | null;
    district: string | null;
    province: string | null;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isActive: boolean;
    loginCount: number;
    lastLoginAt: string | null;
    createdAt: string;
  };
  socialAccounts: {
    provider: string;
    providerName: string | null;
    providerEmail: string | null;
    createdAt: string;
  }[];
  recentActivities: {
    type: string;
    action: string;
    metadata: Record<string, unknown> | null;
    createdAt: string;
  }[];
  complaints: {
    id: string;
    trackingNumber: string;
    category: string;
    subject: string;
    status: string;
    createdAt: string;
  }[];
  contactSubmissions: {
    id: string;
    subject: string;
    status: string;
    createdAt: string;
  }[];
  consents: {
    consentType: string;
    isGranted: boolean;
    grantedAt: string;
    revokedAt: string | null;
    version: string;
  }[];
  stats: {
    totalActivities: number;
    totalComplaints: number;
    totalDownloads: number;
    totalFormSubmissions: number;
    totalPageViews: number;
    daysSinceRegistration: number;
    avgSessionsPerMonth: number;
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface HeaderStats {
  totalRegistered: number;
  verifiedPhone: number;
  verifiedEmail: number;
  active30d: number;
}

// =============================================================================
// Component
// =============================================================================

export default function CitizenManagementPage() {
  const [citizens, setCitizens] = useState<CitizenListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [headerStats, setHeaderStats] = useState<HeaderStats>({
    totalRegistered: 0,
    verifiedPhone: 0,
    verifiedEmail: 0,
    active30d: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Profile 360 modal
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenProfile360 | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileTab, setProfileTab] = useState<
    'info' | 'activity' | 'complaints' | 'documents' | 'consents'
  >('info');

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchCitizens = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });
      if (search) params.set('search', search);
      if (filterProvider) params.set('provider', filterProvider);
      if (filterDateFrom) params.set('dateFrom', filterDateFrom);
      if (filterDateTo) params.set('dateTo', filterDateTo);

      const res = await fetch(`/api/citizens?${params}`);
      if (res.ok) {
        const json = await res.json();
        setCitizens(json.citizens);
        setPagination(json.pagination);
        setHeaderStats(json.stats);
      }
    } catch (error) {
      console.error('Failed to fetch citizens:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filterProvider, filterDateFrom, filterDateTo]);

  useEffect(() => {
    fetchCitizens();
  }, [fetchCitizens]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const viewProfile360 = async (citizenId: string) => {
    setProfileLoading(true);
    setProfileTab('info');
    try {
      const res = await fetch(`/api/citizens/${citizenId}`);
      if (res.ok) {
        const json = await res.json();
        setSelectedCitizen(json);
      }
    } catch (error) {
      console.error('Failed to fetch citizen profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteConfirm !== 'ยืนยันลบข้อมูล') return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/citizens/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteTarget(null);
        setDeleteConfirm('');
        fetchCitizens();
      }
    } catch (error) {
      console.error('Failed to delete citizen:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'ชื่อ',
      'เบอร์โทร',
      'อีเมล',
      'วันลงทะเบียน',
      'เข้าสู่ระบบ (ครั้ง)',
      'ช่องทาง',
      'สถานะ',
    ];
    const rows = citizens.map((c) => [
      c.name,
      c.phone || '',
      c.email || '',
      new Date(c.createdAt).toLocaleDateString('th-TH'),
      String(c.loginCount),
      c.providers.join(', '),
      c.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน',
    ]);

    const csv =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citizens-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const providerLabels: Record<string, string> = {
    line: 'LINE',
    google: 'Google',
    facebook: 'Facebook',
    phone: 'เบอร์โทร',
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    SUBMITTED: { label: 'ยื่นเรื่อง', color: 'bg-gray-100 text-gray-700' },
    RECEIVED: { label: 'รับเรื่อง', color: 'bg-blue-100 text-blue-700' },
    IN_PROGRESS: { label: 'ดำเนินการ', color: 'bg-yellow-100 text-yellow-700' },
    RESOLVED: { label: 'แก้ไขแล้ว', color: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'ปฏิเสธ', color: 'bg-red-100 text-red-700' },
  };

  const activityTypeLabels: Record<string, string> = {
    PAGE_VIEW: 'เข้าชมหน้าเว็บ',
    FORM_SUBMISSION: 'ส่งแบบฟอร์ม',
    SERVICE_USAGE: 'ใช้บริการ',
    DOWNLOAD: 'ดาวน์โหลด',
    LOGIN: 'เข้าสู่ระบบ',
    COMPLAINT: 'ร้องเรียน',
    CONTACT: 'ติดต่อ',
    PROFILE_UPDATE: 'อัปเดตโปรไฟล์',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            <Users className="inline-block w-7 h-7 mr-2 text-blue-600" />
            จัดการข้อมูลพลเมือง
          </h1>
          <p className="text-gray-500 mt-1">ข้อมูลพลเมืองที่ลงทะเบียนในระบบ (PDPA Compliant)</p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          <Download className="w-4 h-4" />
          ส่งออก CSV
        </button>
      </div>

      {/* Statistics Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {headerStats.totalRegistered.toLocaleString('th-TH')}
              </div>
              <div className="text-xs text-gray-500">ลงทะเบียนทั้งหมด</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {headerStats.verifiedPhone.toLocaleString('th-TH')}
              </div>
              <div className="text-xs text-gray-500">ยืนยันเบอร์โทร</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {headerStats.verifiedEmail.toLocaleString('th-TH')}
              </div>
              <div className="text-xs text-gray-500">ยืนยันอีเมล</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {headerStats.active30d.toLocaleString('th-TH')}
              </div>
              <div className="text-xs text-gray-500">ใช้งานใน 30 วัน</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="ค้นหาชื่อ, เบอร์โทร, อีเมล..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 text-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            ตัวกรอง
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            ค้นหา
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">ช่องทาง</label>
              <select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
              >
                <option value="">ทั้งหมด</option>
                <option value="line">LINE</option>
                <option value="google">Google</option>
                <option value="facebook">Facebook</option>
                <option value="phone">เบอร์โทร (OTP)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">ลงทะเบียนตั้งแต่</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">ถึงวันที่</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
              />
            </div>
          </div>
        )}
      </div>

      {/* Citizen Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">ชื่อ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">เบอร์โทร</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">อีเมล</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">วันลงทะเบียน</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">เข้าระบบ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">ช่องทาง</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">สถานะ</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading && citizens.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    กำลังโหลด...
                  </td>
                </tr>
              ) : citizens.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <UserX className="w-8 h-8 mx-auto mb-2" />
                    ไม่พบข้อมูลพลเมือง
                  </td>
                </tr>
              ) : (
                citizens.map((citizen) => (
                  <tr
                    key={citizen.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                          {citizen.avatar ? (
                            <img
                              src={citizen.avatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            citizen.name.charAt(0)
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{citizen.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        {citizen.phone || '-'}
                        {citizen.isPhoneVerified && (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        {citizen.email || '-'}
                        {citizen.isEmailVerified && (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(citizen.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {citizen.loginCount}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {citizen.providers.map((p) => (
                          <span
                            key={p}
                            className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600"
                          >
                            {providerLabels[p] || p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          citizen.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {citizen.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => viewProfile360(citizen.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="ดูโปรไฟล์ 360"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({ id: citizen.id, name: citizen.name })
                          }
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="ลบข้อมูลพลเมือง"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              แสดง {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} จาก{' '}
              {pagination.total.toLocaleString('th-TH')} รายการ
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 px-3">
                หน้า {pagination.page} / {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile 360 Modal */}
      {(selectedCitizen || profileLoading) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 mb-10">
            {profileLoading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
                <p className="text-gray-500">กำลังโหลดข้อมูลพลเมือง...</p>
              </div>
            ) : selectedCitizen ? (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                      {selectedCitizen.citizen.avatar ? (
                        <img
                          src={selectedCitizen.citizen.avatar}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        selectedCitizen.citizen.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        โปรไฟล์ 360 - {selectedCitizen.citizen.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        ลงทะเบียนเมื่อ{' '}
                        {new Date(selectedCitizen.citizen.createdAt).toLocaleDateString(
                          'th-TH',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}{' '}
                        ({selectedCitizen.stats.daysSinceRegistration} วันที่แล้ว)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCitizen(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 p-6 bg-gray-50">
                  <MiniStat label="กิจกรรม" value={selectedCitizen.stats.totalActivities} />
                  <MiniStat label="ร้องเรียน" value={selectedCitizen.stats.totalComplaints} />
                  <MiniStat label="ดาวน์โหลด" value={selectedCitizen.stats.totalDownloads} />
                  <MiniStat label="แบบฟอร์ม" value={selectedCitizen.stats.totalFormSubmissions} />
                  <MiniStat label="เข้าชม" value={selectedCitizen.stats.totalPageViews} />
                  <MiniStat
                    label="เฉลี่ย/เดือน"
                    value={selectedCitizen.stats.avgSessionsPerMonth}
                  />
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6">
                  {[
                    { key: 'info', label: 'ข้อมูลส่วนตัว', icon: Users },
                    { key: 'activity', label: 'กิจกรรม', icon: Activity },
                    { key: 'complaints', label: 'ร้องเรียน', icon: MessageSquare },
                    { key: 'documents', label: 'เอกสาร', icon: FileText },
                    { key: 'consents', label: 'ความยินยอม', icon: Shield },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setProfileTab(tab.key as typeof profileTab)}
                      className={`flex items-center gap-1.5 px-4 py-3 text-sm border-b-2 -mb-px transition-colors ${
                        profileTab === tab.key
                          ? 'border-blue-600 text-blue-600 font-medium'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                  {profileTab === 'info' && (
                    <div className="space-y-6">
                      {/* Personal Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRow label="ชื่อ" value={selectedCitizen.citizen.name} />
                        <InfoRow
                          label="เบอร์โทร"
                          value={selectedCitizen.citizen.phone || '-'}
                          verified={selectedCitizen.citizen.isPhoneVerified}
                        />
                        <InfoRow
                          label="อีเมล"
                          value={selectedCitizen.citizen.email || '-'}
                          verified={selectedCitizen.citizen.isEmailVerified}
                        />
                        <InfoRow
                          label="ตำบล/แขวง"
                          value={selectedCitizen.citizen.subdistrict || '-'}
                        />
                        <InfoRow
                          label="อำเภอ/เขต"
                          value={selectedCitizen.citizen.district || '-'}
                        />
                        <InfoRow
                          label="จังหวัด"
                          value={selectedCitizen.citizen.province || '-'}
                        />
                        <InfoRow
                          label="เข้าสู่ระบบ"
                          value={`${selectedCitizen.citizen.loginCount} ครั้ง`}
                        />
                        <InfoRow
                          label="ล่าสุด"
                          value={
                            selectedCitizen.citizen.lastLoginAt
                              ? new Date(selectedCitizen.citizen.lastLoginAt).toLocaleString(
                                  'th-TH'
                                )
                              : 'ยังไม่เคย'
                          }
                        />
                      </div>

                      {/* Linked Accounts */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Link2 className="w-4 h-4" />
                          บัญชีที่เชื่อมต่อ
                        </h3>
                        <div className="space-y-2">
                          {selectedCitizen.socialAccounts.map((sa) => (
                            <div
                              key={sa.provider}
                              className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                            >
                              <div>
                                <span className="font-medium text-sm">
                                  {providerLabels[sa.provider] || sa.provider}
                                </span>
                                {sa.providerName && (
                                  <span className="text-gray-500 ml-2 text-sm">
                                    ({sa.providerName})
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">
                                เชื่อมต่อเมื่อ{' '}
                                {new Date(sa.createdAt).toLocaleDateString('th-TH')}
                              </span>
                            </div>
                          ))}
                          {selectedCitizen.socialAccounts.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-4">
                              ยังไม่มีบัญชีเชื่อมต่อ
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {profileTab === 'activity' && (
                    <div className="space-y-3">
                      {selectedCitizen.recentActivities.map((activity, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 py-2 border-b border-gray-50"
                        >
                          <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                                {activityTypeLabels[activity.type] || activity.type}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(activity.createdAt).toLocaleString('th-TH')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{activity.action}</p>
                          </div>
                        </div>
                      ))}
                      {selectedCitizen.recentActivities.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-8">
                          ยังไม่มีกิจกรรม
                        </p>
                      )}
                    </div>
                  )}

                  {profileTab === 'complaints' && (
                    <div className="space-y-3">
                      {selectedCitizen.complaints.map((c) => (
                        <div
                          key={c.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">#{c.trackingNumber}</span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                statusLabels[c.status]?.color || 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {statusLabels[c.status]?.label || c.status}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{c.subject}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>หมวด: {c.category}</span>
                            <span>
                              {new Date(c.createdAt).toLocaleDateString('th-TH')}
                            </span>
                          </div>
                        </div>
                      ))}
                      {selectedCitizen.complaints.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-8">
                          ไม่มีประวัติการร้องเรียน
                        </p>
                      )}
                    </div>
                  )}

                  {profileTab === 'documents' && (
                    <div className="space-y-2">
                      {selectedCitizen.recentActivities
                        .filter((a) => a.type === 'DOWNLOAD')
                        .map((a, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-2 border-b border-gray-50"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{a.action}</span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(a.createdAt).toLocaleString('th-TH')}
                            </span>
                          </div>
                        ))}
                      {selectedCitizen.recentActivities.filter((a) => a.type === 'DOWNLOAD')
                        .length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-8">
                          ไม่มีประวัติการดาวน์โหลด
                        </p>
                      )}
                    </div>
                  )}

                  {profileTab === 'consents' && (
                    <div className="space-y-3">
                      {selectedCitizen.consents.map((consent, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {consent.consentType}
                            </p>
                            <p className="text-xs text-gray-500">
                              เวอร์ชัน {consent.version} | ให้ความยินยอมเมื่อ{' '}
                              {new Date(consent.grantedAt).toLocaleDateString('th-TH')}
                            </p>
                          </div>
                          <div>
                            {consent.isGranted && !consent.revokedAt ? (
                              <span className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                ยินยอม
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-red-600">
                                <XCircle className="w-4 h-4" />
                                ถอนความยินยอม
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {selectedCitizen.consents.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-8">
                          ไม่มีบันทึกความยินยอม
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">ลบข้อมูลพลเมือง</h3>
                <p className="text-sm text-gray-500">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>คำเตือน (PDPA):</strong> ข้อมูลของ <strong>{deleteTarget.name}</strong>{' '}
                จะถูกทำให้ไม่สามารถระบุตัวตนได้ (Anonymize) แต่จะไม่ถูกลบออกจากระบบอย่างถาวร
                เพื่อรักษาความถูกต้องของข้อมูลสถิติ
              </p>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-700 block mb-1">
                พิมพ์ &quot;ยืนยันลบข้อมูล&quot; เพื่อดำเนินการ
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
                placeholder="ยืนยันลบข้อมูล"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteConfirm('');
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteConfirm !== 'ยืนยันลบข้อมูล' || deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? (
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'ลบข้อมูลพลเมือง'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-gray-900">{value.toLocaleString('th-TH')}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  verified,
}: {
  label: string;
  value: string;
  verified?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900 flex items-center gap-1">
        {value}
        {verified !== undefined &&
          (verified ? (
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-gray-300" />
          ))}
      </dd>
    </div>
  );
}
