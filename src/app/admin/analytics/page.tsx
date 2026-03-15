'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  Users,
  Eye,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

interface OverviewStats {
  totalCitizens: number;
  activeUsers30d: number;
  totalPageViews: number;
  totalServiceUsage: number;
}

interface PopulationInsights {
  registrationsByMonth: { month: string; count: number }[];
  ageGroups: { group: string; count: number }[];
  subdistrictDistribution: { subdistrict: string; count: number }[];
  providerBreakdown: { provider: string; count: number }[];
  avgLoginCount: number;
  consentMarketingRate: number;
}

interface ServiceAnalytics {
  serviceBreakdown: { serviceType: string; count: number; completionRate: number }[];
  complaintCategories: { category: string; count: number; resolvedCount: number }[];
  avgResolutionDays: number;
  resolutionRate: number;
  topDocuments: { title: string; downloads: number }[];
}

interface EngagementMetrics {
  hourlyBreakdown: { hour: number; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
  dailyBreakdown: { date: string; count: number }[];
}

interface AnalyticsData {
  overview: OverviewStats;
  population: PopulationInsights;
  services: ServiceAnalytics;
  engagement: EngagementMetrics;
}

// =============================================================================
// Component
// =============================================================================

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        dateFrom,
        dateTo,
      });
      const res = await fetch(`/api/admin/analytics?${params}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob(
      [exportFormat === 'json' ? JSON.stringify(data, null, 2) : convertToCSV(data)],
      { type: exportFormat === 'json' ? 'application/json' : 'text/csv' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateFrom}-${dateTo}.${exportFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (analyticsData: AnalyticsData): string => {
    const rows: string[] = ['\uFEFF'];
    rows.push('ภาพรวม');
    rows.push('ตัวชี้วัด,จำนวน');
    rows.push(`พลเมืองลงทะเบียนทั้งหมด,${analyticsData.overview.totalCitizens}`);
    rows.push(`ผู้ใช้งานใน 30 วัน,${analyticsData.overview.activeUsers30d}`);
    rows.push(`การเข้าชมทั้งหมด,${analyticsData.overview.totalPageViews}`);
    rows.push(`การใช้บริการทั้งหมด,${analyticsData.overview.totalServiceUsage}`);
    rows.push('');
    rows.push('กลุ่มอายุ');
    rows.push('กลุ่ม,จำนวน');
    for (const ag of analyticsData.population.ageGroups) {
      rows.push(`${ag.group},${ag.count}`);
    }
    return rows.join('\n');
  };

  const providerLabels: Record<string, string> = {
    line: 'LINE',
    google: 'Google',
    facebook: 'Facebook',
    phone: 'เบอร์โทร (OTP)',
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">กำลังโหลดข้อมูลวิเคราะห์...</p>
        </div>
      </div>
    );
  }

  const overview = data?.overview || {
    totalCitizens: 0,
    activeUsers30d: 0,
    totalPageViews: 0,
    totalServiceUsage: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            <BarChart3 className="inline-block w-7 h-7 mr-2 text-blue-600" />
            แดชบอร์ดวิเคราะห์ข้อมูล
          </h1>
          <p className="text-gray-500 mt-1">City Data Platform - ภาพรวมข้อมูลพลเมืองและการใช้งาน</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm border-none focus:ring-0 p-0 w-32"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm border-none focus:ring-0 p-0 w-32"
            />
          </div>

          {/* Export Button */}
          <div className="flex items-center gap-1">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
              className="text-sm border border-gray-200 rounded-l-lg px-2 py-2 bg-white"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-r-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              ส่งออกข้อมูล
            </button>
          </div>

          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="พลเมืองลงทะเบียนทั้งหมด"
          value={overview.totalCitizens.toLocaleString('th-TH')}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          trend={null}
        />
        <StatCard
          title="ผู้ใช้งานใน 30 วัน"
          value={overview.activeUsers30d.toLocaleString('th-TH')}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend={overview.totalCitizens > 0
            ? Math.round((overview.activeUsers30d / overview.totalCitizens) * 100)
            : 0}
        />
        <StatCard
          title="การเข้าชมทั้งหมด"
          value={overview.totalPageViews.toLocaleString('th-TH')}
          icon={<Eye className="w-6 h-6" />}
          color="purple"
          trend={null}
        />
        <StatCard
          title="การใช้บริการ e-Service"
          value={overview.totalServiceUsage.toLocaleString('th-TH')}
          icon={<FileText className="w-6 h-6" />}
          color="amber"
          trend={null}
        />
      </div>

      {/* Population Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <Users className="inline-block w-5 h-5 mr-2 text-blue-600" />
          ข้อมูลประชากร
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration by Month */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              จำนวนลงทะเบียนรายเดือน
            </h3>
            <div className="space-y-2">
              {(data?.population.registrationsByMonth || []).slice(-6).map((item) => {
                const maxCount = Math.max(
                  ...((data?.population.registrationsByMonth || []).map((r) => r.count)),
                  1
                );
                return (
                  <div key={item.month} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-24 text-right">
                      {item.month}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      />
                      <span className="absolute right-2 top-0.5 text-xs font-medium text-gray-700">
                        {item.count.toLocaleString('th-TH')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Age Groups */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">กลุ่มอายุ</h3>
            <div className="space-y-2">
              {(data?.population.ageGroups || []).map((ag) => {
                const total = (data?.population.ageGroups || []).reduce(
                  (s, a) => s + a.count,
                  0
                ) || 1;
                const pct = Math.round((ag.count / total) * 100);
                return (
                  <div key={ag.group} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-28 text-right">
                      {ag.group}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                      <div
                        className="bg-indigo-400 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-16">
                      {ag.count.toLocaleString('th-TH')} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              การกระจายตามตำบล/แขวง
            </h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {(data?.population.subdistrictDistribution || []).slice(0, 10).map((item, idx) => (
                <div
                  key={item.subdistrict}
                  className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">
                    {idx + 1}. {item.subdistrict}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count.toLocaleString('th-TH')} คน
                  </span>
                </div>
              ))}
              {(data?.population.subdistrictDistribution || []).length === 0 && (
                <p className="text-sm text-gray-400 py-4 text-center">ยังไม่มีข้อมูล</p>
              )}
            </div>
          </div>

          {/* Auth Providers */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              ช่องทางเข้าสู่ระบบ
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {(data?.population.providerBreakdown || []).map((p) => (
                <div
                  key={p.provider}
                  className="bg-gray-50 rounded-lg p-3 text-center"
                >
                  <div className="text-xl font-bold text-gray-900">
                    {p.count.toLocaleString('th-TH')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {providerLabels[p.provider] || p.provider}
                  </div>
                </div>
              ))}
              {(data?.population.providerBreakdown || []).length === 0 && (
                <p className="text-sm text-gray-400 col-span-2 py-4 text-center">
                  ยังไม่มีข้อมูล
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-500">เข้าสู่ระบบเฉลี่ย:</span>{' '}
                <span className="font-medium">
                  {data?.population.avgLoginCount || 0} ครั้ง/คน
                </span>
              </div>
              <div>
                <span className="text-gray-500">ยินยอมรับข่าวสาร:</span>{' '}
                <span className="font-medium">
                  {data?.population.consentMarketingRate || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Used Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <Globe className="inline-block w-5 h-5 mr-2 text-green-600" />
            บริการ e-Service ยอดนิยม
          </h2>
          <div className="space-y-3">
            {(data?.services.serviceBreakdown || []).slice(0, 8).map((s) => (
              <div key={s.serviceType} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{s.serviceType}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{s.count} ครั้ง</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      s.completionRate >= 80
                        ? 'bg-green-100 text-green-700'
                        : s.completionRate >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    สำเร็จ {s.completionRate}%
                  </span>
                </div>
              </div>
            ))}
            {(data?.services.serviceBreakdown || []).length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">ยังไม่มีข้อมูล</p>
            )}
          </div>
        </div>

        {/* Complaint Resolution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <MessageSquare className="inline-block w-5 h-5 mr-2 text-orange-600" />
            สถิติเรื่องร้องเรียน
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {data?.services.resolutionRate || 0}%
              </div>
              <div className="text-xs text-gray-500">อัตราแก้ไขสำเร็จ</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data?.services.avgResolutionDays || 0} วัน
              </div>
              <div className="text-xs text-gray-500">เวลาเฉลี่ยแก้ไข</div>
            </div>
          </div>
          <div className="space-y-2">
            {(data?.services.complaintCategories || []).slice(0, 6).map((c) => (
              <div
                key={c.category}
                className="flex items-center justify-between py-1"
              >
                <span className="text-sm text-gray-700">{c.category}</span>
                <div className="text-sm">
                  <span className="font-medium">{c.count}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-green-600">{c.resolvedCount} แก้ไข</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <TrendingUp className="inline-block w-5 h-5 mr-2 text-purple-600" />
          ตัวชี้วัดการมีส่วนร่วม
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Most Active Time */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              <Clock className="inline-block w-4 h-4 mr-1" />
              ช่วงเวลาที่ใช้งานมากที่สุด
            </h3>
            <div className="grid grid-cols-6 gap-1">
              {(data?.engagement.hourlyBreakdown || []).map((h) => {
                const maxH = Math.max(
                  ...(data?.engagement.hourlyBreakdown || []).map((x) => x.count),
                  1
                );
                const intensity = h.count / maxH;
                return (
                  <div
                    key={h.hour}
                    className="text-center"
                    title={`${h.hour}:00 - ${h.count} ครั้ง`}
                  >
                    <div
                      className="w-full h-8 rounded"
                      style={{
                        backgroundColor: `rgba(99, 102, 241, ${Math.max(0.1, intensity)})`,
                      }}
                    />
                    <span className="text-[10px] text-gray-400">{h.hour}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              ชั่วโมง (0-23) - สีเข้ม = มีผู้ใช้งานมาก
            </p>
          </div>

          {/* Device Breakdown */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              <Monitor className="inline-block w-4 h-4 mr-1" />
              อุปกรณ์ที่ใช้งาน
            </h3>
            <div className="space-y-3">
              {(data?.engagement.deviceBreakdown || []).map((d) => {
                const total = (data?.engagement.deviceBreakdown || []).reduce(
                  (s, x) => s + x.count,
                  0
                ) || 1;
                const pct = Math.round((d.count / total) * 100);
                const Icon =
                  d.device === 'มือถือ'
                    ? Smartphone
                    : d.device === 'แท็บเล็ต'
                      ? Tablet
                      : Monitor;
                return (
                  <div key={d.device} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 w-24">{d.device}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-purple-400 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-10">{pct}%</span>
                  </div>
                );
              })}
              {(data?.engagement.deviceBreakdown || []).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">ยังไม่มีข้อมูล</p>
              )}
            </div>
          </div>

          {/* Browser Breakdown */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              <Globe className="inline-block w-4 h-4 mr-1" />
              เบราว์เซอร์
            </h3>
            <div className="space-y-2">
              {(data?.engagement.browserBreakdown || []).slice(0, 6).map((b) => {
                const total = (data?.engagement.browserBreakdown || []).reduce(
                  (s, x) => s + x.count,
                  0
                ) || 1;
                const pct = Math.round((b.count / total) * 100);
                return (
                  <div
                    key={b.browser}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm text-gray-700">{b.browser}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {b.count.toLocaleString('th-TH')}
                      </span>
                      <span className="text-xs text-gray-400">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
              {(data?.engagement.browserBreakdown || []).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">ยังไม่มีข้อมูล</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Downloads */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <Download className="inline-block w-5 h-5 mr-2 text-teal-600" />
          เอกสารดาวน์โหลดยอดนิยม
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 font-medium text-gray-500">อันดับ</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">ชื่อเอกสาร</th>
                <th className="text-right py-2 px-3 font-medium text-gray-500">
                  จำนวนดาวน์โหลด
                </th>
              </tr>
            </thead>
            <tbody>
              {(data?.services.topDocuments || []).map((doc, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                  <td className="py-2 px-3 text-gray-700">{doc.title}</td>
                  <td className="py-2 px-3 text-right font-medium">
                    {doc.downloads.toLocaleString('th-TH')}
                  </td>
                </tr>
              ))}
              {(data?.services.topDocuments || []).length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-400">
                    ยังไม่มีข้อมูลการดาวน์โหลด
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function StatCard({
  title,
  value,
  icon,
  color,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'amber';
  trend: number | null;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        {trend !== null && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend >= 50 ? 'text-green-600' : 'text-orange-600'
            }`}
          >
            {trend >= 50 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {trend}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{title}</div>
    </div>
  );
}
