'use client';

import {
  Receipt,
  Building2,
  Users,
  Scale,
  MessageSquareWarning,
  FileDown,
  Globe,
  Database,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface QuickLinkItem {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

const quickLinks: QuickLinkItem[] = [
  {
    id: 1,
    title: 'ชำระภาษี',
    description: 'ชำระภาษีออนไลน์',
    icon: Receipt,
    href: '#',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    title: 'ขออนุญาตก่อสร้าง',
    description: 'ยื่นคำขอออนไลน์',
    icon: Building2,
    href: '#',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 3,
    title: 'ทะเบียนราษฎร',
    description: 'งานทะเบียนต่างๆ',
    icon: Users,
    href: '#',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 4,
    title: 'ศูนย์ดำรงธรรม',
    description: 'รับเรื่องร้องเรียน',
    icon: Scale,
    href: '#',
    color: 'from-rose-500 to-rose-600',
  },
  {
    id: 5,
    title: 'ร้องเรียน/ร้องทุกข์',
    description: 'แจ้งปัญหาต่างๆ',
    icon: MessageSquareWarning,
    href: '/complaints',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 6,
    title: 'ดาวน์โหลดเอกสาร',
    description: 'แบบฟอร์มต่างๆ',
    icon: FileDown,
    href: '/downloads',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 7,
    title: 'e-Service',
    description: 'บริการออนไลน์',
    icon: Globe,
    href: '#',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 8,
    title: 'ข้อมูลเปิดภาครัฐ',
    description: 'Open Government Data',
    icon: Database,
    href: '#',
    color: 'from-teal-500 to-teal-600',
  },
];

export default function QuickLinks() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            บริการประชาชน
          </h2>
          <p className="text-gray-500">เข้าถึงบริการต่างๆ ของเทศบาลได้อย่างรวดเร็ว</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                className="group relative bg-white rounded-xl shadow-card hover:shadow-card-hover p-6 text-center transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 hidden md:block">
                  {item.description}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
