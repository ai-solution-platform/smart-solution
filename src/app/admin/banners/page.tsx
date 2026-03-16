'use client';

import { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Calendar,
  LayoutGrid,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  status: 'active' | 'inactive';
  order: number;
  startDate: string;
  endDate: string;
  expired: boolean;
}

const demoBanners: Banner[] = [
  {
    id: '1',
    title: 'โครงการ Smart City 2568',
    status: 'active',
    order: 1,
    startDate: '1 ม.ค. 2568',
    endDate: '31 ธ.ค. 2568',
    expired: false,
  },
  {
    id: '2',
    title: 'ตรวจสุขภาพฟรี',
    status: 'active',
    order: 2,
    startDate: '1 มี.ค. 2568',
    endDate: '30 มิ.ย. 2568',
    expired: false,
  },
  {
    id: '3',
    title: 'เทศกาลสงกรานต์ 2568',
    status: 'active',
    order: 3,
    startDate: '10 เม.ย. 2568',
    endDate: '16 เม.ย. 2568',
    expired: false,
  },
  {
    id: '4',
    title: 'ชำระภาษีออนไลน์',
    status: 'inactive',
    order: 4,
    startDate: '1 ม.ค. 2568',
    endDate: '28 ก.พ. 2568',
    expired: true,
  },
  {
    id: '5',
    title: 'รับสมัครงาน',
    status: 'inactive',
    order: 5,
    startDate: '15 ม.ค. 2568',
    endDate: '15 ก.พ. 2568',
    expired: true,
  },
];

const placeholderColors = [
  'bg-gradient-to-br from-blue-200 to-blue-300',
  'bg-gradient-to-br from-green-200 to-green-300',
  'bg-gradient-to-br from-purple-200 to-purple-300',
  'bg-gradient-to-br from-orange-200 to-orange-300',
  'bg-gradient-to-br from-pink-200 to-pink-300',
];

export default function BannersPage() {
  const [banners, setBanners] = useState(demoBanners);

  const totalBanners = banners.length;
  const activeBanners = banners.filter((b) => b.status === 'active').length;
  const expiredBanners = banners.filter((b) => b.expired).length;

  const toggleStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' }
          : b
      )
    );
  };

  const handleDelete = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gov-50 rounded-lg">
              <LayoutGrid className="w-6 h-6 text-gov-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">จัดการแบนเนอร์</h1>
              <p className="text-sm text-gray-500">จัดการแบนเนอร์แสดงหน้าเว็บไซต์</p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-gov-600 rounded-lg hover:bg-gov-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            เพิ่มแบนเนอร์
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">แบนเนอร์ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-800">{totalBanners}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">กำลังแสดง</p>
                <p className="text-2xl font-bold text-gray-800">{activeBanners}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">หมดอายุ</p>
                <p className="text-2xl font-bold text-gray-800">{expiredBanners}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="space-y-4">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                {/* Drag handle */}
                <div className="flex-shrink-0 cursor-grab text-gray-300 hover:text-gray-500">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Placeholder image */}
                <div
                  className={`flex-shrink-0 w-40 h-20 rounded-lg ${placeholderColors[idx % placeholderColors.length]} flex items-center justify-center`}
                >
                  <ImageIcon className="w-8 h-8 text-white/70" />
                </div>

                {/* Banner info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {banner.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {banner.startDate} - {banner.endDate}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      ลำดับ: {banner.order}
                    </span>
                  </div>
                </div>

                {/* Status toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleStatus(banner.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      banner.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        banner.status === 'active'
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      banner.status === 'active'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {banner.status === 'active' ? 'แสดง' : 'ซ่อน'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
