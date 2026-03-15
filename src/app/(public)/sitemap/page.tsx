'use client';

import Link from 'next/link';
import {
  Home,
  Building2,
  Newspaper,
  Megaphone,
  ShoppingCart,
  Briefcase,
  Images,
  Download,
  Phone,
  MessageSquareWarning,
  HelpCircle,
  Map,
  ChevronRight,
  Globe,
  Users,
  FileText,
  Search,
  Shield,
  Scale,
  LogIn,
} from 'lucide-react';

interface SitemapSection {
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  links: { label: string; href: string }[];
}

const sitemapSections: SitemapSection[] = [
  {
    title: 'หน้าแรก',
    icon: Home,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    links: [{ label: 'หน้าแรก', href: '/' }],
  },
  {
    title: 'เกี่ยวกับเรา',
    icon: Building2,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    links: [
      { label: 'ข้อมูลทั่วไป', href: '/about' },
      { label: 'วิสัยทัศน์และพันธกิจ', href: '/about' },
      { label: 'โครงสร้างองค์กร', href: '/about' },
      { label: 'คณะผู้บริหาร', href: '/about' },
      { label: 'สมาชิกสภา', href: '/about' },
      { label: 'หัวหน้าส่วนราชการ', href: '/about' },
    ],
  },
  {
    title: 'ข่าวสาร',
    icon: Newspaper,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    links: [
      { label: 'ข่าวประชาสัมพันธ์', href: '/news' },
      { label: 'กิจกรรมเทศบาล', href: '/news' },
    ],
  },
  {
    title: 'ประกาศ',
    icon: Megaphone,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    links: [
      { label: 'ประกาศเทศบาล', href: '/announcements' },
      { label: 'ประกาศรับสมัครงาน', href: '/announcements' },
    ],
  },
  {
    title: 'จัดซื้อจัดจ้าง',
    icon: ShoppingCart,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    links: [
      { label: 'ประกาศจัดซื้อจัดจ้าง', href: '/procurement' },
      { label: 'ผลการจัดซื้อจัดจ้าง', href: '/procurement' },
      { label: 'สรุปผลการจัดซื้อจัดจ้าง', href: '/procurement' },
    ],
  },
  {
    title: 'บริการประชาชน',
    icon: Briefcase,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    links: [
      { label: 'บริการประชาชน', href: '/services' },
      { label: 'บริการออนไลน์ (e-Service)', href: '/e-service' },
      { label: 'ดาวน์โหลดแบบฟอร์ม', href: '/downloads' },
      { label: 'คำถามที่พบบ่อย', href: '/faq' },
    ],
  },
  {
    title: 'แกลเลอรี',
    icon: Images,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    links: [
      { label: 'อัลบั้มภาพกิจกรรม', href: '/gallery' },
    ],
  },
  {
    title: 'ดาวน์โหลด',
    icon: Download,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    links: [
      { label: 'แบบฟอร์มต่าง ๆ', href: '/downloads' },
      { label: 'เอกสารเผยแพร่', href: '/downloads' },
      { label: 'รายงานประจำปี', href: '/downloads' },
    ],
  },
  {
    title: 'ติดต่อเรา',
    icon: Phone,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
    links: [
      { label: 'ข้อมูลติดต่อ', href: '/contact' },
      { label: 'แบบฟอร์มติดต่อ', href: '/contact' },
      { label: 'แผนที่', href: '/contact' },
    ],
  },
  {
    title: 'ร้องเรียน/ร้องทุกข์',
    icon: MessageSquareWarning,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    links: [
      { label: 'แจ้งเรื่องร้องเรียน', href: '/complaints' },
      { label: 'ติดตามเรื่องร้องเรียน', href: '/complaints/track' },
    ],
  },
  {
    title: 'คำถามที่พบบ่อย',
    icon: HelpCircle,
    color: 'text-[#e8a838]',
    bgColor: 'bg-[#e8a838]/10',
    links: [{ label: 'คำถามที่พบบ่อย (FAQ)', href: '/faq' }],
  },
  {
    title: 'อื่น ๆ',
    icon: Globe,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    links: [
      { label: 'ค้นหา', href: '/search' },
      { label: 'นโยบายความเป็นส่วนตัว', href: '/privacy' },
      { label: 'ข้อกำหนดการใช้งาน', href: '/terms' },
      { label: 'เข้าสู่ระบบ', href: '/auth/login' },
      { label: 'สมัครสมาชิก', href: '/auth/register' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">แผนผังเว็บไซต์</h1>
          <p className="text-blue-100 text-lg">
            ดูรายการหน้าเว็บทั้งหมดของเทศบาลตำบลสมาร์ทซิตี้
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">
              หน้าแรก
            </Link>
            <span>/</span>
            <span>แผนผังเว็บไซต์</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sitemap Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitemapSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Section Header */}
                <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${section.bgColor} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <h2 className="font-semibold text-gray-800">{section.title}</h2>
                </div>

                {/* Links */}
                <ul className="p-4 space-y-1">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-[#1e3a5f]/5 hover:text-[#1e3a5f] transition-colors group"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2c5f8a] transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Visual Tree */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Map className="w-7 h-7 text-[#2c5f8a]" />
            โครงสร้างเว็บไซต์
          </h2>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Root */}
              <div className="flex justify-center mb-6">
                <Link
                  href="/"
                  className="bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#2c5f8a] transition-colors shadow-md"
                >
                  <Home className="w-5 h-5" />
                  หน้าแรก
                </Link>
              </div>

              {/* Connector line */}
              <div className="flex justify-center mb-6">
                <div className="w-0.5 h-8 bg-gray-300" />
              </div>

              {/* Main branches */}
              <div className="relative">
                <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-gray-300" />
                <div className="grid grid-cols-5 gap-4 pt-6">
                  {[
                    { label: 'เกี่ยวกับเรา', href: '/about', icon: Building2 },
                    { label: 'ข่าวสาร', href: '/news', icon: Newspaper },
                    { label: 'บริการ', href: '/services', icon: Briefcase },
                    { label: 'ดาวน์โหลด', href: '/downloads', icon: Download },
                    { label: 'ติดต่อ', href: '/contact', icon: Phone },
                  ].map((item, i) => {
                    const BranchIcon = item.icon;
                    return (
                      <div key={i} className="text-center relative">
                        <div className="absolute top-0 left-1/2 -translate-x-0.5 -translate-y-6 w-0.5 h-6 bg-gray-300" />
                        <Link
                          href={item.href}
                          className="inline-flex flex-col items-center gap-2 bg-[#2c5f8a] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1e3a5f] transition-colors shadow-sm"
                        >
                          <BranchIcon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Secondary row */}
              <div className="mt-10 flex justify-center">
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { label: 'ประกาศ', href: '/announcements', icon: Megaphone },
                    { label: 'จัดซื้อจัดจ้าง', href: '/procurement', icon: ShoppingCart },
                    { label: 'แกลเลอรี', href: '/gallery', icon: Images },
                    { label: 'e-Service', href: '/e-service', icon: Globe },
                    { label: 'ร้องเรียน', href: '/complaints', icon: MessageSquareWarning },
                    { label: 'FAQ', href: '/faq', icon: HelpCircle },
                    { label: 'ค้นหา', href: '/search', icon: Search },
                  ].map((item, i) => {
                    const SubIcon = item.icon;
                    return (
                      <Link
                        key={i}
                        href={item.href}
                        className="inline-flex items-center gap-1.5 bg-[#e8a838]/10 text-[#1e3a5f] border border-[#e8a838]/30 px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#e8a838]/20 transition-colors"
                      >
                        <SubIcon className="w-3.5 h-3.5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Tertiary row */}
              <div className="mt-6 flex justify-center">
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { label: 'เข้าสู่ระบบ', href: '/auth/login', icon: LogIn },
                    { label: 'สมัครสมาชิก', href: '/auth/register', icon: Users },
                    { label: 'นโยบายความเป็นส่วนตัว', href: '/privacy', icon: Shield },
                    { label: 'ข้อกำหนดใช้งาน', href: '/terms', icon: Scale },
                    { label: 'การแจ้งเตือน', href: '/notifications', icon: FileText },
                  ].map((item, i) => {
                    const TerIcon = item.icon;
                    return (
                      <Link
                        key={i}
                        href={item.href}
                        className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 border border-gray-200 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                      >
                        <TerIcon className="w-3.5 h-3.5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
