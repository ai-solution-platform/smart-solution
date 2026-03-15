'use client';

import { useState } from 'react';
import {
  Send,
  Bell,
  Clock,
  CheckCircle2,
  Eye,
  Link as LinkIcon,
  Calendar,
  Users,
  Globe,
  Mail,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

interface SentNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  targetAudience: string;
  channels: string[];
  sentDate: string;
  status: 'sent' | 'scheduled';
  recipientCount: number;
}

const notificationTypes = ['ข่าวสาร', 'ประกาศสำคัญ', 'แจ้งเตือนบริการ', 'อื่นๆ'];
const targetAudiences = ['ทุกคน', 'เฉพาะผู้ลงทะเบียน', 'กลุ่มเฉพาะ'];

const demoSentNotifications: SentNotification[] = [
  {
    id: '1',
    title: 'แจ้งปิดให้บริการชั่วคราว วันที่ 20 มี.ค. 2026',
    message: 'เทศบาลตำบลบ้านนาจะปิดให้บริการชั่วคราวในวันที่ 20 มีนาคม 2026 เนื่องจากมีการปรับปรุงระบบไฟฟ้าภายในอาคาร',
    type: 'ประกาศสำคัญ',
    targetAudience: 'ทุกคน',
    channels: ['เว็บไซต์', 'อีเมล'],
    sentDate: '2026-03-15 09:30',
    status: 'sent',
    recipientCount: 1250,
  },
  {
    id: '2',
    title: 'เปิดลงทะเบียนผู้สูงอายุ ประจำปี 2026',
    message: 'เทศบาลเปิดรับลงทะเบียนผู้สูงอายุเพื่อรับเบี้ยยังชีพ ประจำปีงบประมาณ 2026 ตั้งแต่วันที่ 1-30 เมษายน 2026',
    type: 'ข่าวสาร',
    targetAudience: 'ทุกคน',
    channels: ['เว็บไซต์'],
    sentDate: '2026-03-14 14:00',
    status: 'sent',
    recipientCount: 1250,
  },
  {
    id: '3',
    title: 'แจ้งกำหนดชำระภาษีที่ดินและสิ่งปลูกสร้าง',
    message: 'ขอเชิญชวนประชาชนชำระภาษีที่ดินและสิ่งปลูกสร้าง ภายในวันที่ 30 เมษายน 2026 สามารถชำระได้ที่สำนักงานเทศบาล หรือผ่านช่องทางออนไลน์',
    type: 'แจ้งเตือนบริการ',
    targetAudience: 'เฉพาะผู้ลงทะเบียน',
    channels: ['เว็บไซต์', 'อีเมล'],
    sentDate: '2026-03-12 10:00',
    status: 'sent',
    recipientCount: 830,
  },
  {
    id: '4',
    title: 'กิจกรรมวันสงกรานต์ 2026',
    message: 'เทศบาลตำบลบ้านนาขอเชิญชวนพี่น้องประชาชนร่วมกิจกรรมวันสงกรานต์ ประจำปี 2026 ณ ลานวัฒนธรรม วันที่ 13-15 เมษายน 2026',
    type: 'ข่าวสาร',
    targetAudience: 'ทุกคน',
    channels: ['เว็บไซต์'],
    sentDate: '2026-04-01 08:00',
    status: 'scheduled',
    recipientCount: 0,
  },
  {
    id: '5',
    title: 'แจ้งเปลี่ยนแปลงเวลาจัดเก็บขยะ',
    message: 'ตั้งแต่วันที่ 1 เมษายน 2026 เป็นต้นไป จะเปลี่ยนเวลาจัดเก็บขยะจาก 06:00 น. เป็น 07:00 น. เนื่องจากปรับเส้นทางการจัดเก็บ',
    type: 'ประกาศสำคัญ',
    targetAudience: 'ทุกคน',
    channels: ['เว็บไซต์', 'อีเมล'],
    sentDate: '2026-03-10 11:00',
    status: 'sent',
    recipientCount: 1250,
  },
];

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('ข่าวสาร');
  const [targetAudience, setTargetAudience] = useState('ทุกคน');
  const [channels, setChannels] = useState<string[]>(['เว็บไซต์']);
  const [relatedLink, setRelatedLink] = useState('');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');
  const [scheduleDatetime, setScheduleDatetime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>(demoSentNotifications);

  const toggleChannel = (ch: string) => {
    setChannels((prev) => (prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]));
  };

  const handleSend = () => {
    const newNotification: SentNotification = {
      id: String(Date.now()),
      title,
      message,
      type,
      targetAudience,
      channels,
      sentDate: scheduleMode === 'now' ? new Date().toISOString().slice(0, 16).replace('T', ' ') : scheduleDatetime.replace('T', ' '),
      status: scheduleMode === 'now' ? 'sent' : 'scheduled',
      recipientCount: scheduleMode === 'now' ? (targetAudience === 'ทุกคน' ? 1250 : targetAudience === 'เฉพาะผู้ลงทะเบียน' ? 830 : 150) : 0,
    };
    setSentNotifications((prev) => [newNotification, ...prev]);
    setTitle('');
    setMessage('');
    setType('ข่าวสาร');
    setTargetAudience('ทุกคน');
    setChannels(['เว็บไซต์']);
    setRelatedLink('');
    setScheduleMode('now');
    setScheduleDatetime('');
    setShowConfirm(false);
  };

  const typeIcon = (t: string) => {
    switch (t) {
      case 'ข่าวสาร':
        return <MessageSquare className="w-4 h-4" />;
      case 'ประกาศสำคัญ':
        return <AlertTriangle className="w-4 h-4" />;
      case 'แจ้งเตือนบริการ':
        return <Bell className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ส่งการแจ้งเตือน</h1>
        <p className="text-gray-500 mt-1">สร้างและส่งการแจ้งเตือนไปยังพลเมือง</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">สร้างการแจ้งเตือนใหม่</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">หัวข้อ <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ระบุหัวข้อการแจ้งเตือน"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ข้อความ <span className="text-red-500">*</span></label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="พิมพ์ข้อความแจ้งเตือน..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ประเภท</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {notificationTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">กลุ่มเป้าหมาย</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {targetAudiences.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Channels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ช่องทาง</label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.includes('เว็บไซต์')}
                  onChange={() => toggleChannel('เว็บไซต์')}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">เว็บไซต์</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.includes('อีเมล')}
                  onChange={() => toggleChannel('อีเมล')}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">อีเมล</span>
              </label>
              <label className="flex items-center gap-2 cursor-not-allowed opacity-60">
                <input
                  type="checkbox"
                  disabled
                  className="w-4 h-4 text-gray-400 rounded"
                />
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">LINE</span>
                <span className="text-[10px] font-medium bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">Coming Soon</span>
              </label>
            </div>
          </div>

          {/* Related Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ลิงก์ที่เกี่ยวข้อง (ไม่บังคับ)</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={relatedLink}
                onChange={(e) => setRelatedLink(e.target.value)}
                placeholder="https://example.com/..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">กำหนดเวลาส่ง</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="schedule"
                  checked={scheduleMode === 'now'}
                  onChange={() => setScheduleMode('now')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">ส่งทันที</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="schedule"
                  checked={scheduleMode === 'schedule'}
                  onChange={() => setScheduleMode('schedule')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">กำหนดเวลา</span>
              </label>
            </div>
            {scheduleMode === 'schedule' && (
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="datetime-local"
                  value={scheduleDatetime}
                  onChange={(e) => setScheduleDatetime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              disabled={!title || !message}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="w-4 h-4" />
              ตัวอย่าง
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={!title || !message || channels.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {scheduleMode === 'now' ? 'ส่งการแจ้งเตือน' : 'ตั้งเวลาส่ง'}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ตัวอย่างการแจ้งเตือน</h2>
          {title || message ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-600 px-4 py-3">
                <div className="flex items-center gap-2 text-white">
                  <Bell className="w-4 h-4" />
                  <span className="text-xs font-medium">การแจ้งเตือนใหม่</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  {typeIcon(type)}
                  <span className="text-xs font-medium text-gray-500">{type}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{title || 'หัวข้อการแจ้งเตือน'}</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{message || 'ข้อความการแจ้งเตือน...'}</p>
                {relatedLink && (
                  <a href="#" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                    <LinkIcon className="w-3 h-3" />
                    ดูรายละเอียด
                  </a>
                )}
              </div>
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>กลุ่มเป้าหมาย: {targetAudience}</span>
                  <span>{channels.join(', ')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Bell className="w-10 h-10 mb-3" />
              <p className="text-sm">กรอกข้อมูลเพื่อดูตัวอย่าง</p>
            </div>
          )}
        </div>
      </div>

      {/* Sent History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">ประวัติการแจ้งเตือน</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">หัวข้อ</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">ประเภท</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">กลุ่มเป้าหมาย</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">ช่องทาง</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">วันที่ส่ง</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">สถานะ</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">ผู้รับ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sentNotifications.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{n.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      {typeIcon(n.type)}
                      {n.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{n.targetAudience}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {n.channels.map((ch) => (
                        <span key={ch} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{ch}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{n.sentDate}</td>
                  <td className="px-4 py-3">
                    {n.status === 'sent' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ส่งแล้ว
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3.5 h-3.5" />
                        ตั้งเวลาไว้
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {n.recipientCount > 0 ? n.recipientCount.toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">ตัวอย่างการแจ้งเตือน</h2>
              <button type="button" onClick={() => setShowPreview(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <span className="text-gray-500 text-xl leading-none">&times;</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-blue-600 px-4 py-3">
                  <div className="flex items-center gap-2 text-white">
                    <Bell className="w-4 h-4" />
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{message}</p>
                  {relatedLink && (
                    <a href="#" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      <LinkIcon className="w-4 h-4" />
                      {relatedLink}
                    </a>
                  )}
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {targetAudience}
                  </div>
                  <div>{channels.join(', ')}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Send className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">ยืนยันการส่งการแจ้งเตือน</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>หัวข้อ: <span className="font-medium text-gray-900">{title}</span></p>
                <p>ประเภท: {type}</p>
                <p>กลุ่มเป้าหมาย: {targetAudience}</p>
                <p>ช่องทาง: {channels.join(', ')}</p>
                {scheduleMode === 'schedule' && <p>กำหนดส่ง: {scheduleDatetime.replace('T', ' ')}</p>}
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {scheduleMode === 'now' ? 'ส่งเลย' : 'ตั้งเวลาส่ง'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
