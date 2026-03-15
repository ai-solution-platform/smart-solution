'use client';

import { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  X,
  Clock,
  CheckCircle2,
  Loader2,
  XCircle,
  FileText,
  Phone,
  Mail,
  User,
  Paperclip,
} from 'lucide-react';

interface ServiceRequest {
  id: string;
  refNumber: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  serviceType: string;
  subject: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  submittedDate: string;
  assignedTo: string;
  attachments: string[];
  notes: string;
}

const staffMembers = [
  'นายสมชาย ใจดี',
  'นางสาวสมหญิง รักงาน',
  'นายประเสริฐ มั่นคง',
  'นางสาวพิมพ์ใจ สว่าง',
  'นายวิทยา ชาญเชิง',
];

const serviceTypes = [
  'ทั้งหมด',
  'ขอสำเนาทะเบียนบ้าน',
  'ขอใบรับรองที่อยู่',
  'แจ้งซ่อมไฟฟ้าสาธารณะ',
  'ขอใช้สถานที่',
  'ร้องเรียนเสียงดัง',
  'ขอถังขยะเพิ่ม',
  'ขอน้ำประปา',
  'แจ้งซ่อมถนน',
];

const statusOptions = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'pending', label: 'รอดำเนินการ' },
  { value: 'processing', label: 'กำลังดำเนินการ' },
  { value: 'completed', label: 'เสร็จสิ้น' },
  { value: 'cancelled', label: 'ยกเลิก' },
];

const demoRequests: ServiceRequest[] = [
  {
    id: '1',
    refNumber: 'SR-2026-0001',
    citizenName: 'นายสมศักดิ์ พงษ์ทอง',
    citizenPhone: '081-234-5678',
    citizenEmail: 'somsak@email.com',
    serviceType: 'ขอสำเนาทะเบียนบ้าน',
    subject: 'ขอสำเนาทะเบียนบ้าน 3 ชุด',
    description: 'ต้องการสำเนาทะเบียนบ้านจำนวน 3 ชุด เพื่อใช้ประกอบการสมัครงาน',
    status: 'pending',
    submittedDate: '2026-03-15',
    assignedTo: '',
    attachments: ['สำเนาบัตรประชาชน.pdf', 'หนังสือมอบอำนาจ.pdf'],
    notes: '',
  },
  {
    id: '2',
    refNumber: 'SR-2026-0002',
    citizenName: 'นางมาลี สุขใจ',
    citizenPhone: '089-876-5432',
    citizenEmail: 'malee@email.com',
    serviceType: 'แจ้งซ่อมไฟฟ้าสาธารณะ',
    subject: 'ไฟฟ้าสาธารณะดับ ซอย 5',
    description: 'ไฟฟ้าสาธารณะบริเวณซอย 5 หมู่ 3 ดับมาประมาณ 1 สัปดาห์ ทำให้เดินทางไม่สะดวกในเวลากลางคืน',
    status: 'processing',
    submittedDate: '2026-03-14',
    assignedTo: 'นายประเสริฐ มั่นคง',
    attachments: ['ภาพถ่ายจุดไฟดับ.jpg'],
    notes: 'ส่งเจ้าหน้าที่ไปตรวจสอบแล้ว รอชิ้นส่วนอะไหล่',
  },
  {
    id: '3',
    refNumber: 'SR-2026-0003',
    citizenName: 'นายวิชัย แก้วมณี',
    citizenPhone: '062-345-6789',
    citizenEmail: 'wichai@email.com',
    serviceType: 'ขอใบรับรองที่อยู่',
    subject: 'ขอใบรับรองที่อยู่อาศัย',
    description: 'ต้องการใบรับรองที่อยู่อาศัยเพื่อใช้ยื่นกู้ธนาคาร',
    status: 'completed',
    submittedDate: '2026-03-10',
    assignedTo: 'นายสมชาย ใจดี',
    attachments: ['สำเนาบัตรประชาชน.pdf'],
    notes: 'ออกใบรับรองเรียบร้อยแล้ว พลเมืองมารับเอกสารแล้ว',
  },
  {
    id: '4',
    refNumber: 'SR-2026-0004',
    citizenName: 'นางสาวพรทิพย์ ดวงแก้ว',
    citizenPhone: '095-678-1234',
    citizenEmail: 'porntip@email.com',
    serviceType: 'ขอใช้สถานที่',
    subject: 'ขอใช้หอประชุมจัดงานแต่งงาน',
    description: 'ต้องการขอใช้หอประชุมเทศบาลเพื่อจัดงานแต่งงาน วันที่ 20 เมษายน 2026',
    status: 'processing',
    submittedDate: '2026-03-12',
    assignedTo: 'นางสาวสมหญิง รักงาน',
    attachments: ['แบบฟอร์มขอใช้สถานที่.pdf'],
    notes: 'อยู่ระหว่างตรวจสอบตารางการใช้หอประชุม',
  },
  {
    id: '5',
    refNumber: 'SR-2026-0005',
    citizenName: 'นายอำนาจ ศรีสวัสดิ์',
    citizenPhone: '083-456-7890',
    citizenEmail: 'amnat@email.com',
    serviceType: 'ร้องเรียนเสียงดัง',
    subject: 'เสียงดังจากโรงงานใกล้บ้าน',
    description: 'โรงงานข้างบ้านทำเสียงดังมากในเวลากลางคืน ตั้งแต่ 22:00 - 02:00 น. ทุกวัน กระทบต่อการนอนหลับ',
    status: 'pending',
    submittedDate: '2026-03-15',
    assignedTo: '',
    attachments: ['คลิปเสียง.mp4'],
    notes: '',
  },
  {
    id: '6',
    refNumber: 'SR-2026-0006',
    citizenName: 'นางประนอม จันทร์ศรี',
    citizenPhone: '091-234-5678',
    citizenEmail: 'pranom@email.com',
    serviceType: 'ขอถังขยะเพิ่ม',
    subject: 'ขอถังขยะเพิ่มหน้าบ้าน',
    description: 'ครอบครัวมีสมาชิกเพิ่มขึ้น ถังขยะ 1 ใบไม่เพียงพอ ขอถังขยะเพิ่มอีก 1 ใบ',
    status: 'completed',
    submittedDate: '2026-03-08',
    assignedTo: 'นายวิทยา ชาญเชิง',
    attachments: [],
    notes: 'จัดส่งถังขยะเพิ่มเรียบร้อยแล้ว',
  },
  {
    id: '7',
    refNumber: 'SR-2026-0007',
    citizenName: 'นายบุญมี ทองคำ',
    citizenPhone: '087-654-3210',
    citizenEmail: 'boonmee@email.com',
    serviceType: 'ขอน้ำประปา',
    subject: 'ขอติดตั้งน้ำประปาใหม่',
    description: 'สร้างบ้านใหม่ ต้องการขอติดตั้งน้ำประปา หมู่ 7 ตำบลบ้านนา',
    status: 'cancelled',
    submittedDate: '2026-03-05',
    assignedTo: 'นายประเสริฐ มั่นคง',
    attachments: ['สำเนาโฉนดที่ดิน.pdf', 'แผนที่บ้าน.jpg'],
    notes: 'พลเมืองแจ้งยกเลิก เนื่องจากยังก่อสร้างไม่แล้วเสร็จ',
  },
  {
    id: '8',
    refNumber: 'SR-2026-0008',
    citizenName: 'นางสาวกัญญา รุ่งเรือง',
    citizenPhone: '064-321-9876',
    citizenEmail: 'kanya@email.com',
    serviceType: 'แจ้งซ่อมถนน',
    subject: 'ถนนชำรุดเป็นหลุม หมู่ 2',
    description: 'ถนนสายหลักหมู่ 2 มีหลุมขนาดใหญ่หลายจุด เป็นอันตรายต่อผู้สัญจร โดยเฉพาะในเวลากลางคืน',
    status: 'processing',
    submittedDate: '2026-03-13',
    assignedTo: 'นายวิทยา ชาญเชิง',
    attachments: ['ภาพถนนชำรุด_1.jpg', 'ภาพถนนชำรุด_2.jpg'],
    notes: 'อยู่ระหว่างดำเนินการจัดซื้อวัสดุซ่อมแซม',
  },
  {
    id: '9',
    refNumber: 'SR-2026-0009',
    citizenName: 'นายธนากร เจริญสุข',
    citizenPhone: '098-765-4321',
    citizenEmail: 'thanakorn@email.com',
    serviceType: 'ขอสำเนาทะเบียนบ้าน',
    subject: 'ขอสำเนาทะเบียนบ้าน 2 ชุด',
    description: 'ต้องการสำเนาทะเบียนบ้าน 2 ชุด เพื่อใช้ยื่นเรื่องประกันสังคม',
    status: 'pending',
    submittedDate: '2026-03-16',
    assignedTo: '',
    attachments: ['สำเนาบัตรประชาชน.pdf'],
    notes: '',
  },
];

const statusConfig = {
  pending: {
    label: 'รอดำเนินการ',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  processing: {
    label: 'กำลังดำเนินการ',
    color: 'bg-blue-100 text-blue-800',
    icon: Loader2,
  },
  completed: {
    label: 'เสร็จสิ้น',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'ยกเลิก',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

export default function EServicesPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>(demoRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ทั้งหมด');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const processingCount = requests.filter((r) => r.status === 'processing').length;
  const completedThisMonth = requests.filter((r) => {
    const d = new Date(r.submittedDate);
    return r.status === 'completed' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const filteredRequests = requests.filter((r) => {
    const matchSearch =
      r.refNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'ทั้งหมด' || r.serviceType === filterType;
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const openDetail = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setEditStatus(req.status);
    setEditNotes(req.notes);
    setEditAssignedTo(req.assignedTo);
  };

  const saveChanges = () => {
    if (!selectedRequest) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? { ...r, status: editStatus as ServiceRequest['status'], notes: editNotes, assignedTo: editAssignedTo }
          : r
      )
    );
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">คำขอบริการออนไลน์</h1>
        <p className="text-gray-500 mt-1">จัดการคำขอบริการจากพลเมือง</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">คำขอทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalRequests}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">รอดำเนินการ</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">กำลังดำเนินการ</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{processingCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">เสร็จสิ้นเดือนนี้</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{completedThisMonth}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาเลขอ้างอิง, ชื่อพลเมือง, หัวข้อ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {serviceTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">เลขอ้างอิง</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">ชื่อผู้ยื่นคำขอ</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">ประเภทบริการ</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">สถานะ</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">วันที่ยื่น</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">ผู้รับผิดชอบ</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((req) => {
                const sc = statusConfig[req.status];
                const StatusIcon = sc.icon;
                return (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-blue-600 font-medium">{req.refNumber}</td>
                    <td className="px-4 py-3 text-gray-900">{req.citizenName}</td>
                    <td className="px-4 py-3 text-gray-600">{req.serviceType}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{req.submittedDate}</td>
                    <td className="px-4 py-3 text-gray-600">{req.assignedTo || <span className="text-gray-400">-</span>}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => openDetail(req)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    ไม่พบคำขอบริการที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">รายละเอียดคำขอบริการ</h2>
                <p className="text-sm text-gray-500">{selectedRequest.refNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Citizen Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">ข้อมูลผู้ยื่นคำขอ</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">ชื่อ:</span>
                    <span className="font-medium text-gray-900">{selectedRequest.citizenName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">โทรศัพท์:</span>
                    <span className="font-medium text-gray-900">{selectedRequest.citizenPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">อีเมล:</span>
                    <span className="font-medium text-gray-900">{selectedRequest.citizenEmail}</span>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">รายละเอียดคำขอ</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">ประเภทบริการ:</span>{' '}
                    <span className="font-medium text-gray-900">{selectedRequest.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">หัวข้อ:</span>{' '}
                    <span className="font-medium text-gray-900">{selectedRequest.subject}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">รายละเอียด:</span>
                    <p className="mt-1 text-gray-900">{selectedRequest.description}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">วันที่ยื่น:</span>{' '}
                    <span className="font-medium text-gray-900">{selectedRequest.submittedDate}</span>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">เอกสาร/ไฟล์แนบ</h3>
                {selectedRequest.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRequest.attachments.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2.5 text-sm">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-blue-600 hover:underline cursor-pointer">{file}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">ไม่มีไฟล์แนบ</p>
                )}
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">อัปเดตสถานะ</h3>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">รอดำเนินการ</option>
                  <option value="processing">กำลังดำเนินการ</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>

              {/* Assign To */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">มอบหมายเจ้าหน้าที่</h3>
                <select
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- เลือกเจ้าหน้าที่ --</option>
                  {staffMembers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">บันทึกการตอบกลับ</h3>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                  placeholder="เพิ่มบันทึกหรือข้อความตอบกลับ..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={saveChanges}
                className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
