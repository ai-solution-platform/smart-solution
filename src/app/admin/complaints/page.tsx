'use client';

import { useState } from 'react';
import { Eye, Filter, MessageSquare, UserCheck, Clock, CheckCircle } from 'lucide-react';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';

type ComplaintStatus = 'ใหม่' | 'รับเรื่อง' | 'ดำเนินการ' | 'แก้ไขแล้ว';

interface Complaint {
  id: string;
  refNo: string;
  subject: string;
  category: string;
  complainant: string;
  phone: string;
  status: ComplaintStatus;
  assignee: string;
  createdDate: string;
  note: string;
}

const demoData: Complaint[] = [
  { id: '1', refNo: 'R-2569-001', subject: 'ถนนชำรุดบริเวณหมู่ 3 ซอยวัดใหม่', category: 'ถนน/ทางเดิน', complainant: 'นายสมชาย ใจดี', phone: '081-234-5678', status: 'ใหม่', assignee: '', createdDate: '2569-03-16', note: '' },
  { id: '2', refNo: 'R-2569-002', subject: 'ไฟทางส่องสว่างเสีย ซอย 5', category: 'ไฟฟ้า', complainant: 'นางสมหญิง รักดี', phone: '089-876-5432', status: 'รับเรื่อง', assignee: 'นายวิชัย สว่าง', createdDate: '2569-03-15', note: 'ส่งเจ้าหน้าที่ตรวจสอบแล้ว' },
  { id: '3', refNo: 'R-2569-003', subject: 'ขยะส่งกลิ่นเหม็น บริเวณตลาดสด', category: 'ขยะ/สิ่งแวดล้อม', complainant: 'นายประเสริฐ มั่นคง', phone: '062-345-6789', status: 'ดำเนินการ', assignee: 'นายสมศักดิ์ ดีงาม', createdDate: '2569-03-14', note: 'กำลังจัดทีมทำความสะอาด' },
  { id: '4', refNo: 'R-2569-004', subject: 'ท่อระบายน้ำอุดตัน หมู่ 7', category: 'ท่อระบายน้ำ', complainant: 'นางวรรณา สุขใจ', phone: '095-432-1098', status: 'แก้ไขแล้ว', assignee: 'นายวิชัย สว่าง', createdDate: '2569-03-10', note: 'ดำเนินการขุดลอกท่อระบายน้ำเรียบร้อย' },
  { id: '5', refNo: 'R-2569-005', subject: 'สุนัขจรจัด บริเวณวัดใหญ่', category: 'สัตว์จรจัด', complainant: 'นายมนัส ทองดี', phone: '087-654-3210', status: 'ใหม่', assignee: '', createdDate: '2569-03-13', note: '' },
  { id: '6', refNo: 'R-2569-006', subject: 'เสียงรบกวนจากโรงงาน', category: 'เสียง/มลภาวะ', complainant: 'นางสุดา พรมแดง', phone: '091-234-5678', status: 'รับเรื่อง', assignee: 'นายสมศักดิ์ ดีงาม', createdDate: '2569-03-12', note: 'รอนัดตรวจสอบ' },
  { id: '7', refNo: 'R-2569-007', subject: 'น้ำประปาไม่ไหล หมู่ 2', category: 'ประปา', complainant: 'นายชัยวุฒิ บุญมาก', phone: '084-567-8901', status: 'ดำเนินการ', assignee: 'นายวิชัย สว่าง', createdDate: '2569-03-11', note: 'พบท่อแตก กำลังซ่อม' },
  { id: '8', refNo: 'R-2569-008', subject: 'ต้นไม้ล้มขวางถนน', category: 'ถนน/ทางเดิน', complainant: 'นางสมปอง ใจเย็น', phone: '088-765-4321', status: 'แก้ไขแล้ว', assignee: 'นายสมศักดิ์ ดีงาม', createdDate: '2569-03-09', note: 'ตัดต้นไม้และเคลียร์เรียบร้อย' },
];

const statusConfig: Record<ComplaintStatus, { color: string; icon: React.ReactNode }> = {
  'ใหม่': { color: 'bg-red-100 text-red-700', icon: <Clock className="w-3.5 h-3.5" /> },
  'รับเรื่อง': { color: 'bg-blue-100 text-blue-700', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  'ดำเนินการ': { color: 'bg-yellow-100 text-yellow-700', icon: <UserCheck className="w-3.5 h-3.5" /> },
  'แก้ไขแล้ว': { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3.5 h-3.5" /> },
};

const staff = ['นายวิชัย สว่าง', 'นายสมศักดิ์ ดีงาม', 'นางสมหญิง ใจดี'];

export default function ComplaintsPage() {
  const [data, setData] = useState(demoData);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseNote, setResponseNote] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('รับเรื่อง');
  const [assignTo, setAssignTo] = useState('');

  const filteredData = data.filter((item) => {
    if (filterStatus && item.status !== filterStatus) return false;
    if (filterCategory && item.category !== filterCategory) return false;
    return true;
  });

  const categories = [...new Set(demoData.map((d) => d.category))];

  const statusCounts = {
    'ใหม่': data.filter((d) => d.status === 'ใหม่').length,
    'รับเรื่อง': data.filter((d) => d.status === 'รับเรื่อง').length,
    'ดำเนินการ': data.filter((d) => d.status === 'ดำเนินการ').length,
    'แก้ไขแล้ว': data.filter((d) => d.status === 'แก้ไขแล้ว').length,
  };

  const openDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setResponseNote(complaint.note);
    setNewStatus(complaint.status);
    setAssignTo(complaint.assignee);
  };

  const updateComplaint = () => {
    if (!selectedComplaint) return;
    setData((prev) =>
      prev.map((item) =>
        item.id === selectedComplaint.id
          ? { ...item, status: newStatus, note: responseNote, assignee: assignTo }
          : item
      )
    );
    setSelectedComplaint(null);
  };

  const columns: Column<Complaint>[] = [
    {
      key: 'refNo',
      label: 'เลขที่',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-sm font-medium text-blue-600">{item.refNo}</span>
      ),
    },
    {
      key: 'subject',
      label: 'เรื่อง',
      sortable: true,
      render: (item) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-900 truncate">{item.subject}</p>
          <p className="text-xs text-gray-400">{item.category}</p>
        </div>
      ),
    },
    {
      key: 'complainant',
      label: 'ผู้ร้องเรียน',
      render: (item) => (
        <div>
          <p className="text-sm text-gray-700">{item.complainant}</p>
          <p className="text-xs text-gray-400">{item.phone}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'สถานะ',
      render: (item) => {
        const config = statusConfig[item.status];
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.icon}
            {item.status}
          </span>
        );
      },
    },
    {
      key: 'assignee',
      label: 'ผู้รับผิดชอบ',
      render: (item) => (
        <span className="text-sm text-gray-500">{item.assignee || '-'}</span>
      ),
    },
    { key: 'createdDate', label: 'วันที่รับเรื่อง', sortable: true },
  ];

  const actions: RowAction<Complaint>[] = [
    {
      label: 'ดูรายละเอียด',
      icon: <Eye className="w-4 h-4" />,
      onClick: openDetail,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">จัดการเรื่องร้องเรียน</h1>
        <p className="text-sm text-gray-500 mt-1">ติดตามและจัดการเรื่องร้องเรียนจากประชาชน</p>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(statusCounts) as [ComplaintStatus, number][]).map(([status, count]) => {
          const config = statusConfig[status];
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? '' : status)}
              className={`p-4 rounded-xl border transition-all ${
                filterStatus === status
                  ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {config.icon}
                <span className="text-sm font-medium text-gray-600">{status}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </button>
          );
        })}
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
        {filterStatus && (
          <button
            onClick={() => setFilterStatus('')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        actions={actions}
        searchPlaceholder="ค้นหาเรื่องร้องเรียน..."
      />

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  รายละเอียดเรื่องร้องเรียน
                </h2>
                <span className="font-mono text-sm text-blue-600 font-medium">
                  {selectedComplaint.refNo}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase">เรื่อง</label>
                <p className="text-sm text-gray-900 mt-0.5">{selectedComplaint.subject}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase">หมวดหมู่</label>
                  <p className="text-sm text-gray-700 mt-0.5">{selectedComplaint.category}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase">วันที่รับเรื่อง</label>
                  <p className="text-sm text-gray-700 mt-0.5">{selectedComplaint.createdDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase">ผู้ร้องเรียน</label>
                  <p className="text-sm text-gray-700 mt-0.5">{selectedComplaint.complainant}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase">เบอร์โทร</label>
                  <p className="text-sm text-gray-700 mt-0.5">{selectedComplaint.phone}</p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Update Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  อัปเดตสถานะ
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ใหม่">ใหม่</option>
                  <option value="รับเรื่อง">รับเรื่อง</option>
                  <option value="ดำเนินการ">ดำเนินการ</option>
                  <option value="แก้ไขแล้ว">แก้ไขแล้ว</option>
                </select>
              </div>

              {/* Assign to staff */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  มอบหมายให้
                </label>
                <select
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- เลือกเจ้าหน้าที่ --</option>
                  {staff.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Response Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  บันทึกการดำเนินการ
                </label>
                <textarea
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  rows={3}
                  placeholder="เพิ่มรายละเอียดการดำเนินการ..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={updateComplaint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
