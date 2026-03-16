'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Download,
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Calendar,
  BadgeDollarSign,
} from 'lucide-react';

type ProcurementType = 'all' | 'bidding' | 'e-bidding' | 'specific' | 'special';
type ProcurementStatus = 'all' | 'open' | 'closed' | 'awarded' | 'cancelled';

const typeOptions: { id: ProcurementType; label: string }[] = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'bidding', label: 'ประกวดราคา' },
  { id: 'e-bidding', label: 'e-bidding' },
  { id: 'specific', label: 'เฉพาะเจาะจง' },
  { id: 'special', label: 'วิธีพิเศษ' },
];

const statusOptions: { id: ProcurementStatus; label: string }[] = [
  { id: 'all', label: 'ทุกสถานะ' },
  { id: 'open', label: 'เปิดรับ' },
  { id: 'closed', label: 'ปิดรับ' },
  { id: 'awarded', label: 'ประกาศผล' },
  { id: 'cancelled', label: 'ยกเลิก' },
];

const procurements = [
  {
    id: 1,
    title: 'โครงการก่อสร้างถนนคอนกรีตเสริมเหล็ก ซอยเทศบาล 15',
    type: 'e-bidding',
    typeLabel: 'e-bidding',
    budget: 5800000,
    publishDate: '2568-03-10',
    endDate: '2568-03-25',
    status: 'open',
    statusLabel: 'เปิดรับ',
    hasTOR: true,
  },
  {
    id: 2,
    title: 'โครงการจัดซื้อรถบรรทุกขยะมูลฝอยแบบอัดท้าย ขนาด 6 ตัน จำนวน 2 คัน',
    type: 'bidding',
    typeLabel: 'ประกวดราคา',
    budget: 8500000,
    publishDate: '2568-03-08',
    endDate: '2568-03-22',
    status: 'open',
    statusLabel: 'เปิดรับ',
    hasTOR: true,
  },
  {
    id: 3,
    title: 'โครงการปรับปรุงระบบประปาหมู่บ้าน หมู่ที่ 5 และหมู่ที่ 7',
    type: 'e-bidding',
    typeLabel: 'e-bidding',
    budget: 3200000,
    publishDate: '2568-03-01',
    endDate: '2568-03-15',
    status: 'closed',
    statusLabel: 'ปิดรับ',
    hasTOR: true,
  },
  {
    id: 4,
    title: 'จัดซื้อวัสดุสำนักงาน ประจำปีงบประมาณ 2568 (ไตรมาสที่ 2)',
    type: 'specific',
    typeLabel: 'เฉพาะเจาะจง',
    budget: 185000,
    publishDate: '2568-02-28',
    endDate: '2568-03-07',
    status: 'awarded',
    statusLabel: 'ประกาศผล',
    hasTOR: false,
  },
  {
    id: 5,
    title: 'โครงการก่อสร้างอาคารศูนย์พัฒนาเด็กเล็กแห่งที่ 3',
    type: 'e-bidding',
    typeLabel: 'e-bidding',
    budget: 12500000,
    publishDate: '2568-02-25',
    endDate: '2568-03-12',
    status: 'awarded',
    statusLabel: 'ประกาศผล',
    hasTOR: true,
  },
  {
    id: 6,
    title: 'โครงการติดตั้งไฟฟ้าสาธารณะพลังงานแสงอาทิตย์ จำนวน 100 จุด',
    type: 'bidding',
    typeLabel: 'ประกวดราคา',
    budget: 6800000,
    publishDate: '2568-02-20',
    endDate: '2568-03-05',
    status: 'closed',
    statusLabel: 'ปิดรับ',
    hasTOR: true,
  },
  {
    id: 7,
    title: 'จ้างซ่อมแซมหลังคาอาคารสำนักงานเทศบาล',
    type: 'specific',
    typeLabel: 'เฉพาะเจาะจง',
    budget: 498000,
    publishDate: '2568-02-15',
    endDate: '2568-02-22',
    status: 'awarded',
    statusLabel: 'ประกาศผล',
    hasTOR: false,
  },
  {
    id: 8,
    title: 'โครงการจัดซื้อครุภัณฑ์คอมพิวเตอร์ สำหรับงานบริการประชาชน',
    type: 'specific',
    typeLabel: 'เฉพาะเจาะจง',
    budget: 750000,
    publishDate: '2568-02-10',
    endDate: '2568-02-17',
    status: 'awarded',
    statusLabel: 'ประกาศผล',
    hasTOR: false,
  },
  {
    id: 9,
    title: 'โครงการปรับปรุงสวนสาธารณะเฉลิมพระเกียรติ',
    type: 'e-bidding',
    typeLabel: 'e-bidding',
    budget: 4500000,
    publishDate: '2568-02-05',
    endDate: '2568-02-20',
    status: 'cancelled',
    statusLabel: 'ยกเลิก',
    hasTOR: true,
  },
  {
    id: 10,
    title: 'โครงการจัดซื้อรถพยาบาลฉุกเฉิน (กู้ชีพ) จำนวน 1 คัน',
    type: 'special',
    typeLabel: 'วิธีพิเศษ',
    budget: 2800000,
    publishDate: '2568-01-30',
    endDate: '2568-02-15',
    status: 'awarded',
    statusLabel: 'ประกาศผล',
    hasTOR: true,
  },
];

const ITEMS_PER_PAGE = 8;

export default function ProcurementPage() {
  const [typeFilter, setTypeFilter] = useState<ProcurementType>('all');
  const [statusFilter, setStatusFilter] = useState<ProcurementStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = procurements
    .filter((p) => typeFilter === 'all' || p.type === typeFilter)
    .filter((p) => statusFilter === 'all' || p.status === statusFilter)
    .filter((p) => searchQuery === '' || p.title.includes(searchQuery));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700',
      awarded: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatBudget = (amount: number) => {
    return amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
            <Briefcase className="w-9 h-9" />
            จัดซื้อจัดจ้าง
          </h1>
          <p className="text-blue-100 text-lg">ประกาศจัดซื้อจัดจ้าง ประกวดราคา และผลการจัดซื้อจัดจ้าง</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <span>จัดซื้อจัดจ้าง</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาโครงการ..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-500 mb-1 block flex items-center gap-1">
                <Filter className="w-4 h-4" />
                ประเภท
              </label>
              <div className="flex flex-wrap gap-2">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTypeFilter(opt.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      typeFilter === opt.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-500 mb-1 block">สถานะ</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setStatusFilter(opt.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === opt.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          แสดง {paged.length} จาก {filtered.length} รายการ
        </p>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 w-14">ลำดับ</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">ชื่อโครงการ</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 w-28">ประเภท</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600 w-36">วงเงิน (บาท)</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600 w-28">วันที่ประกาศ</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600 w-28">วันสิ้นสุด</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600 w-[100px] min-w-[100px]">สถานะ</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600 w-16">TOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.map((item, i) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium truncate">{item.title}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block whitespace-nowrap bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                        {item.typeLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-right font-mono">
                      {formatBudget(item.budget)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-center">{item.publishDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-center">{item.endDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block whitespace-nowrap text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.hasTOR ? (
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <Download className="w-5 h-5 mx-auto" />
                        </button>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 mb-8">
          {paged.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-5"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                  {item.typeLabel}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.statusLabel}
                </span>
              </div>
              <h3 className="font-medium text-gray-800 text-sm mb-3">{item.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1">
                    <BadgeDollarSign className="w-4 h-4" />
                    วงเงิน
                  </span>
                  <span className="font-mono font-medium text-gray-800">
                    {formatBudget(item.budget)} บาท
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    ประกาศ
                  </span>
                  <span className="text-gray-600">{item.publishDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">สิ้นสุด</span>
                  <span className="text-gray-600">{item.endDate}</span>
                </div>
              </div>
              {item.hasTOR && (
                <button className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                  <Download className="w-4 h-4" />
                  ดาวน์โหลด TOR
                </button>
              )}
            </div>
          ))}
        </div>

        {paged.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">ไม่พบโครงการที่ค้นหา</p>
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
