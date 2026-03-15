'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  Newspaper,
  MessageSquareWarning,
  Settings2,
  Calendar,
  Globe,
  Mail,
  MessageCircle,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NotificationChannel = 'IN_APP' | 'EMAIL' | 'LINE';

interface CategoryPreference {
  category: string;
  enabled: boolean;
  channels: NotificationChannel[];
}

interface PreferencesResponse {
  citizenId: string;
  tenantId: string;
  preferences: CategoryPreference[];
  isDefault: boolean;
}

interface NotificationPreferencesProps {
  citizenId: string;
  tenantId: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = [
  {
    key: 'NEWS_ANNOUNCEMENT',
    label: 'ข่าวสารและประกาศ',
    description: 'รับการแจ้งเตือนเมื่อมีข่าวสารหรือประกาศใหม่จากหน่วยงาน',
    icon: Newspaper,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    key: 'COMPLAINT_STATUS',
    label: 'สถานะเรื่องร้องเรียน',
    description: 'รับการแจ้งเตือนเมื่อสถานะเรื่องร้องเรียนของคุณมีการเปลี่ยนแปลง',
    icon: MessageSquareWarning,
    color: 'text-orange-600 bg-orange-100',
  },
  {
    key: 'E_SERVICE',
    label: 'บริการออนไลน์',
    description: 'รับการแจ้งเตือนเมื่อมีอัปเดตเกี่ยวกับคำขอบริการออนไลน์ของคุณ',
    icon: Settings2,
    color: 'text-green-600 bg-green-100',
  },
  {
    key: 'COMMUNITY_EVENT',
    label: 'กิจกรรมชุมชน',
    description: 'รับการแจ้งเตือนเมื่อมีกิจกรรมชุมชนหรืออีเวนต์ใหม่',
    icon: Calendar,
    color: 'text-pink-600 bg-pink-100',
  },
] as const;

const CHANNELS: {
  key: NotificationChannel;
  label: string;
  description: string;
  icon: typeof Bell;
  comingSoon?: boolean;
}[] = [
  {
    key: 'IN_APP',
    label: 'แจ้งเตือนในเว็บไซต์',
    description: 'แสดงการแจ้งเตือนบนเว็บไซต์',
    icon: Globe,
  },
  {
    key: 'EMAIL',
    label: 'แจ้งเตือนทางอีเมล',
    description: 'ส่งอีเมลแจ้งเตือนไปยังอีเมลที่ลงทะเบียน',
    icon: Mail,
  },
  {
    key: 'LINE',
    label: 'แจ้งเตือนทาง LINE',
    description: 'ส่งการแจ้งเตือนผ่าน LINE Notify',
    icon: MessageCircle,
    comingSoon: true,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationPreferences({
  citizenId,
  tenantId,
  className = '',
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<CategoryPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // ---------------------------------------------------------------------------
  // Fetch current preferences
  // ---------------------------------------------------------------------------

  const fetchPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/notifications/subscribe?citizenId=${citizenId}`,
        {
          headers: { 'x-citizen-id': citizenId },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch preferences');

      const data: PreferencesResponse = await res.json();
      setPreferences(data.preferences);
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
      // Set defaults if fetch fails
      setPreferences(
        CATEGORIES.map((cat) => ({
          category: cat.key,
          enabled: true,
          channels: ['IN_APP'] as NotificationChannel[],
        }))
      );
    } finally {
      setIsLoading(false);
    }
  }, [citizenId]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  // ---------------------------------------------------------------------------
  // Toggle handlers
  // ---------------------------------------------------------------------------

  const toggleCategory = (categoryKey: string) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.category === categoryKey
          ? { ...pref, enabled: !pref.enabled }
          : pref
      )
    );
    setSaveStatus('idle');
  };

  const toggleChannel = (categoryKey: string, channel: NotificationChannel) => {
    // Do not allow toggling LINE (coming soon)
    if (channel === 'LINE') return;

    setPreferences((prev) =>
      prev.map((pref) => {
        if (pref.category !== categoryKey) return pref;

        const hasChannel = pref.channels.includes(channel);

        // Prevent removing IN_APP (always required)
        if (channel === 'IN_APP' && hasChannel) return pref;

        const newChannels = hasChannel
          ? pref.channels.filter((ch) => ch !== channel)
          : [...pref.channels, channel];

        return { ...pref, channels: newChannels };
      })
    );
    setSaveStatus('idle');
  };

  // ---------------------------------------------------------------------------
  // Save
  // ---------------------------------------------------------------------------

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-citizen-id': citizenId,
        },
        body: JSON.stringify({
          citizenId,
          tenantId,
          preferences,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'บันทึกไม่สำเร็จ');
      }

      setSaveStatus('success');

      // Reset success status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
      setSaveStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึก'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-8 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          ตั้งค่าการแจ้งเตือน
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          เลือกประเภทการแจ้งเตือนและช่องทางที่ต้องการรับข้อมูล
        </p>
      </div>

      {/* Category preferences */}
      <div className="divide-y divide-gray-100">
        {CATEGORIES.map((cat) => {
          const pref = preferences.find((p) => p.category === cat.key);
          const isEnabled = pref?.enabled ?? true;
          const activeChannels = pref?.channels ?? ['IN_APP'];
          const IconComponent = cat.icon;

          return (
            <div key={cat.key} className="px-6 py-5">
              {/* Category toggle */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cat.color}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  onClick={() => toggleCategory(cat.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                    isEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={isEnabled}
                  aria-label={`${isEnabled ? 'ปิด' : 'เปิด'}การแจ้งเตือน${cat.label}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Channel preferences (shown when category is enabled) */}
              {isEnabled && (
                <div className="mt-4 pl-0 sm:pl-[52px]">
                  <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">
                    ช่องทางการแจ้งเตือน
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CHANNELS.map((channel) => {
                      const isActive = activeChannels.includes(channel.key);
                      const ChannelIcon = channel.icon;

                      return (
                        <button
                          key={channel.key}
                          onClick={() => toggleChannel(cat.key, channel.key)}
                          disabled={
                            channel.comingSoon ||
                            (channel.key === 'IN_APP' && isActive)
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            channel.comingSoon
                              ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                              : isActive
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                          }`}
                          title={
                            channel.comingSoon
                              ? 'เร็ว ๆ นี้'
                              : channel.description
                          }
                        >
                          <ChannelIcon className="w-3.5 h-3.5" />
                          {channel.label}
                          {channel.comingSoon && (
                            <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                              เร็ว ๆ นี้
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save section */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
        {/* Status message */}
        <div className="min-w-0">
          {saveStatus === 'success' && (
            <p className="text-sm text-green-600 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 shrink-0" />
              บันทึกการตั้งค่าเรียบร้อยแล้ว
            </p>
          )}
          {saveStatus === 'error' && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </p>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 shrink-0"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
}
