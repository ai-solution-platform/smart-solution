'use client';

import Link from 'next/link';
import { FileText, ArrowRight, Clock } from 'lucide-react';

interface ProcurementItem {
  id: number;
  title: string;
  type: string;
  budget: string;
  deadline: string;
  status: 'open' | 'closed';
  href: string;
}

const demoProcurements: ProcurementItem[] = [
  {
    id: 1,
    title: 'จ้างก่อสร้างถนนคอนกรีตเสริมเหล็ก ซอยสุขสวัสดิ์ 5',
    type: 'ประกวดราคา',
    budget: '2,500,000',
    deadline: '25 มี.ค. 2569',
    status: 'open',
    href: '#',
  },
  {
    id: 2,
    title: 'จัดซื้อครุภัณฑ์คอมพิวเตอร์ สำหรับศูนย์บริการประชาชน',
    type: 'e-bidding',
    budget: '850,000',
    deadline: '20 มี.ค. 2569',
    status: 'open',
    href: '#',
  },
  {
    id: 3,
    title: 'จ้างเหมาปรับปรุงภูมิทัศน์สวนสาธารณะเทศบาล',
    type: 'สอบราคา',
    budget: '1,200,000',
    deadline: '18 มี.ค. 2569',
    status: 'open',
    href: '#',
  },
  {
    id: 4,
    title: 'จัดซื้อรถบรรทุกขยะมูลฝอย ขนาด 6 ล้อ จำนวน 1 คัน',
    type: 'ประกวดราคา',
    budget: '3,800,000',
    deadline: '10 มี.ค. 2569',
    status: 'closed',
    href: '#',
  },
  {
    id: 5,
    title: 'จ้างเหมาบริการรักษาความสะอาดอาคารสำนักงาน ประจำปี 2569',
    type: 'เฉพาะเจาะจง',
    budget: '480,000',
    deadline: '5 มี.ค. 2569',
    status: 'closed',
    href: '#',
  },
];

function getTypeBadge(type: string) {
  switch (type) {
    case 'ประกวดราคา':
      return 'bg-blue-100 text-blue-700';
    case 'e-bidding':
      return 'bg-purple-100 text-purple-700';
    case 'สอบราคา':
      return 'bg-amber-100 text-amber-700';
    case 'เฉพาะเจาะจง':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

export default function ProcurementPreview() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <FileText className="w-7 h-7 text-blue-600" />
              จัดซื้อจัดจ้าง
            </h2>
            <p className="text-gray-500">ประกาศจัดซื้อจัดจ้างและราคากลาง</p>
          </div>
          <Link
            href="/procurement"
            className="inline-flex items-center gap-2 mt-4 md:mt-0 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            ดูทั้งหมด <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500">
            <div className="col-span-5">รายการ</div>
            <div className="col-span-2">ประเภท</div>
            <div className="col-span-2 text-right">งบประมาณ (บาท)</div>
            <div className="col-span-2">สิ้นสุด</div>
            <div className="col-span-1">สถานะ</div>
          </div>

          {/* Rows */}
          {demoProcurements.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className={`block md:grid md:grid-cols-12 gap-4 px-6 py-4 hover:bg-blue-50/50 transition-colors ${
                index !== demoProcurements.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              {/* Title */}
              <div className="col-span-5 mb-2 md:mb-0">
                <p className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                  {item.title}
                </p>
              </div>

              {/* Type Badge */}
              <div className="col-span-2 mb-2 md:mb-0 flex items-center">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getTypeBadge(item.type)}`}
                >
                  {item.type}
                </span>
              </div>

              {/* Budget */}
              <div className="col-span-2 mb-2 md:mb-0 flex items-center md:justify-end">
                <span className="text-sm font-semibold text-gray-700 md:hidden mr-1">งบ: </span>
                <span className="text-sm font-semibold text-gray-700">{item.budget}</span>
              </div>

              {/* Deadline */}
              <div className="col-span-2 mb-2 md:mb-0 flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-3.5 h-3.5 md:hidden" />
                {item.deadline}
              </div>

              {/* Status */}
              <div className="col-span-1 flex items-center">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    item.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.status === 'open' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                  {item.status === 'open' ? 'เปิดรับ' : 'ปิดรับ'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
