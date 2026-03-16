'use client';

import { useState } from 'react';
import {
  Mail,
  MailOpen,
  MessageSquareReply,
  Trash2,
  ChevronDown,
  ChevronUp,
  Filter,
  Inbox,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface ContactMessage {
  id: string;
  senderName: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

const demoMessages: ContactMessage[] = [
  {
    id: '1',
    senderName: 'สมชาย ใจดี',
    email: 'somchai@email.com',
    subject: 'สอบถามเรื่องการชำระภาษีที่ดิน',
    message:
      'สวัสดีครับ ต้องการสอบถามเรื่องการชำระภาษีที่ดินและสิ่งปลูกสร้าง ปีนี้ต้องชำระภายในวันที่เท่าไหร่ครับ และสามารถชำระผ่านช่องทางออนไลน์ได้หรือไม่',
    date: '16 มี.ค. 2568',
    status: 'new',
  },
  {
    id: '2',
    senderName: 'สมหญิง รักดี',
    email: 'somying@email.com',
    subject: 'แจ้งไฟฟ้าส่องสว่างชำรุด',
    message:
      'แจ้งไฟฟ้าส่องสว่างถนนสายหลักบริเวณหน้าตลาดสดเทศบาลดับ จำนวน 3 ดวง ตั้งแต่สัปดาห์ที่แล้ว รบกวนช่วยซ่อมแซมด้วยค่ะ',
    date: '15 มี.ค. 2568',
    status: 'new',
  },
  {
    id: '3',
    senderName: 'ประเสริฐ มั่นคง',
    email: 'prasert@email.com',
    subject: 'ขอข้อมูลโครงการ Smart City',
    message:
      'ต้องการทราบรายละเอียดโครงการ Smart City ว่ามีแผนงานอย่างไรบ้าง และประชาชนสามารถมีส่วนร่วมได้อย่างไร',
    date: '14 มี.ค. 2568',
    status: 'read',
  },
  {
    id: '4',
    senderName: 'วิมล สุขสม',
    email: 'wimon@email.com',
    subject: 'สมัครเข้าร่วมกิจกรรมสงกรานต์',
    message:
      'สนใจสมัครเข้าร่วมกิจกรรมสงกรานต์ปี 2568 ต้องทำอย่างไรบ้างคะ มีค่าใช้จ่ายหรือไม่',
    date: '13 มี.ค. 2568',
    status: 'replied',
  },
  {
    id: '5',
    senderName: 'ธนพล เจริญผล',
    email: 'thanapol@email.com',
    subject: 'ร้องเรียนเสียงดังจากการก่อสร้าง',
    message:
      'ขอร้องเรียนเรื่องเสียงดังจากการก่อสร้างอาคารพาณิชย์บริเวณซอย 5 ทำงานตั้งแต่ตี 5 รบกวนการพักผ่อนของชาวบ้าน',
    date: '12 มี.ค. 2568',
    status: 'new',
  },
  {
    id: '6',
    senderName: 'อรุณี แสงจันทร์',
    email: 'arunee@email.com',
    subject: 'สอบถามสวัสดิการผู้สูงอายุ',
    message:
      'ต้องการสอบถามเรื่องเบี้ยยังชีพผู้สูงอายุ คุณแม่อายุ 65 ปี ต้องลงทะเบียนอย่างไร ใช้เอกสารอะไรบ้าง',
    date: '11 มี.ค. 2568',
    status: 'read',
  },
  {
    id: '7',
    senderName: 'สุรชัย วงศ์ดี',
    email: 'surachai@email.com',
    subject: 'ขอใบอนุญาตก่อสร้าง',
    message:
      'ต้องการขอใบอนุญาตก่อสร้างบ้านพักอาศัย ต้องเตรียมเอกสารอะไรบ้างและใช้เวลาดำเนินการกี่วัน',
    date: '10 มี.ค. 2568',
    status: 'replied',
  },
  {
    id: '8',
    senderName: 'พิมพ์ใจ ศรีสุข',
    email: 'pimjai@email.com',
    subject: 'แจ้งท่อน้ำแตกบริเวณซอย 8',
    message:
      'ท่อน้ำประปาแตกบริเวณซอย 8 น้ำไหลนองบนถนน รบกวนส่งเจ้าหน้าที่มาซ่อมด่วนด้วยค่ะ',
    date: '9 มี.ค. 2568',
    status: 'replied',
  },
];

const statusConfig = {
  new: {
    label: 'ใหม่',
    className: 'bg-red-50 text-red-700',
    icon: Mail,
  },
  read: {
    label: 'อ่านแล้ว',
    className: 'bg-yellow-50 text-yellow-700',
    icon: MailOpen,
  },
  replied: {
    label: 'ตอบแล้ว',
    className: 'bg-green-50 text-green-700',
    icon: MessageSquareReply,
  },
};

export default function ContactsPage() {
  const [messages, setMessages] = useState(demoMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => m.status === 'new').length;
  const repliedMessages = messages.filter((m) => m.status === 'replied').length;

  const filteredMessages =
    filterStatus === 'all'
      ? messages
      : messages.filter((m) => m.status === filterStatus);

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id && m.status === 'new' ? { ...m, status: 'read' as const } : m))
    );
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    // Auto mark as read when expanding
    const msg = messages.find((m) => m.id === id);
    if (msg && msg.status === 'new') {
      markAsRead(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gov-50 rounded-lg">
              <Inbox className="w-6 h-6 text-gov-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">ข้อความติดต่อ</h1>
              <p className="text-sm text-gray-500">จัดการข้อความติดต่อจากประชาชน</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-500 bg-white"
            >
              <option value="all">ทั้งหมด</option>
              <option value="new">ใหม่</option>
              <option value="read">อ่านแล้ว</option>
              <option value="replied">ตอบแล้ว</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <Inbox className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">ข้อความทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-800">{totalMessages}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 rounded-lg">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">ยังไม่อ่าน</p>
                <p className="text-2xl font-bold text-gray-800">{unreadMessages}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">ตอบแล้ว</p>
                <p className="text-2xl font-bold text-gray-800">{repliedMessages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  ชื่อผู้ส่ง
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  อีเมล
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  หัวข้อ
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  วันที่
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  สถานะ
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => {
                const config = statusConfig[msg.status];
                const StatusIcon = config.icon;
                const isExpanded = expandedId === msg.id;

                return (
                  <tr key={msg.id} className="border-b border-gray-100">
                    <td colSpan={6} className="p-0">
                      {/* Main row */}
                      <div
                        onClick={() => toggleExpand(msg.id)}
                        className={`flex items-center cursor-pointer hover:bg-gray-50 transition-colors ${
                          msg.status === 'new' ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex-shrink-0 px-4 py-3 w-44">
                          <span
                            className={`text-sm ${
                              msg.status === 'new'
                                ? 'font-semibold text-gray-800'
                                : 'text-gray-700'
                            }`}
                          >
                            {msg.senderName}
                          </span>
                        </div>
                        <div className="px-4 py-3 w-48">
                          <span className="text-sm text-gray-500 truncate block">
                            {msg.email}
                          </span>
                        </div>
                        <div className="flex-1 px-4 py-3">
                          <span
                            className={`text-sm truncate block ${
                              msg.status === 'new'
                                ? 'font-semibold text-gray-800'
                                : 'text-gray-700'
                            }`}
                          >
                            {msg.subject}
                          </span>
                        </div>
                        <div className="px-4 py-3 w-36">
                          <span className="text-sm text-gray-500">{msg.date}</span>
                        </div>
                        <div className="px-4 py-3 w-28">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${config.className}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </div>
                        <div className="px-4 py-3 w-32 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {msg.status === 'new' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(msg.id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                title="ทำเครื่องหมายว่าอ่านแล้ว"
                              >
                                <MailOpen className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                              title="ตอบกลับ"
                            >
                              <MessageSquareReply className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(msg.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="ลบ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                          <p className="text-sm text-gray-500 mb-1 font-medium">เนื้อหาข้อความ:</p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {msg.message}
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gov-600 rounded-lg hover:bg-gov-700 transition-colors"
                            >
                              <MessageSquareReply className="w-3.5 h-3.5" />
                              ตอบกลับ
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(msg.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              ลบ
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
