'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  href: string;
}

const categories = ['ข่าวทั้งหมด', 'ข่าวประชาสัมพันธ์', 'ประกาศ'];

const demoNews: NewsItem[] = [
  {
    id: 1,
    title: 'เทศบาลตำบลสมาร์ทซิตี้ คว้ารางวัลองค์กรปกครองส่วนท้องถิ่นดีเด่น ประจำปี 2568',
    excerpt: 'เทศบาลตำบลสมาร์ทซิตี้ได้รับรางวัลองค์กรปกครองส่วนท้องถิ่นดีเด่น ด้านการบริหารจัดการที่ดี จากกรมส่งเสริมการปกครองท้องถิ่น',
    category: 'ข่าวประชาสัมพันธ์',
    date: '15 มี.ค. 2569',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&h=500&fit=crop',
    href: '#',
  },
  {
    id: 2,
    title: 'ประกาศรับสมัครบุคคลเพื่อสรรหาและเลือกสรรเป็นพนักงานจ้าง ประจำปีงบประมาณ 2569',
    excerpt: 'เทศบาลตำบลสมาร์ทซิตี้ มีความประสงค์จะรับสมัครบุคคลเพื่อสรรหาและเลือกสรรเป็นพนักงานจ้าง จำนวน 5 ตำแหน่ง',
    category: 'ประกาศ',
    date: '14 มี.ค. 2569',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop',
    href: '#',
  },
  {
    id: 3,
    title: 'โครงการส่งเสริมสุขภาพผู้สูงอายุ "สูงวัย สุขใจ ใส่ใจสุขภาพ"',
    excerpt: 'เทศบาลจัดโครงการส่งเสริมสุขภาพผู้สูงอายุ เพื่อให้ผู้สูงอายุมีสุขภาพกายและสุขภาพจิตที่ดี',
    category: 'ข่าวประชาสัมพันธ์',
    date: '12 มี.ค. 2569',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=500&fit=crop',
    href: '#',
  },
  {
    id: 4,
    title: 'แจ้งกำหนดการจ่ายเบี้ยยังชีพผู้สูงอายุและผู้พิการ ประจำเดือนมีนาคม 2569',
    excerpt: 'เทศบาลตำบลสมาร์ทซิตี้ แจ้งกำหนดการจ่ายเบี้ยยังชีพผู้สูงอายุและผู้พิการ ประจำเดือนมีนาคม 2569',
    category: 'ประกาศ',
    date: '10 มี.ค. 2569',
    imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=500&fit=crop',
    href: '#',
  },
  {
    id: 5,
    title: 'เปิดตัวแอปพลิเคชัน "Smart City" เชื่อมต่อประชาชนกับเทศบาล',
    excerpt: 'แอปพลิเคชันใหม่สำหรับแจ้งเรื่องร้องเรียน ติดตามสถานะ และรับข่าวสารจากเทศบาลได้ง่ายๆ ผ่านมือถือ',
    category: 'ข่าวประชาสัมพันธ์',
    date: '8 มี.ค. 2569',
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop',
    href: '#',
  },
];

function getCategoryColor(category: string) {
  switch (category) {
    case 'ข่าวประชาสัมพันธ์':
      return 'bg-blue-100 text-blue-700';
    case 'ประกาศ':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function NewsSection() {
  const [activeTab, setActiveTab] = useState('ข่าวทั้งหมด');

  const filteredNews =
    activeTab === 'ข่าวทั้งหมด'
      ? demoNews
      : demoNews.filter((n) => n.category === activeTab);

  const featured = filteredNews[0];
  const rest = filteredNews.slice(1, 5);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              ข่าวสารและประกาศ
            </h2>
            <p className="text-gray-500">ติดตามข่าวสารล่าสุดจากเทศบาลตำบลสมาร์ทซิตี้</p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 mt-4 md:mt-0 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            ดูทั้งหมด <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Featured */}
            <a href={featured.href} className="group block">
              <div className="relative rounded-xl overflow-hidden h-64 lg:h-full min-h-[300px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${featured.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getCategoryColor(featured.category)}`}
                  >
                    {featured.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {featured.title}
                  </h3>
                  <p className="text-sm text-white/80 line-clamp-2 mb-3">{featured.excerpt}</p>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar className="w-4 h-4" />
                    {featured.date}
                  </div>
                </div>
              </div>
            </a>

            {/* Rest */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rest.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all border border-gray-100"
                >
                  <div className="relative h-36 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${item.imageUrl})` }}
                    />
                  </div>
                  <div className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${getCategoryColor(item.category)}`}
                    >
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
