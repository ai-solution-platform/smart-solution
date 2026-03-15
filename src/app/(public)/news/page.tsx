'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'general', label: 'ข่าวทั่วไป' },
  { id: 'activity', label: 'กิจกรรม' },
  { id: 'project', label: 'โครงการ' },
  { id: 'emergency', label: 'ข่าวด่วน' },
  { id: 'health', label: 'สาธารณสุข' },
];

const newsItems = [
  {
    id: 1,
    slug: 'smart-city-development-2568',
    title: 'เทศบาลตำบลสมาร์ทซิตี้ เปิดตัวโครงการพัฒนาเมืองอัจฉริยะ ประจำปี 2568',
    excerpt: 'โครงการพัฒนาเมืองอัจฉริยะมุ่งเน้นการนำเทคโนโลยีดิจิทัลมาใช้ในการบริหารจัดการเมือง เพื่อยกระดับคุณภาพชีวิตประชาชน...',
    category: 'project',
    categoryLabel: 'โครงการ',
    date: '2568-03-10',
    views: 1250,
    image: '/images/news/smart-city.jpg',
    featured: true,
  },
  {
    id: 2,
    slug: 'health-checkup-campaign',
    title: 'รณรงค์ตรวจสุขภาพประจำปี 2568 ฟรี สำหรับประชาชนในพื้นที่',
    excerpt: 'เทศบาลร่วมกับโรงพยาบาลส่งเสริมสุขภาพตำบล จัดกิจกรรมตรวจสุขภาพฟรีให้แก่ประชาชนในเขตเทศบาล...',
    category: 'health',
    categoryLabel: 'สาธารณสุข',
    date: '2568-03-08',
    views: 890,
    image: '/images/news/health.jpg',
    featured: false,
  },
  {
    id: 3,
    slug: 'songkran-festival-2568',
    title: 'เตรียมจัดงานเทศกาลสงกรานต์ ประจำปี 2568 ยิ่งใหญ่กว่าทุกปี',
    excerpt: 'เทศบาลเตรียมจัดงานเทศกาลสงกรานต์อย่างยิ่งใหญ่ พร้อมกิจกรรมสืบสานวัฒนธรรมไทย รดน้ำดำหัวผู้สูงอายุ...',
    category: 'activity',
    categoryLabel: 'กิจกรรม',
    date: '2568-03-05',
    views: 2100,
    image: '/images/news/songkran.jpg',
    featured: true,
  },
  {
    id: 4,
    slug: 'road-construction-update',
    title: 'ความคืบหน้าโครงการก่อสร้างถนนสายหลัก เฟส 2',
    excerpt: 'โครงการก่อสร้างถนนสายหลักเฟส 2 คืบหน้าไปแล้วกว่า 65% คาดว่าจะแล้วเสร็จภายในเดือนมิถุนายน 2568...',
    category: 'project',
    categoryLabel: 'โครงการ',
    date: '2568-03-01',
    views: 750,
    image: '/images/news/road.jpg',
    featured: false,
  },
  {
    id: 5,
    slug: 'flood-prevention-preparation',
    title: 'เตรียมพร้อมรับมือน้ำท่วมช่วงฤดูฝน ปี 2568',
    excerpt: 'เทศบาลเตรียมแผนป้องกันและบรรเทาอุทกภัย พร้อมจัดเตรียมอุปกรณ์และกำลังพลไว้รองรับสถานการณ์...',
    category: 'emergency',
    categoryLabel: 'ข่าวด่วน',
    date: '2568-02-28',
    views: 1800,
    image: '/images/news/flood.jpg',
    featured: false,
  },
  {
    id: 6,
    slug: 'elderly-welfare-program',
    title: 'โครงการส่งเสริมสวัสดิการผู้สูงอายุ ประจำปี 2568',
    excerpt: 'เทศบาลจัดโครงการส่งเสริมสวัสดิการผู้สูงอายุ มอบเบี้ยยังชีพ พร้อมจัดกิจกรรมส่งเสริมสุขภาพ...',
    category: 'general',
    categoryLabel: 'ข่าวทั่วไป',
    date: '2568-02-25',
    views: 620,
    image: '/images/news/elderly.jpg',
    featured: false,
  },
  {
    id: 7,
    slug: 'waste-sorting-campaign',
    title: 'รณรงค์คัดแยกขยะที่ต้นทาง ลดปริมาณขยะในชุมชน',
    excerpt: 'เทศบาลเปิดตัวโครงการรณรงค์คัดแยกขยะที่ต้นทาง สร้างจิตสำนึกในการดูแลสิ่งแวดล้อม...',
    category: 'general',
    categoryLabel: 'ข่าวทั่วไป',
    date: '2568-02-20',
    views: 430,
    image: '/images/news/waste.jpg',
    featured: false,
  },
  {
    id: 8,
    slug: 'youth-sports-day',
    title: 'จัดการแข่งขันกีฬาเยาวชนต้านยาเสพติด ครั้งที่ 15',
    excerpt: 'เทศบาลจัดการแข่งขันกีฬาเยาวชนต้านยาเสพติด เพื่อส่งเสริมให้เยาวชนใช้เวลาว่างให้เกิดประโยชน์...',
    category: 'activity',
    categoryLabel: 'กิจกรรม',
    date: '2568-02-15',
    views: 980,
    image: '/images/news/sports.jpg',
    featured: false,
  },
  {
    id: 9,
    slug: 'digital-service-launch',
    title: 'เปิดให้บริการระบบจองคิวออนไลน์ ลดเวลารอคอย',
    excerpt: 'เทศบาลเปิดตัวระบบจองคิวออนไลน์ผ่านเว็บไซต์และแอปพลิเคชัน เพื่อลดเวลารอคอยของประชาชน...',
    category: 'general',
    categoryLabel: 'ข่าวทั่วไป',
    date: '2568-02-10',
    views: 1500,
    image: '/images/news/digital.jpg',
    featured: false,
  },
];

const popularNews = [
  { title: 'เตรียมจัดงานเทศกาลสงกรานต์ ประจำปี 2568', views: 2100, slug: 'songkran-festival-2568' },
  { title: 'เตรียมพร้อมรับมือน้ำท่วมช่วงฤดูฝน', views: 1800, slug: 'flood-prevention-preparation' },
  { title: 'เปิดให้บริการระบบจองคิวออนไลน์', views: 1500, slug: 'digital-service-launch' },
  { title: 'เปิดตัวโครงการพัฒนาเมืองอัจฉริยะ', views: 1250, slug: 'smart-city-development-2568' },
];

const ITEMS_PER_PAGE = 6;

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = newsItems
    .filter((n) => activeCategory === 'all' || n.category === activeCategory)
    .filter(
      (n) =>
        searchQuery === '' ||
        n.title.includes(searchQuery) ||
        n.excerpt.includes(searchQuery)
    );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      general: 'bg-gray-100 text-gray-700',
      activity: 'bg-green-100 text-green-700',
      project: 'bg-blue-100 text-blue-700',
      emergency: 'bg-red-100 text-red-700',
      health: 'bg-pink-100 text-pink-700',
    };
    return colors[cat] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ข่าวสารและกิจกรรม</h1>
          <p className="text-blue-100 text-lg">ติดตามข่าวสาร กิจกรรม และโครงการต่าง ๆ ของเทศบาล</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <span>ข่าวสาร</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search & Filters */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-8">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาข่าวสาร..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-500 mb-4">
              แสดง {paged.length} จาก {filtered.length} รายการ
            </p>

            {/* News Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {paged.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.slug}`}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
                    <Calendar className="w-12 h-12 text-blue-300" />
                    {news.featured && (
                      <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        แนะนำ
                      </span>
                    )}
                    <span
                      className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(
                        news.category
                      )}`}
                    >
                      {news.categoryLabel}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{news.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{news.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{news.views.toLocaleString()} ครั้ง</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {paged.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">ไม่พบข่าวสารที่ค้นหา</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            {/* Popular News */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                ข่าวยอดนิยม
              </h3>
              <div className="space-y-4">
                {popularNews.map((n, i) => (
                  <Link
                    key={i}
                    href={`/news/${n.slug}`}
                    className="flex gap-3 group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{n.views.toLocaleString()} ครั้ง</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent News */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                ข่าวล่าสุด
              </h3>
              <div className="space-y-4">
                {newsItems.slice(0, 5).map((n, i) => (
                  <Link
                    key={i}
                    href={`/news/${n.slug}`}
                    className="block group"
                  >
                    <p className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{n.date}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
