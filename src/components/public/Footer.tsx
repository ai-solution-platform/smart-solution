'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Printer,
  Clock,
  Facebook,
  Youtube,
  ExternalLink,
  Shield,
} from 'lucide-react';
import type { FooterColumn } from '@/types';

const defaultQuickLinks: FooterColumn[] = [
  {
    title: 'เกี่ยวกับหน่วยงาน',
    links: [
      { label: 'ประวัติความเป็นมา', href: '/about' },
      { label: 'วิสัยทัศน์/พันธกิจ', href: '/about/vision' },
      { label: 'โครงสร้างองค์กร', href: '/about/structure' },
      { label: 'คณะผู้บริหาร', href: '/about/executives' },
      { label: 'สมาชิกสภา', href: '/about/council' },
    ],
  },
  {
    title: 'บริการประชาชน',
    links: [
      { label: 'ข่าวประชาสัมพันธ์', href: '/news' },
      { label: 'ประกาศจัดซื้อจัดจ้าง', href: '/procurement' },
      { label: 'ดาวน์โหลดแบบฟอร์ม', href: '/downloads' },
      { label: 'แจ้งเรื่องร้องเรียน', href: '/complaints' },
      { label: 'ถาม-ตอบ', href: '/faq' },
    ],
  },
  {
    title: 'ลิงก์ที่เกี่ยวข้อง',
    links: [
      { label: 'กรมส่งเสริมการปกครองท้องถิ่น', href: 'https://www.dla.go.th' },
      { label: 'สำนักงานคณะกรรมการการกระจายอำนาจ', href: 'https://www.odloc.go.th' },
      { label: 'ฐานข้อมูลหน่วยงานของรัฐ', href: 'https://www.opm.go.th' },
      { label: 'ระบบ e-LAAS', href: 'https://www.e-laas.go.th' },
    ],
  },
];

interface FooterProps {
  organizationName?: string;
  organizationType?: string;
  address?: string;
  phone?: string;
  fax?: string;
  email?: string;
  facebook?: string;
  line?: string;
  youtube?: string;
  tiktok?: string;
  quickLinks?: FooterColumn[];
}

export default function Footer({
  organizationName = 'สมาร์ทเว็บไซต์',
  organizationType = 'เทศบาลตำบล',
  address = 'เลขที่ 999 หมู่ 1 ตำบลตัวอย่าง อำเภอตัวอย่าง จังหวัดตัวอย่าง 10000',
  phone = '0-2xxx-xxxx',
  fax = '0-2xxx-xxxx',
  email = 'info@example.go.th',
  facebook,
  line,
  youtube,
  tiktok,
  quickLinks = defaultQuickLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const buddhistYear = currentYear + 543;

  return (
    <footer className="bg-primary-dark text-white" role="contentinfo">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Organization Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-secondary font-bold text-xl flex-shrink-0">
                {organizationName.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-white/60">{organizationType}</p>
                <h2 className="text-lg font-bold">{organizationName}</h2>
              </div>
            </div>

            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-secondary" />
                <a href={`tel:${phone.replace(/-/g, '')}`} className="hover:text-secondary transition-colors">
                  โทร. {phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 flex-shrink-0 text-secondary" />
                <span>แฟกซ์ {fax}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-secondary" />
                <a href={`mailto:${email}`} className="hover:text-secondary transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 text-secondary" />
                <span>เปิดทำการ จ.-ศ. 08:30 - 16:30 น.</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-5">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1877f2] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {line && (
                <a
                  href={line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#06c755] transition-colors"
                  aria-label="LINE"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                </a>
              )}
              {youtube && (
                <a
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ff0000] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#000000] transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.89a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.3z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Columns */}
          {quickLinks.map((column, index) => (
            <div key={index}>
              <h3 className="text-base font-semibold mb-4 text-secondary">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-white/70 hover:text-secondary transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 hover:text-secondary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-white/50 text-center md:text-left">
              &copy; {buddhistYear} {organizationType}{organizationName} สงวนลิขสิทธิ์ | พัฒนาโดย Smart Website Platform
            </p>

            {/* Links + Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/privacy"
                className="flex items-center gap-1 text-xs text-white/50 hover:text-secondary transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
              </Link>
              <Link
                href="/sitemap"
                className="text-xs text-white/50 hover:text-secondary transition-colors"
              >
                แผนผังเว็บไซต์
              </Link>

              {/* WCAG Badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded text-xs text-white/60"
                title="Web Content Accessibility Guidelines (WCAG) 2.1 Level AA"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                WCAG 2.1 AA
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
