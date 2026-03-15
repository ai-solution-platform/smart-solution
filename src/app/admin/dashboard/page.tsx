'use client';

import {
  Eye,
  Newspaper,
  MessageSquareWarning,
  FileText,
  Plus,
  ArrowRight,
  Clock,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import StatsCard from '@/components/admin/StatsCard';

const recentActivities = [
  { id: 1, text: 'เพิ่มข่าวสาร "โครงการพัฒนาชุมชนปี 2569"', user: 'สมชาย ดี', time: '10 นาทีที่แล้ว', type: 'create' },
  { id: 2, text: 'อัปเดตสถานะเรื่องร้องเรียน #R-2569-042', user: 'สมหญิง ใจดี', time: '30 นาทีที่แล้ว', type: 'update' },
  { id: 3, text: 'อัปโหลดเอกสารประกาศสอบราคา', user: 'วิชัย สว่าง', time: '1 ชั่วโมงที่แล้ว', type: 'upload' },
  { id: 4, text: 'แก้ไขหน้าเพจ "ข้อมูลทั่วไป"', user: 'สมชาย ดี', time: '2 ชั่วโมงที่แล้ว', type: 'edit' },
  { id: 5, text: 'เพิ่มประกาศ "รับสมัครพนักงาน"', user: 'สมหญิง ใจดี', time: '3 ชั่วโมงที่แล้ว', type: 'create' },
];

const recentNews = [
  { id: 1, title: 'โครงการพัฒนาชุมชนปี 2569', status: 'เผยแพร่', date: '16 มี.ค. 2569', views: 245 },
  { id: 2, title: 'กิจกรรมวันเด็กแห่งชาติ ประจำปี 2569', status: 'เผยแพร่', date: '15 มี.ค. 2569', views: 189 },
  { id: 3, title: 'ประกาศปิดสำนักงานชั่วคราว', status: 'แบบร่าง', date: '14 มี.ค. 2569', views: 0 },
  { id: 4, title: 'ประชุมสภาท้องถิ่น สมัยสามัญ', status: 'เผยแพร่', date: '13 มี.ค. 2569', views: 312 },
  { id: 5, title: 'โครงการฝึกอบรมอาชีพ', status: 'เผยแพร่', date: '12 มี.ค. 2569', views: 156 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
          <p className="text-sm text-gray-500 mt-1">ภาพรวมระบบจัดการเว็บไซต์</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/content/news/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่มข่าวใหม่
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="ผู้เข้าชมวันนี้"
          value={1284}
          icon={Eye}
          color="blue"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="ข่าวทั้งหมด"
          value={156}
          icon={Newspaper}
          color="green"
          trend={{ value: 3.2, isPositive: true }}
        />
        <StatsCard
          title="เรื่องร้องเรียนรอดำเนินการ"
          value={8}
          icon={MessageSquareWarning}
          color="orange"
          trend={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title="เอกสารทั้งหมด"
          value={432}
          icon={FileText}
          color="purple"
          trend={{ value: 5.1, isPositive: true }}
        />
      </div>

      {/* Charts Placeholder + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">สถิติผู้เข้าชม</h2>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>7 วันล่าสุด</option>
              <option>30 วันล่าสุด</option>
              <option>3 เดือนล่าสุด</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">กราฟสถิติผู้เข้าชม</p>
              <p className="text-xs text-gray-300 mt-1">(จะเชื่อมต่อ Analytics)</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ทางลัด</h2>
          <div className="space-y-2">
            {[
              { label: 'เพิ่มข่าวสาร', href: '/admin/content/news/create', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
              { label: 'เพิ่มประกาศ', href: '/admin/content/announcements', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
              { label: 'จัดการเรื่องร้องเรียน', href: '/admin/complaints', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              { label: 'อัปโหลดเอกสาร', href: '/admin/content/downloads', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
              { label: 'ตั้งค่าแบนเนอร์', href: '/admin/banners', color: 'bg-pink-50 text-pink-700 hover:bg-pink-100' },
              { label: 'จัดการผู้ใช้งาน', href: '/admin/users', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${action.color}`}
              >
                {action.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity + Recent News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">กิจกรรมล่าสุด</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{activity.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activity.user} &middot; {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">ข่าวล่าสุด</h2>
            <Link
              href="/admin/content/news"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ดูทั้งหมด
            </Link>
          </div>
          <div className="space-y-3">
            {recentNews.map((news) => (
              <div
                key={news.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm text-gray-700 truncate font-medium">
                    {news.title}
                  </p>
                  <p className="text-xs text-gray-400">{news.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{news.views} ครั้ง</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      news.status === 'เผยแพร่'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {news.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
