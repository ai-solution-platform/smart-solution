'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Download, Filter, FileText, File, FileSpreadsheet, FileImage } from 'lucide-react';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';

interface DocumentItem {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  downloads: number;
  enabled: boolean;
  uploadDate: string;
}

const demoData: DocumentItem[] = [
  { id: '1', title: 'แบบฟอร์มคำร้องทั่วไป', category: 'แบบฟอร์ม', fileName: 'general-request.pdf', fileType: 'pdf', fileSize: '245 KB', downloads: 1234, enabled: true, uploadDate: '2569-03-15' },
  { id: '2', title: 'รายงานประจำปี 2568', category: 'รายงาน', fileName: 'annual-report-2568.pdf', fileType: 'pdf', fileSize: '5.2 MB', downloads: 567, enabled: true, uploadDate: '2569-03-10' },
  { id: '3', title: 'แผนพัฒนาท้องถิ่น 2569-2573', category: 'แผนพัฒนา', fileName: 'local-plan.pdf', fileType: 'pdf', fileSize: '8.1 MB', downloads: 345, enabled: true, uploadDate: '2569-03-05' },
  { id: '4', title: 'ข้อบัญญัติงบประมาณรายจ่าย 2569', category: 'งบประมาณ', fileName: 'budget-2569.pdf', fileType: 'pdf', fileSize: '3.7 MB', downloads: 289, enabled: true, uploadDate: '2569-02-28' },
  { id: '5', title: 'แบบฟอร์มขอใช้สถานที่', category: 'แบบฟอร์ม', fileName: 'venue-request.docx', fileType: 'docx', fileSize: '120 KB', downloads: 456, enabled: true, uploadDate: '2569-02-20' },
  { id: '6', title: 'ตารางการให้บริการประจำเดือน', category: 'ตาราง', fileName: 'service-schedule.xlsx', fileType: 'xlsx', fileSize: '89 KB', downloads: 123, enabled: false, uploadDate: '2569-02-15' },
  { id: '7', title: 'แบบฟอร์มขอข้อมูลข่าวสาร', category: 'แบบฟอร์ม', fileName: 'info-request.pdf', fileType: 'pdf', fileSize: '180 KB', downloads: 678, enabled: true, uploadDate: '2569-02-10' },
  { id: '8', title: 'ประกาศนโยบายความโปร่งใส', category: 'นโยบาย', fileName: 'transparency-policy.pdf', fileType: 'pdf', fileSize: '1.5 MB', downloads: 234, enabled: true, uploadDate: '2569-01-25' },
];

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-4 h-4 text-red-500" />,
  docx: <File className="w-4 h-4 text-blue-500" />,
  xlsx: <FileSpreadsheet className="w-4 h-4 text-green-500" />,
  jpg: <FileImage className="w-4 h-4 text-purple-500" />,
  png: <FileImage className="w-4 h-4 text-purple-500" />,
};

export default function DownloadsPage() {
  const [data, setData] = useState(demoData);
  const [filterCategory, setFilterCategory] = useState('');

  const filteredData = data.filter((item) => {
    if (filterCategory && item.category !== filterCategory) return false;
    return true;
  });

  const categories = [...new Set(demoData.map((d) => d.category))];

  const toggleEnabled = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const columns: Column<DocumentItem>[] = [
    {
      key: 'title',
      label: 'ชื่อเอกสาร',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 max-w-sm">
          {fileIcons[item.fileType] || <File className="w-4 h-4 text-gray-400" />}
          <div>
            <p className="font-medium text-gray-900 truncate">{item.title}</p>
            <p className="text-xs text-gray-400">{item.fileName} &middot; {item.fileSize}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'หมวดหมู่', sortable: true },
    {
      key: 'downloads',
      label: 'ดาวน์โหลด',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1 text-gray-500">
          <Download className="w-3.5 h-3.5" />
          <span>{item.downloads.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'enabled',
      label: 'สถานะ',
      render: (item) => (
        <button
          onClick={() => toggleEnabled(item.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            item.enabled ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              item.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      ),
    },
    { key: 'uploadDate', label: 'วันที่อัปโหลด', sortable: true },
  ];

  const actions: RowAction<DocumentItem>[] = [
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
          <h1 className="text-2xl font-bold text-gray-900">จัดการเอกสารดาวน์โหลด</h1>
          <p className="text-sm text-gray-500 mt-1">อัปโหลดและจัดการเอกสารสำหรับดาวน์โหลด</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Upload className="w-4 h-4" />
          อัปโหลดเอกสาร
        </button>
      </div>

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
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        actions={actions}
        selectable
        searchPlaceholder="ค้นหาเอกสาร..."
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
