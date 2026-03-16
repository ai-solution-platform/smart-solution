'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Camera, ArrowRight } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  date: string;
}

const demoImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    title: 'พิธีเปิดศูนย์บริการประชาชน แห่งใหม่',
    date: '10 มี.ค. 2569',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600&h=400&fit=crop',
    title: 'กิจกรรมวันเด็กแห่งชาติ 2569',
    date: '11 ม.ค. 2569',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop',
    title: 'โครงการปลูกป่าเฉลิมพระเกียรติ',
    date: '5 ธ.ค. 2568',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop',
    title: 'งานประเพณีลอยกระทง 2568',
    date: '15 พ.ย. 2568',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop',
    title: 'โครงการอบรมอาสาสมัครสาธารณสุข',
    date: '20 ต.ค. 2568',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop',
    title: 'กิจกรรมจิตอาสา เราทำความดี',
    date: '9 ต.ค. 2568',
  },
];

export default function GalleryPreview() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + demoImages.length) % demoImages.length);
  };

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % demoImages.length);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Camera className="w-7 h-7 text-blue-600" />
              ภาพกิจกรรม
            </h2>
            <p className="text-gray-500">รวมภาพกิจกรรมและโครงการต่างๆ ของเทศบาล</p>
          </div>
          <Link
            href="/gallery"
            className="hidden md:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            ดูอัลบั้มทั้งหมด <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {demoImages.map((img, index) => (
            <button
              key={img.id}
              onClick={() => openLightbox(index)}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${img.src})` }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-8 h-8 text-white mb-2" />
                <span className="text-white text-sm font-medium px-3 text-center line-clamp-2">
                  {img.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold"
          >
            ดูอัลบั้มทั้งหมด <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
            aria-label="ปิด"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
            aria-label="ก่อนหน้า"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
            aria-label="ถัดไป"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="max-w-4xl max-h-[85vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={demoImages[lightboxIndex].src}
              alt={demoImages[lightboxIndex].title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg mx-auto"
            />
            <div className="text-center mt-4">
              <p className="text-white font-medium">{demoImages[lightboxIndex].title}</p>
              <p className="text-white/60 text-sm">{demoImages[lightboxIndex].date}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
