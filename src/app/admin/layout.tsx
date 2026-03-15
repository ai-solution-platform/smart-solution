'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/admin/Sidebar';
import {
  Menu,
  Bell,
  LogOut,
  User,
  ChevronRight,
  Home,
} from 'lucide-react';

const breadcrumbMap: Record<string, string> = {
  admin: 'แอดมิน',
  dashboard: 'แดชบอร์ด',
  content: 'จัดการเนื้อหา',
  news: 'ข่าวสาร',
  announcements: 'ประกาศ',
  procurement: 'จัดซื้อจัดจ้าง',
  downloads: 'เอกสารดาวน์โหลด',
  pages: 'หน้าเพจ',
  banners: 'จัดการแบนเนอร์',
  media: 'คลังสื่อ',
  albums: 'อัลบั้มภาพ',
  menu: 'เมนูและโครงสร้าง',
  theme: 'ธีมและ CI',
  complaints: 'เรื่องร้องเรียน',
  contacts: 'ข้อความติดต่อ',
  users: 'ผู้ใช้งาน',
  settings: 'ตั้งค่าระบบ',
  ai: 'AI Assistant',
  citizens: 'รายชื่อพลเมือง',
  analytics: 'วิเคราะห์ข้อมูล',
  'e-services': 'คำขอบริการ',
  notifications: 'การแจ้งเตือน',
  create: 'สร้างใหม่',
  edit: 'แก้ไข',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    const label = breadcrumbMap[seg] || seg;
    return { href, label };
  });

  // Login page renders without admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              {/* Breadcrumb */}
              <nav className="hidden sm:flex items-center gap-1 text-sm">
                <Link
                  href="/admin/dashboard"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Home className="w-4 h-4" />
                </Link>
                {breadcrumbs.slice(1).map((crumb, idx) => (
                  <div key={crumb.href} className="flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    {idx === breadcrumbs.length - 2 ? (
                      <span className="text-gray-700 font-medium">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700">ผู้ดูแลระบบ</p>
                    <p className="text-xs text-gray-400">admin@smartweb.go.th</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-48 py-1 z-50">
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      โปรไฟล์
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut className="w-4 h-4" />
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
