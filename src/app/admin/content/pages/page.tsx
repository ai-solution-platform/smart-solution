'use client';

import { useState } from 'react';
import { Edit, Trash2, Eye, Plus, Globe, Layout } from 'lucide-react';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';

interface PageItem {
  id: string;
  title: string;
  slug: string;
  template: string;
  status: 'published' | 'draft';
  lastModified: string;
  author: string;
}

const demoData: PageItem[] = [
  { id: '1', title: 'หน้าแรก', slug: '/', template: 'หน้าแรก', status: 'published', lastModified: '2569-03-16', author: 'ผู้ดูแลระบบ' },
  { id: '2', title: 'ข้อมูลทั่วไป', slug: '/about', template: 'เนื้อหาทั่วไป', status: 'published', lastModified: '2569-03-14', author: 'สมชาย ดี' },
  { id: '3', title: 'โครงสร้างองค์กร', slug: '/organization', template: 'โครงสร้างองค์กร', status: 'published', lastModified: '2569-03-12', author: 'สมชาย ดี' },
  { id: '4', title: 'ผู้บริหาร', slug: '/executives', template: 'รายชื่อบุคลากร', status: 'published', lastModified: '2569-03-10', author: 'สมหญิง ใจดี' },
  { id: '5', title: 'อำนาจหน้าที่', slug: '/authority', template: 'เนื้อหาทั่วไป', status: 'published', lastModified: '2569-03-08', author: 'สมชาย ดี' },
  { id: '6', title: 'ติดต่อเรา', slug: '/contact', template: 'ติดต่อเรา', status: 'published', lastModified: '2569-03-05', author: 'ผู้ดูแลระบบ' },
  { id: '7', title: 'ร้องเรียนร้องทุกข์', slug: '/complaint', template: 'แบบฟอร์ม', status: 'published', lastModified: '2569-03-03', author: 'ผู้ดูแลระบบ' },
  { id: '8', title: 'กฎหมายที่เกี่ยวข้อง', slug: '/laws', template: 'เนื้อหาทั่วไป', status: 'draft', lastModified: '2569-02-28', author: 'วิชัย สว่าง' },
  { id: '9', title: 'ถามตอบ (FAQ)', slug: '/faq', template: 'คำถามที่พบบ่อย', status: 'published', lastModified: '2569-02-25', author: 'สมหญิง ใจดี' },
];

export default function PagesPage() {
  const [data, setData] = useState(demoData);

  const columns: Column<PageItem>[] = [
    {
      key: 'title',
      label: 'ชื่อเพจ',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-400 font-mono">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'template',
      label: 'เทมเพลต',
      render: (item) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Layout className="w-3.5 h-3.5" />
          {item.template}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'สถานะ',
      render: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            item.status === 'published'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {item.status === 'published' ? 'เผยแพร่' : 'แบบร่าง'}
        </span>
      ),
    },
    { key: 'lastModified', label: 'แก้ไขล่าสุด', sortable: true },
    { key: 'author', label: 'ผู้แก้ไข' },
  ];

  const actions: RowAction<PageItem>[] = [
    {
      label: 'ดูตัวอย่าง',
      icon: <Eye className="w-4 h-4" />,
      onClick: (item) => alert(`ดูตัวอย่าง: ${item.title}`),
    },
    {
      label: 'แก้ไขเนื้อหา',
      icon: <Edit className="w-4 h-4" />,
      onClick: (item) => alert(`แก้ไข: ${item.title}`),
    },
    {
      label: 'ลบ',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item) => {
        if (confirm(`ต้องการลบเพจ "${item.title}" หรือไม่?`)) {
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
          <h1 className="text-2xl font-bold text-gray-900">จัดการหน้าเพจ</h1>
          <p className="text-sm text-gray-500 mt-1">จัดการหน้าเพจและเนื้อหาคงที่ของเว็บไซต์</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          เพิ่มเพจใหม่
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        actions={actions}
        searchPlaceholder="ค้นหาเพจ..."
      />
    </div>
  );
}
