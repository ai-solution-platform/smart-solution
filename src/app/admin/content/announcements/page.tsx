'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Filter, Pin, AlertTriangle } from 'lucide-react';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';

interface Announcement {
  id: string;
  title: string;
  type: string;
  status: 'published' | 'draft';
  pinned: boolean;
  date: string;
  expiryDate: string;
  views: number;
}

const demoData: Announcement[] = [
  { id: '1', title: 'ประกาศรับสมัครพนักงานจ้างทั่วไป', type: 'รับสมัครงาน', status: 'published', pinned: true, date: '2569-03-16', expiryDate: '2569-04-16', views: 523 },
  { id: '2', title: 'ประกาศผลการสอบคัดเลือก ตำแหน่งเจ้าหน้าที่ธุรการ', type: 'ผลสอบ', status: 'published', pinned: false, date: '2569-03-14', expiryDate: '2569-03-30', views: 312 },
  { id: '3', title: 'ประกาศปิดทำการวันหยุดพิเศษ', type: 'ทั่วไป', status: 'published', pinned: true, date: '2569-03-12', expiryDate: '2569-03-20', views: 189 },
  { id: '4', title: 'ประกาศแจ้งกำหนดชำระภาษีที่ดินและสิ่งปลูกสร้าง', type: 'ภาษี', status: 'published', pinned: false, date: '2569-03-10', expiryDate: '2569-06-30', views: 456 },
  { id: '5', title: 'ประกาศเชิญชวนเข้าร่วมประชาคม', type: 'ทั่วไป', status: 'draft', pinned: false, date: '2569-03-08', expiryDate: '2569-04-01', views: 0 },
  { id: '6', title: 'ประกาศรายชื่อผู้มีสิทธิรับเงินสงเคราะห์', type: 'สวัสดิการ', status: 'published', pinned: false, date: '2569-03-06', expiryDate: '2569-03-31', views: 278 },
  { id: '7', title: 'ประกาศแผนพัฒนาท้องถิ่น พ.ศ. 2569-2573', type: 'แผนพัฒนา', status: 'published', pinned: false, date: '2569-03-04', expiryDate: '2573-12-31', views: 198 },
  { id: '8', title: 'ประกาศใช้ข้อบัญญัติงบประมาณรายจ่าย', type: 'งบประมาณ', status: 'published', pinned: false, date: '2569-03-01', expiryDate: '2569-09-30', views: 145 },
];

export default function AnnouncementsPage() {
  const [data, setData] = useState(demoData);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredData = data.filter((item) => {
    if (filterType && item.type !== filterType) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  const types = [...new Set(demoData.map((d) => d.type))];

  const toggleStatus = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'published' ? 'draft' as const : 'published' as const }
          : item
      )
    );
  };

  const togglePin = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item
      )
    );
  };

  const columns: Column<Announcement>[] = [
    {
      key: 'title',
      label: 'หัวข้อ',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 max-w-sm">
          <button
            onClick={() => togglePin(item.id)}
            title={item.pinned ? 'เลิกปักหมุด' : 'ปักหมุด'}
            className={`flex-shrink-0 transition-colors ${
              item.pinned ? 'text-orange-500 hover:text-orange-600' : 'text-gray-300 hover:text-orange-400'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <span className="font-medium text-gray-900 truncate">{item.title}</span>
        </div>
      ),
    },
    { key: 'type', label: 'ประเภท', sortable: true },
    {
      key: 'status',
      label: 'สถานะ',
      render: (item) => (
        <button
          onClick={() => toggleStatus(item.id)}
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            item.status === 'published'
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {item.status === 'published' ? 'เผยแพร่' : 'แบบร่าง'}
        </button>
      ),
    },
    { key: 'date', label: 'วันที่ประกาศ', sortable: true },
    {
      key: 'expiryDate',
      label: 'วันหมดอายุ',
      sortable: true,
      render: (item) => {
        const isExpired = item.expiryDate < '2569-03-16';
        return (
          <div className="flex items-center gap-1.5">
            <span className={isExpired ? 'text-red-500' : 'text-gray-700'}>{item.expiryDate}</span>
            {isExpired && <AlertTriangle className="w-3.5 h-3.5 text-red-400" aria-label="หมดอายุแล้ว" />}
          </div>
        );
      },
    },
    {
      key: 'views',
      label: 'ยอดดู',
      sortable: true,
      render: (item) => <span className="text-gray-500">{item.views.toLocaleString()}</span>,
    },
  ];

  const actions: RowAction<Announcement>[] = [
    {
      label: 'ดูตัวอย่าง',
      icon: <Eye className="w-4 h-4" />,
      onClick: (item) => alert(`ดูตัวอย่าง: ${item.title}`),
    },
    {
      label: 'แก้ไข',
      icon: <Edit className="w-4 h-4" />,
      onClick: (item) => alert(`แก้ไข: ${item.title}`),
    },
    {
      label: 'ลบ',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item) => {
        if (confirm(`ต้องการลบ "${item.title}" หรือไม่?`)) {
          setData((prev) => prev.filter((d) => d.id !== item.id));
        }
      },
      variant: 'danger',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการประกาศ</h1>
          <p className="text-sm text-gray-500 mt-1">จัดการประกาศและหนังสือราชการ</p>
        </div>
        <Link
          href="/admin/content/announcements/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มประกาศใหม่
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span>กรอง:</span>
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">ทุกประเภท</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">ทุกสถานะ</option>
          <option value="published">เผยแพร่</option>
          <option value="draft">แบบร่าง</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        actions={actions}
        selectable
        searchPlaceholder="ค้นหาประกาศ..."
        bulkActions={[
          {
            label: 'ลบที่เลือก',
            variant: 'danger',
            onClick: (items) => {
              if (confirm(`ต้องการลบ ${items.length} รายการ?`)) {
                const ids = new Set(items.map((i) => i.id));
                setData((prev) => prev.filter((d) => !ids.has(d.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
