'use client';

import { useState } from 'react';
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Image as ImageIcon,
  Grid3X3,
} from 'lucide-react';

interface Album {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  coverColor: string;
  photoCount: number;
  photos: { id: number; caption: string; color: string }[];
}

const albums: Album[] = [
  {
    id: 1,
    title: 'กิจกรรมวันเด็กแห่งชาติ ประจำปี 2568',
    description: 'เทศบาลจัดกิจกรรมวันเด็กแห่งชาติ มีการแสดงบนเวที เกมส์ แจกของขวัญ และอาหารฟรี',
    category: 'กิจกรรม',
    date: '11 มกราคม 2568',
    coverColor: 'from-yellow-200 to-orange-200',
    photoCount: 24,
    photos: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      caption: `ภาพกิจกรรมวันเด็ก ${i + 1}`,
      color: ['from-yellow-100 to-orange-100', 'from-pink-100 to-red-100', 'from-blue-100 to-purple-100'][i % 3],
    })),
  },
  {
    id: 2,
    title: 'โครงการปลูกป่าชุมชน เฉลิมพระเกียรติ',
    description: 'โครงการปลูกต้นไม้ 1,000 ต้น เพื่อเพิ่มพื้นที่สีเขียวในชุมชน',
    category: 'โครงการ',
    date: '5 ธันวาคม 2567',
    coverColor: 'from-green-200 to-emerald-200',
    photoCount: 18,
    photos: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      caption: `ภาพกิจกรรมปลูกป่า ${i + 1}`,
      color: ['from-green-100 to-emerald-100', 'from-lime-100 to-green-100', 'from-teal-100 to-cyan-100'][i % 3],
    })),
  },
  {
    id: 3,
    title: 'ประชุมสภาเทศบาล สมัยสามัญ สมัยที่ 1/2568',
    description: 'การประชุมสภาเทศบาลตำบลสมาร์ทซิตี้ สมัยสามัญ สมัยที่ 1 ประจำปี 2568',
    category: 'ประชุม',
    date: '15 กุมภาพันธ์ 2568',
    coverColor: 'from-blue-200 to-indigo-200',
    photoCount: 12,
    photos: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      caption: `ภาพประชุมสภา ${i + 1}`,
      color: ['from-blue-100 to-indigo-100', 'from-slate-100 to-blue-100', 'from-indigo-100 to-purple-100'][i % 3],
    })),
  },
  {
    id: 4,
    title: 'กิจกรรมลอยกระทง ประจำปี 2567',
    description: 'เทศบาลจัดงานลอยกระทง สืบสานประเพณีไทย พร้อมการแสดงศิลปวัฒนธรรม',
    category: 'กิจกรรม',
    date: '15 พฤศจิกายน 2567',
    coverColor: 'from-purple-200 to-pink-200',
    photoCount: 30,
    photos: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      caption: `ภาพงานลอยกระทง ${i + 1}`,
      color: ['from-purple-100 to-pink-100', 'from-amber-100 to-yellow-100', 'from-rose-100 to-pink-100'][i % 3],
    })),
  },
  {
    id: 5,
    title: 'โครงการตรวจสุขภาพประชาชน ครั้งที่ 2/2567',
    description: 'โครงการตรวจสุขภาพเชิงรุกสำหรับประชาชนในเขตเทศบาล',
    category: 'โครงการ',
    date: '20 ตุลาคม 2567',
    coverColor: 'from-pink-200 to-rose-200',
    photoCount: 15,
    photos: Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      caption: `ภาพตรวจสุขภาพ ${i + 1}`,
      color: ['from-pink-100 to-rose-100', 'from-red-100 to-pink-100', 'from-orange-100 to-red-100'][i % 3],
    })),
  },
  {
    id: 6,
    title: 'ประชุมคณะกรรมการพัฒนาเทศบาล ครั้งที่ 4/2567',
    description: 'ประชุมติดตามความก้าวหน้าโครงการพัฒนาท้องถิ่น',
    category: 'ประชุม',
    date: '10 กันยายน 2567',
    coverColor: 'from-slate-200 to-gray-200',
    photoCount: 8,
    photos: Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      caption: `ภาพประชุมคณะกรรมการ ${i + 1}`,
      color: ['from-slate-100 to-gray-100', 'from-gray-100 to-zinc-100', 'from-stone-100 to-gray-100'][i % 3],
    })),
  },
];

const categoryFilters = ['ทั้งหมด', 'กิจกรรม', 'โครงการ', 'ประชุม'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredAlbums =
    activeCategory === 'ทั้งหมด'
      ? albums
      : albums.filter((a) => a.category === activeCategory);

  const openLightbox = (album: Album, index: number) => {
    setSelectedAlbum(album);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!selectedAlbum || lightboxIndex === null) return;
    const total = selectedAlbum.photos.length;
    if (direction === 'prev') {
      setLightboxIndex((lightboxIndex - 1 + total) % total);
    } else {
      setLightboxIndex((lightboxIndex + 1) % total);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
            <Camera className="w-9 h-9" />
            คลังภาพกิจกรรม
          </h1>
          <p className="text-blue-100 text-lg">รวมภาพกิจกรรม โครงการ และการดำเนินงานต่าง ๆ ของเทศบาล</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <a href="/" className="hover:text-white">หน้าแรก</a>
            <span>/</span>
            <span>คลังภาพ</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categoryFilters.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedAlbum(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Album View */}
        {selectedAlbum ? (
          <div>
            {/* Album Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={closeAlbum}
                className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedAlbum.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedAlbum.date} | {selectedAlbum.photoCount} ภาพ
                </p>
              </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {selectedAlbum.photos.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => openLightbox(selectedAlbum, i)}
                  className={`aspect-square rounded-xl bg-gradient-to-br ${photo.color} flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer`}
                >
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">{photo.caption}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Album Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.map((album) => (
              <button
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 overflow-hidden text-left group"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${album.coverColor} flex items-center justify-center relative`}
                >
                  <Camera className="w-12 h-12 text-white/60" />
                  <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Grid3X3 className="w-3 h-3" />
                    {album.photoCount} ภาพ
                  </div>
                  <span className="absolute top-3 left-3 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                    {album.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{album.description}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {album.date}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {filteredAlbums.length === 0 && !selectedAlbum && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">ไม่พบอัลบั้มภาพ</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedAlbum && lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={() => navigateLightbox('prev')}
            className="absolute left-4 text-white/80 hover:text-white p-2"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="max-w-4xl w-full mx-8">
            <div
              className={`aspect-video rounded-xl bg-gradient-to-br ${selectedAlbum.photos[lightboxIndex].color} flex items-center justify-center`}
            >
              <div className="text-center">
                <ImageIcon className="w-20 h-20 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">{selectedAlbum.photos[lightboxIndex].caption}</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-white/80 text-sm">
                {lightboxIndex + 1} / {selectedAlbum.photos.length}
              </p>
              <p className="text-white/60 text-xs mt-1">
                {selectedAlbum.photos[lightboxIndex].caption}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateLightbox('next')}
            className="absolute right-4 text-white/80 hover:text-white p-2"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
}
