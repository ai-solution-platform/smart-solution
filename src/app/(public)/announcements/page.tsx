'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Filter,
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'general', label: 'ประกาศทั่วไป' },
  { id: 'recruitment', label: 'รับสมัครงาน' },
  { id: 'tax', label: 'ภาษี' },
  { id: 'regulation', label: 'ข้อบัญญัติ/ระเบียบ' },
  { id: 'result', label: 'ประกาศผล' },
];

const announcements = [
  {
    id: 1,
    slug: 'tax-payment-2568',
    title: 'ประกาศเทศบาลตำบลสมาร์ทซิตี้ เรื่อง การชำระภาษีที่ดินและสิ่งปลูกสร้าง ประจำปี 2568',
    category: 'tax',
    categoryLabel: 'ภาษี',
    date: '2568-03-15',
    hasAttachment: true,
    attachmentName: 'ประกาศภาษี_2568.pdf',
  },
  {
    id: 2,
    slug: 'recruitment-engineer-2568',
    title: 'ประกาศรับสมัครสอบคัดเลือกพนักงานเทศบาล ตำแหน่ง วิศวกรโยธา จำนวน 2 อัตรา',
    category: 'recruitment',
    categoryLabel: 'รับสมัครงาน',
    date: '2568-03-12',
    hasAttachment: true,
    attachmentName: 'ประกาศรับสมัคร_วิศวกร.pdf',
  },
  {
    id: 3,
    slug: 'water-supply-maintenance',
    title: 'แจ้งหยุดจ่ายน้ำประปาชั่วคราว เพื่อซ่อมบำรุงระบบ วันที่ 20-21 มีนาคม 2568',
    category: 'general',
    categoryLabel: 'ประกาศทั่วไป',
    date: '2568-03-10',
    hasAttachment: false,
  },
  {
    id: 4,
    slug: 'building-permit-regulation',
    title: 'ข้อบัญญัติเทศบาล เรื่อง การควบคุมอาคาร พ.ศ. 2568',
    category: 'regulation',
    categoryLabel: 'ข้อบัญญัติ/ระเบียบ',
    date: '2568-03-08',
    hasAttachment: true,
    attachmentName: 'ข้อบัญญัติควบคุมอาคาร_2568.pdf',
  },
  {
    id: 5,
    slug: 'scholarship-result-2568',
    title: 'ประกาศผลการคัดเลือกนักเรียนรับทุนการศึกษา ประจำปีการศึกษา 2568',
    category: 'result',
    categoryLabel: 'ประกาศผล',
    date: '2568-03-05',
    hasAttachment: true,
    attachmentName: 'ผลทุนการศึกษา_2568.pdf',
  },
  {
    id: 6,
    slug: 'market-permit-renewal',
    title: 'แจ้งการต่ออายุใบอนุญาตประกอบกิจการตลาด ประจำปี 2568',
    category: 'general',
    categoryLabel: 'ประกาศทั่วไป',
    date: '2568-03-01',
    hasAttachment: true,
    attachmentName: 'แบบฟอร์มต่อใบอนุญาต.pdf',
  },
  {
    id: 7,
    slug: 'waste-collection-schedule',
    title: 'ประกาศตารางเก็บขยะมูลฝอยประจำเดือนเมษายน 2568',
    category: 'general',
    categoryLabel: 'ประกาศทั่วไป',
    date: '2568-02-28',
    hasAttachment: true,
    attachmentName: 'ตารางเก็บขยะ_เมย68.pdf',
  },
  {
    id: 8,
    slug: 'recruitment-teacher-result',
    title: 'ประกาศผลสอบคัดเลือกพนักงานจ้าง ตำแหน่ง ผู้ช่วยครูผู้ดูแลเด็ก',
    category: 'result',
    categoryLabel: 'ประกาศผล',
    date: '2568-02-25',
    hasAttachment: true,
    attachmentName: 'ผลสอบครูผู้ดูแลเด็ก.pdf',
  },
  {
    id: 9,
    slug: 'business-tax-regulation',
    title: 'ข้อบัญญัติเทศบาล เรื่อง การจัดเก็บภาษีป้าย พ.ศ. 2568',
    category: 'regulation',
    categoryLabel: 'ข้อบัญญัติ/ระเบียบ',
    date: '2568-02-20',
    hasAttachment: true,
    attachmentName: 'ข้อบัญญัติภาษีป้าย_2568.pdf',
  },
  {
    id: 10,
    slug: 'recruitment-nurse',
    title: 'ประกาศรับสมัครพนักงานจ้างทั่วไป ตำแหน่ง ผู้ช่วยเจ้าพนักงานสาธารณสุข',
    category: 'recruitment',
    categoryLabel: 'รับสมัครงาน',
    date: '2568-02-18',
    hasAttachment: true,
    attachmentName: 'ประกาศรับสมัคร_สาธารณสุข.pdf',
  },
];

const ITEMS_PER_PAGE = 8;

export default function AnnouncementsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = announcements
    .filter((a) => activeCategory === 'all' || a.category === activeCategory)
    .filter(
      (a) => searchQuery === '' || a.title.includes(searchQuery)
    );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-700',
      recruitment: 'bg-green-100 text-green-700',
      tax: 'bg-yellow-100 text-yellow-700',
      regulation: 'bg-purple-100 text-purple-700',
      result: 'bg-blue-100 text-blue-700',
    };
    return colors[cat] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
            <Megaphone className="w-9 h-9" />
            ประกาศเทศบาล
          </h1>
          <p className="text-blue-100 text-lg">ประกาศ ข้อบัญญัติ ระเบียบ และข่าวรับสมัครงาน</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <span>ประกาศ</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาประกาศ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Filter className="w-5 h-5 text-gray-400 mt-1" />
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          แสดง {paged.length} จาก {filtered.length} รายการ
        </p>

        {/* Announcements List */}
        <div className="space-y-3 mb-8">
          {paged.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${getCategoryColor(
                        item.category
                      )}`}
                    >
                      {item.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                  </div>
                  <Link
                    href={`/announcements/${item.slug}`}
                    className="text-gray-800 font-medium hover:text-blue-600 transition-colors"
                  >
                    {item.title}
                  </Link>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.hasAttachment && (
                    <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">ดาวน์โหลด</span>
                    </button>
                  )}
                  <Link
                    href={`/announcements/${item.slug}`}
                    className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">อ่านเพิ่มเติม</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {paged.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">ไม่พบประกาศที่ค้นหา</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
