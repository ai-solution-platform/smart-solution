'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  Search,
  Globe,
  ChevronDown,
  Menu,
  Facebook,
  Youtube,
  Bell,
  User,
  LogOut,
  ClipboardList,
  Layers,
} from 'lucide-react';
import { useFontSize } from '@/hooks/useFontSize';
import { useCitizenAuth } from '@/hooks/useCitizenAuth';
import type { NavItem } from '@/types';
import MobileNav from './MobileNav';

// Default navigation items for Thai local government
const defaultNavItems: NavItem[] = [
  {
    label: 'หน้าแรก',
    labelEn: 'Home',
    href: '/',
  },
  {
    label: 'เกี่ยวกับเรา',
    labelEn: 'About Us',
    href: '/about',
    children: [
      { label: 'ประวัติความเป็นมา', labelEn: 'History', href: '/about' },
      { label: 'วิสัยทัศน์/พันธกิจ', labelEn: 'Vision/Mission', href: '/about/vision' },
      { label: 'โครงสร้างองค์กร', labelEn: 'Organization Structure', href: '/about/structure' },
      { label: 'คณะผู้บริหาร', labelEn: 'Executives', href: '/about/executives' },
      { label: 'สมาชิกสภา', labelEn: 'Council Members', href: '/about/council' },
      { label: 'หัวหน้าส่วนราชการ', labelEn: 'Department Heads', href: '/about/departments' },
    ],
  },
  {
    label: 'ข่าวสาร',
    labelEn: 'News',
    href: '/news',
    children: [
      { label: 'ข่าวประชาสัมพันธ์', labelEn: 'News', href: '/news' },
      { label: 'ประกาศ', labelEn: 'Announcements', href: '/announcements' },
      { label: 'กิจกรรม', labelEn: 'Activities', href: '/news?category=activities' },
    ],
  },
  {
    label: 'จัดซื้อจัดจ้าง',
    labelEn: 'Procurement',
    href: '/procurement',
    children: [
      { label: 'ประกาศจัดซื้อจัดจ้าง', labelEn: 'Procurement Notices', href: '/procurement' },
      { label: 'สรุปผลจัดซื้อจัดจ้าง', labelEn: 'Procurement Results', href: '/procurement?type=results' },
      { label: 'ราคากลาง', labelEn: 'Standard Prices', href: '/procurement?type=prices' },
    ],
  },
  {
    label: 'บริการประชาชน',
    labelEn: 'Services',
    href: '/services',
    children: [
      { label: 'แจ้งเรื่องร้องเรียน', labelEn: 'Complaints', href: '/complaints' },
      { label: 'ดาวน์โหลดแบบฟอร์ม', labelEn: 'Download Forms', href: '/downloads' },
      { label: 'คู่มือประชาชน', labelEn: 'Citizen Guide', href: '/downloads?category=guide' },
      { label: 'ถาม-ตอบ', labelEn: 'FAQ', href: '/faq' },
    ],
  },
  {
    label: 'คลังภาพ',
    labelEn: 'Gallery',
    href: '/gallery',
  },
  {
    label: 'ติดต่อเรา',
    labelEn: 'Contact',
    href: '/contact',
  },
];

interface HeaderProps {
  organizationName?: string;
  organizationType?: string;
  logo?: string;
  phone?: string;
  email?: string;
  facebook?: string;
  line?: string;
  youtube?: string;
  navItems?: NavItem[];
}

export default function Header({
  organizationName = 'สมาร์ทเว็บไซต์',
  organizationType = 'เทศบาลตำบล',
  logo,
  phone = '0-2xxx-xxxx',
  email = 'info@example.go.th',
  facebook = '#',
  line = '#',
  youtube = '#',
  navItems = defaultNavItems,
}: HeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'TH' | 'EN'>('TH');
  const { fontSize, increase, decrease, reset } = useFontSize();
  const { isLoggedIn, citizen, logout, isLoading: authLoading } = useCitizenAuth();
  const [citizenMenuOpen, setCitizenMenuOpen] = useState(false);
  const citizenMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close citizen menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (citizenMenuRef.current && !citizenMenuRef.current.contains(e.target as Node)) {
        setCitizenMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        ข้ามไปเนื้อหาหลัก
      </a>

      <header
        ref={headerRef}
        className={`w-full z-50 transition-all duration-300 ${
          isSticky ? 'fixed top-0 shadow-lg' : 'relative'
        }`}
      >
        {/* Top Bar */}
        <div className="bg-primary-dark text-white text-sm">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between py-1.5">
            {/* Contact Info */}
            <div className="flex items-center gap-4">
              <a
                href={`tel:${phone.replace(/-/g, '')}`}
                className="flex items-center gap-1 hover:text-secondary-light transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{phone}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1 hover:text-secondary-light transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{email}</span>
              </a>
            </div>

            {/* Right side: Social + Language + Accessibility */}
            <div className="flex items-center gap-3">
              {/* Social Media */}
              <div className="flex items-center gap-2">
                {facebook && facebook !== '#' && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="hover:text-secondary-light transition-colors"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                )}
                {line && line !== '#' && (
                  <a
                    href={line}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LINE"
                    className="hover:text-secondary-light transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
                {youtube && youtube !== '#' && (
                  <a
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="hover:text-secondary-light transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-white/30" />

              {/* Language Switcher */}
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <button
                  onClick={() => setLanguage('TH')}
                  className={`px-1 text-xs font-medium transition-colors ${
                    language === 'TH'
                      ? 'text-secondary-light underline'
                      : 'hover:text-secondary-light'
                  }`}
                  aria-label="ภาษาไทย"
                >
                  TH
                </button>
                <span className="text-white/50">|</span>
                <button
                  onClick={() => setLanguage('EN')}
                  className={`px-1 text-xs font-medium transition-colors ${
                    language === 'EN'
                      ? 'text-secondary-light underline'
                      : 'hover:text-secondary-light'
                  }`}
                  aria-label="English"
                >
                  EN
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-white/30" />

              {/* Font Size Accessibility */}
              <div className="flex items-center gap-1" role="group" aria-label="ปรับขนาดตัวอักษร">
                <button
                  onClick={decrease}
                  className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold transition-colors ${
                    fontSize === 'small'
                      ? 'bg-secondary text-primary-dark'
                      : 'hover:bg-white/20'
                  }`}
                  aria-label="ลดขนาดตัวอักษร"
                  title="ตัวอักษรเล็ก"
                >
                  A-
                </button>
                <button
                  onClick={reset}
                  className={`w-6 h-6 flex items-center justify-center rounded text-sm font-bold transition-colors ${
                    fontSize === 'medium'
                      ? 'bg-secondary text-primary-dark'
                      : 'hover:bg-white/20'
                  }`}
                  aria-label="ขนาดตัวอักษรปกติ"
                  title="ตัวอักษรปกติ"
                >
                  A
                </button>
                <button
                  onClick={increase}
                  className={`w-6 h-6 flex items-center justify-center rounded text-base font-bold transition-colors ${
                    fontSize === 'large'
                      ? 'bg-secondary text-primary-dark'
                      : 'hover:bg-white/20'
                  }`}
                  aria-label="เพิ่มขนาดตัวอักษร"
                  title="ตัวอักษรใหญ่"
                >
                  A+
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-white/30" />

              {/* Citizen Auth */}
              {!authLoading && (
                <>
                  {isLoggedIn && citizen ? (
                    <div className="relative" ref={citizenMenuRef}>
                      {/* Notification Bell */}
                      <button
                        className="relative mr-2 hover:text-secondary-light transition-colors"
                        aria-label="การแจ้งเตือน"
                        onClick={() => (window.location.href = '/citizen/notifications')}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-bold">
                          0
                        </span>
                      </button>

                      {/* Citizen Avatar + Name */}
                      <button
                        onClick={() => setCitizenMenuOpen(!citizenMenuOpen)}
                        className="flex items-center gap-1.5 hover:text-secondary-light transition-colors"
                        aria-expanded={citizenMenuOpen}
                        aria-haspopup="true"
                      >
                        {citizen.avatar ? (
                          <img
                            src={citizen.avatar}
                            alt={citizen.name}
                            className="w-5 h-5 rounded-full object-cover border border-white/40"
                          />
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                            {citizen.name.charAt(0)}
                          </span>
                        )}
                        <span className="hidden sm:inline text-xs max-w-[80px] truncate">
                          {citizen.name}
                        </span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${citizenMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Citizen Dropdown Menu */}
                      {citizenMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 bg-white text-text-primary shadow-xl rounded-lg border border-gray-100 min-w-[200px] z-50 py-1">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">{citizen.name}</p>
                            <p className="text-xs text-gray-500 truncate">{citizen.email || citizen.phone}</p>
                          </div>
                          <Link
                            href="/auth/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            onClick={() => setCitizenMenuOpen(false)}
                          >
                            <User className="w-4 h-4 text-gray-400" />
                            โปรไฟล์ของฉัน
                          </Link>
                          <Link
                            href="/complaints"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            onClick={() => setCitizenMenuOpen(false)}
                          >
                            <ClipboardList className="w-4 h-4 text-gray-400" />
                            เรื่องร้องเรียนของฉัน
                          </Link>
                          <Link
                            href="/e-service"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            onClick={() => setCitizenMenuOpen(false)}
                          >
                            <Layers className="w-4 h-4 text-gray-400" />
                            บริการออนไลน์
                          </Link>
                          <Link
                            href="/notifications"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            onClick={() => setCitizenMenuOpen(false)}
                          >
                            <Bell className="w-4 h-4 text-gray-400" />
                            การแจ้งเตือน
                          </Link>
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button
                              onClick={() => {
                                logout();
                                setCitizenMenuOpen(false);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              ออกจากระบบ
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="text-xs hover:text-secondary-light transition-colors opacity-80 hover:opacity-100"
                    >
                      เข้าสู่ระบบ
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className={`bg-white border-b border-gray-200 transition-all ${isSticky ? 'py-2' : 'py-4'}`}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
            {/* Logo + Organization Name */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              {logo ? (
                <img
                  src={logo}
                  alt={`โลโก้${organizationName}`}
                  className={`transition-all ${isSticky ? 'h-10' : 'h-14'} w-auto`}
                />
              ) : (
                <div
                  className={`bg-primary rounded-full flex items-center justify-center text-white font-bold transition-all ${
                    isSticky ? 'w-10 h-10 text-lg' : 'w-14 h-14 text-xl'
                  }`}
                >
                  {organizationName.charAt(0)}
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-xs text-text-secondary">{organizationType}</p>
                <h1
                  className={`font-bold text-primary leading-tight transition-all ${
                    isSticky ? 'text-lg' : 'text-xl lg:text-2xl'
                  }`}
                >
                  {organizationName}
                </h1>
              </div>
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาข้อมูล..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  aria-label="ค้นหาข้อมูล"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-light transition-colors"
                  aria-label="ค้นหา"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="ค้นหา"
              >
                <Search className="w-5 h-5 text-primary" />
              </button>
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="เปิดเมนู"
                aria-expanded={isMobileNavOpen}
              >
                <Menu className="w-6 h-6 text-primary" />
              </button>
            </div>
          </div>

          {/* Mobile Search (expandable) */}
          {searchOpen && (
            <div className="md:hidden px-4 pb-3 pt-1">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาข้อมูล..."
                  className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  aria-label="ค้นหาข้อมูล"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white"
                  aria-label="ค้นหา"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:block bg-primary text-white"
          aria-label="เมนูหลัก"
        >
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center" role="menubar">
              {navItems.map((item) => (
                <li
                  key={item.label}
                  className="relative"
                  role="none"
                  onMouseEnter={() =>
                    item.children && handleDropdownEnter(item.label)
                  }
                  onMouseLeave={handleDropdownLeave}
                >
                  {item.children ? (
                    <button
                      className={`flex items-center gap-1 px-4 py-3 font-medium text-sm hover:bg-white/10 transition-colors ${
                        activeDropdown === item.label ? 'bg-white/10' : ''
                      }`}
                      aria-expanded={activeDropdown === item.label}
                      aria-haspopup="true"
                      role="menuitem"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === item.label ? null : item.label
                        )
                      }
                    >
                      {language === 'EN' && item.labelEn
                        ? item.labelEn
                        : item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href || '/'}
                      className="block px-4 py-3 font-medium text-sm hover:bg-white/10 transition-colors"
                      role="menuitem"
                    >
                      {language === 'EN' && item.labelEn
                        ? item.labelEn
                        : item.label}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.children && activeDropdown === item.label && (
                    <div
                      className="absolute top-full left-0 bg-white text-text-primary shadow-xl rounded-b-lg border border-gray-100 min-w-[240px] z-50 animate-in fade-in slide-in-from-top-1 duration-200"
                      role="menu"
                    >
                      <ul className="py-2">
                        {item.children.map((child) => (
                          <li key={child.label} role="none">
                            <Link
                              href={child.href || '/'}
                              className="block px-5 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-colors"
                              role="menuitem"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {language === 'EN' && child.labelEn
                                ? child.labelEn
                                : child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Sticky spacer */}
      {isSticky && <div className="h-[140px] lg:h-[160px]" />}

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navItems={navItems}
        language={language}
        onLanguageChange={setLanguage}
        organizationName={organizationName}
        organizationType={organizationType}
        logo={logo}
      />
    </>
  );
}
