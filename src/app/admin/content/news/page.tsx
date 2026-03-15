'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Filter } from 'lucide-react';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  status: 'published' | 'draft';
  date: string;
  views: number;
  author: string;
}

const demoData: NewsItem[] = [
  { id: '1', title: 'โครงการพัฒนาชุมชนปี 2569', category: 'โครงการ', status: 'published', date: '2569-03-16', views: 245, author: 'สมชาย ดี' },
  { id: '2', title: 'กิจกรรมวันเด็กแห่งชาติ ประจำปี 2569', category: 'กิจกรรม', status: 'published', date: '2569-03-15', views: 189, author: 'สมหญิง ใจดี' },
  { id: '3', title: 'ประกาศปิดสำนักงานชั่วคราว', category: 'ประกาศ', status: 'draft', date: '2569-03-14', views: 0, author: 'สมชาย ดี' },
  { id: '4', title: 'ประชุมสภาท้องถิ่น สมัยสามัญ', category: 'ข่าวสาร', status: 'published', date: '2569-03-13', views: 312, author: 'วิชัย สว่าง' },
  { id: '5', title: 'โครงการฝึกอบรมอาชีพ', category: 'โครงการ', status: 'published', date: '2569-03-12', views: 156, author: 'สมหญิง ใจดี' },
  { id: '6', title: 'แจ้งเปลี่ยนแปลงเวลาเปิดทำการ', category: 'ประกาศ', status: 'published', date: '2569-03-11', views: 89, author: 'สมชาย ดี' },
  { id: '7', title: 'รายงานผลการดำเนินงานไตรมาส 1/2569', category: 'รายงาน', status: 'draft', date: '2569-03-10', views: 0, author: 'วิชัย สว่าง' },
  { id: '8', title: 'กิจกรรมจิตอาสาพัฒนาชุมชน', category: 'กิจกรรม', status: 'published', date: '2569-03-09', views: 203, author: 'สมหญิง ใจดี' },
  { id: '9', title: 'ข่าวการประชุมคณะกรรมการบริหาร', category: 'ข่าวสาร', status: 'published', date: '2569-03-08', views: 178, author: 'สมชาย ดี' },
  { id: '10', title: 'ประชาสัมพันธ์การจ่ายภาษี', category: 'ประกาศ', status: 'published', date: '2569-03-07', views: 421, author: 'วิชัย สว่าง' },
  { id: '11', title: 'โครงการส่งเสริมสุขภาพผู้สูงอายุ', category: 'โครงการ', status: 'draft', date: '2569-03-06', views: 0, author: 'สมหญิง ใจดี' },
  { id: '12', title: 'แจ้งกำหนดการเลือกตั้ง', category: 'ประกาศ', status: 'published', date: '2569-03-05', views: 567, author: 'สมชาย ดี' },
];

export default function NewsPage() {
  const [data, setData] = useState(demoData);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredData = data.filter((item) => {
    if (filterCategory && item.category !== filterCategory) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  const categories = [...new Set(demoData.map((d) => d.category))];

  const toggleStatus = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'published' ? 'draft' : 'published' }
          : item
      )
    );
  };

  const columns: Column<NewsItem>[] = [
    {
      key: 'title',
      label: 'หัวข้อ',
      sortable: true,
      render: (item) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-900 truncate">{item.title}</p>
          <p className="text-xs text-gray-400">{item.author}</p>
        </div>
      ),
    },
    { key: 'category', label: 'หมวดหมู่', sortable: true },
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
    { key: 'date', label: 'วันที่', sortable: true },
    {
      key: 'views',
      label: 'ยอดดู',
      sortable: true,
      render: (item) => <span className="text-gray-500">{item.views.toLocaleString()}</span>,
    },
  ];

  const actions: RowAction<NewsItem>[] = [
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการข่าวสาร</h1>
          <p className="text-sm text-gray-500 mt-1">จัดการข่าวสารและบทความของเว็บไซต์</p>
        </div>
        <Link
          href="/admin/content/news/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มข่าวใหม่
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span>กรอง:</span>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
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

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        actions={actions}
        selectable
        searchPlaceholder="ค้นหาข่าว..."
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
