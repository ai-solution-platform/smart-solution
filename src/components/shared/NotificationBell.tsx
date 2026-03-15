'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Bell,
  MessageSquareWarning,
  Newspaper,
  Megaphone,
  Settings2,
  Calendar,
  Check,
  ChevronRight,
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

interface NotificationBellProps {
  /** Polling interval in ms (default 30000 = 30s) */
  pollingInterval?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function formatThaiTime(dateString: string): string {
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
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543; // Buddhist Era
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationBell({
  pollingInterval = 30000,
}: NotificationBellProps) {
  const { isLoggedIn, citizen } = useCitizenAuth();
  const citizenId = citizen?.id;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Fetch notifications
  // ---------------------------------------------------------------------------

  const fetchNotifications = useCallback(async () => {
    if (!citizenId) return;

    try {
      const res = await fetch(
        `/api/notifications?citizenId=${citizenId}&limit=10&page=1`,
        {
          headers: { 'x-citizen-id': citizenId },
        }
      );

      if (!res.ok) return;

      const data: NotificationResponse = await res.json();
      setNotifications(data.items);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setInitialLoad(false);
    }
  }, [citizenId]);

  // ---------------------------------------------------------------------------
  // Polling with visibility check
  // ---------------------------------------------------------------------------

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchNotifications();
      }
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchNotifications, pollingInterval]);

  // ---------------------------------------------------------------------------
  // Close dropdown on outside click
  // ---------------------------------------------------------------------------

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ---------------------------------------------------------------------------
  // Mark as read
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
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (notification.linkUrl) {
      window.location.href = notification.linkUrl;
    }

    setIsOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Don't render if not logged in
  if (!isLoggedIn || !citizenId) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="การแจ้งเตือน"
        title="การแจ้งเตือน"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[480px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">
              การแจ้งเตือน
            </h3>
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                {unreadCount} ยังไม่อ่าน
              </span>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">ไม่มีการแจ้งเตือน</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent =
                  NOTIFICATION_ICONS[notification.type] || Bell;
                const colorClass =
                  NOTIFICATION_COLORS[notification.type] ||
                  'bg-gray-100 text-gray-600';

                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 flex gap-3 ${
                      !notification.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm leading-snug line-clamp-1 ${
                            notification.isRead
                              ? 'text-gray-700'
                              : 'text-gray-900 font-medium'
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {formatThaiTime(notification.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100">
            <Link
              href="/notifications"
              className="flex items-center justify-center gap-1 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              ดูทั้งหมด
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
