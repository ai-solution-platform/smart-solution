'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Images,
  Film,
  Menu as MenuIcon,
  Palette,
  MessageSquareWarning,
  Mail,
  Users,
  Settings,
  Bot,
  ChevronDown,
  ChevronRight,
  X,
  Shield,
  Globe,
  Bell,
  UserCheck,
} from 'lucide-react';

interface MenuItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: 'แดชบอร์ด',
    href: '/admin/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'จัดการเนื้อหา',
    icon: <FileText className="w-5 h-5" />,
    children: [
      { label: 'ข่าวสาร', href: '/admin/content/news' },
      { label: 'ประกาศ', href: '/admin/content/announcements' },
      { label: 'จัดซื้อจัดจ้าง', href: '/admin/content/procurement' },
      { label: 'เอกสารดาวน์โหลด', href: '/admin/content/downloads' },
      { label: 'หน้าเพจ', href: '/admin/content/pages' },
    ],
  },
  {
    label: 'จัดการแบนเนอร์',
    href: '/admin/banners',
    icon: <ImageIcon className="w-5 h-5" />,
  },
  {
    label: 'คลังสื่อ',
    href: '/admin/media',
    icon: <Film className="w-5 h-5" />,
  },
  {
    label: 'อัลบั้มภาพ',
    href: '/admin/media/albums',
    icon: <Images className="w-5 h-5" />,
  },
  {
    label: 'เมนูและโครงสร้าง',
    href: '/admin/menu',
    icon: <MenuIcon className="w-5 h-5" />,
  },
  {
    label: 'ธีมและ CI',
    href: '/admin/theme',
    icon: <Palette className="w-5 h-5" />,
  },
  {
    label: 'เรื่องร้องเรียน',
    href: '/admin/complaints',
    icon: <MessageSquareWarning className="w-5 h-5" />,
  },
  {
    label: 'ข้อความติดต่อ',
    href: '/admin/contacts',
    icon: <Mail className="w-5 h-5" />,
  },
  {
    label: 'ผู้ใช้งาน',
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'พลเมือง',
    icon: <UserCheck className="w-5 h-5" />,
    children: [
      { label: 'รายชื่อพลเมือง', href: '/admin/citizens' },
      { label: 'วิเคราะห์ข้อมูล', href: '/admin/analytics' },
    ],
  },
  {
    label: 'บริการออนไลน์',
    icon: <Globe className="w-5 h-5" />,
    children: [
      { label: 'คำขอบริการ', href: '/admin/e-services' },
    ],
  },
  {
    label: 'การแจ้งเตือน',
    icon: <Bell className="w-5 h-5" />,
    children: [
      { label: 'ส่งการแจ้งเตือน', href: '/admin/notifications' },
    ],
  },
  {
    label: 'ตั้งค่าระบบ',
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
  },
  {
    label: 'AI Assistant',
    href: '/admin/ai',
    icon: <Bot className="w-5 h-5" />,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['จัดการเนื้อหา']));

  const toggleSubmenu = (label: string) => {
    const next = new Set(expandedMenus);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    setExpandedMenus(next);
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isChildActive = (item: MenuItem) => {
    if (item.children) {
      return item.children.some((child) => isActive(child.href));
    }
    return false;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-primary text-white z-50 transition-transform duration-300 ease-in-out w-64 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Smart Website</h1>
              <p className="text-xs text-white/50">ระบบจัดการเว็บไซต์</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isChildActive(item)
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {expandedMenus.has(item.label) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedMenus.has(item.label) && (
                    <div className="ml-5 mt-0.5 space-y-0.5 border-l border-white/10 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive(child.href)
                              ? 'bg-blue-600 text-white font-medium'
                              : 'text-white/50 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10 text-xs text-white/40 text-center">
          Smart Website CMS v1.0
        </div>
      </aside>
    </>
  );
}
