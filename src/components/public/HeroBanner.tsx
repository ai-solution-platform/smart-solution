'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
}

const demoBanners: Banner[] = [
  {
    id: 1,
    title: 'เทศบาลตำบลสมาร์ทซิตี้',
    subtitle: 'ก้าวสู่การเป็นเมืองอัจฉริยะ เพื่อคุณภาพชีวิตที่ดีกว่าของประชาชน',
    imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=800&fit=crop',
    linkUrl: '#',
  },
  {
    id: 2,
    title: 'บริการออนไลน์ 24 ชั่วโมง',
    subtitle: 'ยื่นคำร้อง ชำระภาษี ติดตามสถานะ ผ่านระบบ e-Service ได้ทุกที่ทุกเวลา',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=800&fit=crop',
    linkUrl: '#',
  },
  {
    id: 3,
    title: 'Smart City Smart Life',
    subtitle: 'เชื่อมโยงข้อมูลภาครัฐ สร้างความโปร่งใส พัฒนาเมืองอย่างยั่งยืน',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=800&fit=crop',
    linkUrl: '#',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % demoBanners.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + demoBanners.length) % demoBanners.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] max-h-[800px] overflow-hidden">
      {/* Slides */}
      {demoBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex items-end md:items-center h-full">
            <div className="container mx-auto px-4 pb-24 md:pb-0">
              <div className="max-w-3xl">
                <h1
                  className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 transition-transform duration-700 ${
                    index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {banner.title}
                </h1>
                <p
                  className={`text-lg md:text-xl lg:text-2xl text-white/90 mb-8 transition-transform duration-700 delay-100 ${
                    index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {banner.subtitle}
                </p>
                <a
                  href={banner.linkUrl}
                  className={`inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-700 delay-200 ${
                    index === current ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  อ่านเพิ่มเติม
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        aria-label="ก่อนหน้า"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        aria-label="ถัดไป"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {demoBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`สไลด์ ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
