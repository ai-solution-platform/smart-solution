'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Filter, Upload, FileText } from 'lucide-react';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';

interface Procurement {
  id: string;
  title: string;
  type: string;
  budget: number;
  status: 'ประกาศ' | 'ระหว่างดำเนินการ' | 'เสร็จสิ้น' | 'ยกเลิก';
  publishDate: string;
  closeDate: string;
  hasTOR: boolean;
}

const demoData: Procurement[] = [
  { id: '1', title: 'จ้างก่อสร้างถนนคอนกรีตเสริมเหล็ก สายบ้านดอน-บ้านนา', type: 'จ้างก่อสร้าง', budget: 1500000, status: 'ประกาศ', publishDate: '2569-03-16', closeDate: '2569-03-30', hasTOR: true },
  { id: '2', title: 'ซื้อวัสดุสำนักงาน ประจำปีงบประมาณ 2569', type: 'ซื้อ', budget: 250000, status: 'ระหว่างดำเนินการ', publishDate: '2569-03-10', closeDate: '2569-03-25', hasTOR: true },
  { id: '3', title: 'จ้างเหมาบริการเก็บขยะมูลฝอย ไตรมาส 3', type: 'จ้างเหมา', budget: 450000, status: 'ประกาศ', publishDate: '2569-03-08', closeDate: '2569-03-22', hasTOR: false },
  { id: '4', title: 'ซื้อครุภัณฑ์คอมพิวเตอร์', type: 'ซื้อ', budget: 800000, status: 'เสร็จสิ้น', publishDate: '2569-02-20', closeDate: '2569-03-05', hasTOR: true },
  { id: '5', title: 'จ้างปรับปรุงระบบประปาหมู่บ้าน', type: 'จ้างก่อสร้าง', budget: 2000000, status: 'ระหว่างดำเนินการ', publishDate: '2569-02-15', closeDate: '2569-03-01', hasTOR: true },
  { id: '6', title: 'ซื้อเครื่องพิมพ์เอกสาร', type: 'ซื้อ', budget: 120000, status: 'ยกเลิก', publishDate: '2569-02-10', closeDate: '2569-02-25', hasTOR: false },
  { id: '7', title: 'จ้างออกแบบอาคารอเนกประสงค์', type: 'จ้างที่ปรึกษา', budget: 350000, status: 'เสร็จสิ้น', publishDate: '2569-01-20', closeDate: '2569-02-10', hasTOR: true },
];

const statusColors: Record<string, string> = {
  'ประกาศ': 'bg-blue-100 text-blue-700',
  'ระหว่างดำเนินการ': 'bg-yellow-100 text-yellow-700',
  'เสร็จสิ้น': 'bg-green-100 text-green-700',
  'ยกเลิก': 'bg-red-100 text-red-700',
};

export default function ProcurementPage() {
  const [data, setData] = useState(demoData);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredData = data.filter((item) => {
    if (filterType && item.type !== filterType) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  const types = [...new Set(demoData.map((d) => d.type))];

  const columns: Column<Procurement>[] = [
    {
      key: 'title',
      label: 'รายการ',
      sortable: true,
      render: (item) => (
        <div className="max-w-sm">
          <p className="font-medium text-gray-900 truncate">{item.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">{item.type}</span>
            {item.hasTOR && (
              <span className="inline-flex items-center gap-0.5 text-xs text-blue-500">
                <FileText className="w-3 h-3" /> TOR
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'budget',
      label: 'วงเงิน',
      sortable: true,
      render: (item) => (
        <span className="font-medium text-gray-900">
          {item.budget.toLocaleString('th-TH')} บาท
        </span>
      ),
    },
    {
      key: 'status',
      label: 'สถานะ',
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
          {item.status}
        </span>
      ),
    },
    { key: 'publishDate', label: 'วันที่ประกาศ', sortable: true },
    { key: 'closeDate', label: 'วันปิดรับ', sortable: true },
  ];

  const actions: RowAction<Procurement>[] = [
    {
      label: 'ดูรายละเอียด',
      icon: <Eye className="w-4 h-4" />,
      onClick: (item) => alert(`ดูรายละเอียด: ${item.title}`),
    },
    {
      label: 'แก้ไข',
      icon: <Edit className="w-4 h-4" />,
      onClick: (item) => alert(`แก้ไข: ${item.title}`),
    },
    {
      label: 'อัปโหลด TOR',
      icon: <Upload className="w-4 h-4" />,
      onClick: (item) => alert(`อัปโหลด TOR: ${item.title}`),
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
          <h1 className="text-2xl font-bold text-gray-900">จัดการจัดซื้อจัดจ้าง</h1>
          <p className="text-sm text-gray-500 mt-1">จัดการประกาศจัดซื้อจัดจ้างและเอกสาร TOR</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          เพิ่มรายการใหม่
        </button>
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
          <option value="ประกาศ">ประกาศ</option>
          <option value="ระหว่างดำเนินการ">ระหว่างดำเนินการ</option>
          <option value="เสร็จสิ้น">เสร็จสิ้น</option>
          <option value="ยกเลิก">ยกเลิก</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        actions={actions}
        selectable
        searchPlaceholder="ค้นหาจัดซื้อจัดจ้าง..."
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
