'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Bell,
  MessageSquareWarning,
  Newspaper,
  Megaphone,
  Settings2,
  Calendar,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  LogIn,
  Loader2,
} from 'lucide-react';
import { useCitizenAuth } from '@/hooks/useCitizenAuth';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  linkUrl?: string | null;
  createdAt: string;
}

interface NotificationResponse {
  items: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type FilterTab =
  | 'all'
  | 'unread'
  | 'news'
  | 'complaint'
  | 'service';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'unread', label: 'ยังไม่อ่าน' },
  { key: 'news', label: 'ข่าวสาร' },
  { key: 'complaint', label: 'เรื่องร้องเรียน' },
  { key: 'service', label: 'บริการ' },
];

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  COMPLAINT_UPDATE: MessageSquareWarning,
  NEWS: Newspaper,
  ANNOUNCEMENT: Megaphone,
  SERVICE_STATUS: Settings2,
  COMMUNITY_EVENT: Calendar,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  COMPLAINT_UPDATE: 'bg-orange-100 text-orange-600',
  NEWS: 'bg-blue-100 text-blue-600',
  ANNOUNCEMENT: 'bg-purple-100 text-purple-600',
  SERVICE_STATUS: 'bg-green-100 text-green-600',
  COMMUNITY_EVENT: 'bg-pink-100 text-pink-600',
};

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  COMPLAINT_UPDATE: 'เรื่องร้องเรียน',
  NEWS: 'ข่าวสาร',
  ANNOUNCEMENT: 'ประกาศ',
  SERVICE_STATUS: 'สถานะบริการ',
  COMMUNITY_EVENT: 'กิจกรรมชุมชน',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatThaiDateTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'เมื่อสักครู่';
  if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;

  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ];
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
}

function getFilterParams(filter: FilterTab): Record<string, string> {
  switch (filter) {
    case 'unread':
      return { isRead: 'false' };
    case 'news':
      return { type: 'NEWS' };
    case 'complaint':
      return { type: 'COMPLAINT_UPDATE' };
    case 'service':
      return { type: 'SERVICE_STATUS' };
    default:
      return {};
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationsPage() {
  const { isLoggedIn, isLoading: isAuthChecking, citizen } = useCitizenAuth();
  const citizenId = citizen?.id ?? null;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const LIMIT = 15;

  // ---------------------------------------------------------------------------
  // Fetch notifications
  // ---------------------------------------------------------------------------

  const fetchNotifications = useCallback(async () => {
    if (!citizenId) return;

    setIsLoading(true);
    try {
      const filterParams = getFilterParams(activeFilter);
      const params = new URLSearchParams({
        citizenId,
        page: String(page),
        limit: String(LIMIT),
        ...filterParams,
      });

      const res = await fetch(`/api/notifications?${params}`, {
        headers: { 'x-citizen-id': citizenId },
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data: NotificationResponse = await res.json();
      setNotifications(data.items);
      setUnreadCount(data.unreadCount);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [citizenId, activeFilter, page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const markAsRead = async (notificationId: string) => {
    if (!citizenId) return;

    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-citizen-id': citizenId,
        },
        body: JSON.stringify({
          citizenId,
          notificationIds: [notificationId],
        }),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!citizenId || unreadCount === 0) return;

    setIsMarkingAll(true);
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-citizen-id': citizenId,
        },
        body: JSON.stringify({
          citizenId,
          markAll: true,
        }),
      });

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.linkUrl) {
      window.location.href = notification.linkUrl;
    }
  };

  const handleFilterChange = (filter: FilterTab) => {
    setActiveFilter(filter);
    setPage(1);
  };

  // ---------------------------------------------------------------------------
  // Auth prompt for non-logged-in users
  // ---------------------------------------------------------------------------

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn || !citizenId) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
              <Bell className="w-9 h-9" />
              การแจ้งเตือน
            </h1>
            <p className="text-blue-100 text-lg">ติดตามข่าวสารและสถานะการดำเนินงานของคุณ</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
              <Link href="/" className="hover:text-white">หน้าแรก</Link>
              <span>/</span>
              <span>การแจ้งเตือน</span>
            </div>
          </div>
        </div>

        {/* Login prompt */}
        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              กรุณาเข้าสู่ระบบ
            </h2>
            <p className="text-gray-500 mb-6">
              เข้าสู่ระบบเพื่อดูการแจ้งเตือนและติดตามสถานะเรื่องร้องเรียนของคุณ
            </p>
            <Link
              href="/auth/login?returnUrl=%2Fnotifications"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <LogIn className="w-5 h-5" />
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main notifications view
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
            <Bell className="w-9 h-9" />
            การแจ้งเตือน
          </h1>
          <p className="text-blue-100 text-lg">ติดตามข่าวสารและสถานะการดำเนินงานของคุณ</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <span>การแจ้งเตือน</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar: Filter tabs + Mark all as read */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleFilterChange(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === tab.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                {tab.key === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mark all as read */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={isMarkingAll}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium shrink-0 disabled:opacity-50"
            >
              {isMarkingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
              อ่านทั้งหมด
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-20 text-center">
              <Bell className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-1">
                ไม่มีการแจ้งเตือน
              </h3>
              <p className="text-sm text-gray-400">
                {activeFilter === 'unread'
                  ? 'คุณอ่านการแจ้งเตือนทั้งหมดแล้ว'
                  : 'ยังไม่มีการแจ้งเตือนในหมวดหมู่นี้'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const IconComponent =
                  NOTIFICATION_ICONS[notification.type] || Bell;
                const colorClass =
                  NOTIFICATION_COLORS[notification.type] ||
                  'bg-gray-100 text-gray-600';
                const typeLabel =
                  NOTIFICATION_TYPE_LABELS[notification.type] || notification.type;

                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex gap-4 ${
                      !notification.isRead ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                              {typeLabel}
                            </span>
                          </div>
                          <h4
                            className={`text-sm leading-snug ${
                              notification.isRead
                                ? 'text-gray-700'
                                : 'text-gray-900 font-semibold'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1.5">
                            {formatThaiDateTime(notification.createdAt)}
                          </p>
                        </div>

                        {/* Read/Unread indicator */}
                        <div className="shrink-0 mt-1">
                          {notification.isRead ? (
                            <Check className="w-4 h-4 text-gray-300" />
                          ) : (
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full block" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              แสดง {(page - 1) * LIMIT + 1}-{Math.min(page * LIMIT, total)} จาก {total} รายการ
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="หน้าก่อนหน้า"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 px-2">
                หน้า {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="หน้าถัดไป"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
