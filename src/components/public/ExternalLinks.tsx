'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface ExternalOrg {
  id: number;
  name: string;
  shortName: string;
  url: string;
  bgColor: string;
}

const organizations: ExternalOrg[] = [
  {
    id: 1,
    name: 'กรมส่งเสริมการปกครองท้องถิ่น',
    shortName: 'สถ.',
    url: 'https://www.dla.go.th',
    bgColor: 'bg-blue-700',
  },
  {
    id: 2,
    name: 'กระทรวงมหาดไทย',
    shortName: 'มท.',
    url: 'https://www.moi.go.th',
    bgColor: 'bg-red-700',
  },
  {
    id: 3,
    name: 'สำนักงานคณะกรรมการการเลือกตั้ง',
    shortName: 'กกต.',
    url: 'https://www.ect.go.th',
    bgColor: 'bg-purple-700',
  },
  {
    id: 4,
    name: 'สำนักงานการตรวจเงินแผ่นดิน',
    shortName: 'สตง.',
    url: 'https://www.oag.go.th',
    bgColor: 'bg-emerald-700',
  },
  {
    id: 5,
    name: 'กรมบัญชีกลาง',
    shortName: 'บก.',
    url: 'https://www.cgd.go.th',
    bgColor: 'bg-amber-700',
  },
  {
    id: 6,
    name: 'สำนักงาน ก.พ.',
    shortName: 'ก.พ.',
    url: 'https://www.ocsc.go.th',
    bgColor: 'bg-indigo-700',
  },
  {
    id: 7,
    name: 'กรมที่ดิน',
    shortName: 'ทด.',
    url: 'https://www.dol.go.th',
    bgColor: 'bg-teal-700',
  },
  {
    id: 8,
    name: 'ศูนย์ข้อมูลข่าวสารของราชการ',
    shortName: 'ศกร.',
    url: 'https://www.oic.go.th',
    bgColor: 'bg-orange-700',
  },
  {
    id: 9,
    name: 'สำนักงานคณะกรรมการป้องกันและปราบปรามการทุจริตแห่งชาติ',
    shortName: 'ป.ป.ช.',
    url: 'https://www.nacc.go.th',
    bgColor: 'bg-rose-700',
  },
  {
    id: 10,
    name: 'ระบบจัดซื้อจัดจ้างภาครัฐ',
    shortName: 'EGP',
    url: 'https://www.gprocurement.go.th',
    bgColor: 'bg-cyan-700',
  },
];

export default function ExternalLinks() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-10 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-700">
            หน่วยงานที่เกี่ยวข้อง
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
              aria-label="เลื่อนซ้าย"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
              aria-label="เลื่อนขวา"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {organizations.map((org) => (
            <a
              key={org.id}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <div className="w-40 md:w-48 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md p-4 transition-all duration-300 h-full flex flex-col items-center text-center">
                {/* Logo placeholder */}
                <div
                  className={`w-14 h-14 ${org.bgColor} rounded-lg flex items-center justify-center text-white font-bold text-lg mb-3 group-hover:scale-105 transition-transform`}
                >
                  {org.shortName}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-2">
                  {org.name}
                </p>
                <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-blue-500 transition-colors mt-auto" />
              </div>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
