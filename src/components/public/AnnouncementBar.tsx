'use client';

import Link from 'next/link';
import { Megaphone } from 'lucide-react';

const announcements = [
  {
    id: 1,
    text: 'ประกาศ: เทศบาลตำบลสมาร์ทซิตี้เปิดรับลงทะเบียนผู้สูงอายุ ประจำปีงบประมาณ 2569 ตั้งแต่บัดนี้ - 30 พฤศจิกายน 2568',
    url: '#',
  },
  {
    id: 2,
    text: 'แจ้งกำหนดการชำระภาษีที่ดินและสิ่งปลูกสร้าง ประจำปี 2569 ภายในวันที่ 30 เมษายน 2569',
    url: '#',
  },
  {
    id: 3,
    text: 'ขอเชิญชวนประชาชนร่วมโครงการ "เมืองสะอาด คนสุขภาพดี" ทุกวันเสาร์ ณ สวนสาธารณะเทศบาล',
    url: '#',
  },
];

export default function AnnouncementBar() {
  const combinedText = announcements.map((a) => a.text).join('   •   ');

  return (
    <div className="bg-gradient-to-r from-[#e8a838] to-[#c4902e] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 flex items-center py-2.5">
        {/* Icon */}
        <div className="flex-shrink-0 flex items-center gap-2 pr-4 border-r border-white/30 mr-4">
          <Megaphone className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm whitespace-nowrap hidden sm:inline">ประกาศ</span>
        </div>

        {/* Scrolling Text */}
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee whitespace-nowrap inline-block">
            {combinedText}
            <span className="mx-16">{combinedText}</span>
          </div>
        </div>

        {/* Link */}
        <Link
          href="/announcements"
          className="flex-shrink-0 ml-4 text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors whitespace-nowrap"
        >
          ดูทั้งหมด
        </Link>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
