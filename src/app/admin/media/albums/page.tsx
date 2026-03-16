'use client';

import { useState } from 'react';
import {
  Images,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';

interface Album {
  id: string;
  title: string;
  photoCount: number;
  date: string;
}

const demoAlbums: Album[] = [
  {
    id: '1',
    title: 'กิจกรรมสงกรานต์ 2568',
    photoCount: 12,
    date: '16 เม.ย. 2568',
  },
  {
    id: '2',
    title: 'โครงการ Smart City',
    photoCount: 8,
    date: '10 มี.ค. 2568',
  },
  {
    id: '3',
    title: 'ประชุมสภาเทศบาล',
    photoCount: 15,
    date: '5 มี.ค. 2568',
  },
  {
    id: '4',
    title: 'ตรวจสุขภาพประชาชน',
    photoCount: 10,
    date: '28 ก.พ. 2568',
  },
  {
    id: '5',
    title: 'กีฬาเยาวชน',
    photoCount: 20,
    date: '20 ก.พ. 2568',
  },
  {
    id: '6',
    title: 'ปรับปรุงถนน',
    photoCount: 6,
    date: '15 ก.พ. 2568',
  },
];

const placeholderColors = [
  ['bg-blue-200', 'bg-blue-300', 'bg-blue-100', 'bg-blue-250'],
  ['bg-green-200', 'bg-green-300', 'bg-green-100', 'bg-green-250'],
  ['bg-purple-200', 'bg-purple-300', 'bg-purple-100', 'bg-purple-250'],
  ['bg-orange-200', 'bg-orange-300', 'bg-orange-100', 'bg-orange-250'],
  ['bg-pink-200', 'bg-pink-300', 'bg-pink-100', 'bg-pink-250'],
  ['bg-teal-200', 'bg-teal-300', 'bg-teal-100', 'bg-teal-250'],
];

const gridColors = [
  'bg-gradient-to-br from-blue-200 to-blue-300',
  'bg-gradient-to-br from-green-200 to-green-300',
  'bg-gradient-to-br from-purple-200 to-purple-300',
  'bg-gradient-to-br from-orange-200 to-orange-300',
  'bg-gradient-to-br from-pink-200 to-pink-300',
  'bg-gradient-to-br from-teal-200 to-teal-300',
];

export default function AlbumsPage() {
  const [albums, setAlbums] = useState(demoAlbums);

  const handleDelete = (id: string) => {
    setAlbums((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gov-50 rounded-lg">
              <Images className="w-6 h-6 text-gov-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">จัดการอัลบั้มภาพ</h1>
              <p className="text-sm text-gray-500">จัดการอัลบั้มภาพกิจกรรมและโครงการ</p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-gov-600 rounded-lg hover:bg-gov-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            สร้างอัลบั้ม
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Albums Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album, idx) => (
            <div
              key={album.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow"
            >
              {/* 2x2 Placeholder Image Grid */}
              <div className="grid grid-cols-2 gap-0.5 p-0.5 bg-gray-100">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`aspect-square ${gridColors[idx % gridColors.length]} flex items-center justify-center`}
                  >
                    <ImageIcon className="w-6 h-6 text-white/60" />
                  </div>
                ))}
              </div>

              {/* Album Info */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {album.title}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{album.photoCount} ภาพ</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{album.date}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    แก้ไข
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(album.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    ลบ
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
