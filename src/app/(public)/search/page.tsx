'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  FileText,
  Megaphone,
  Newspaper,
  FolderOpen,
  Globe,
  Clock,
  ChevronRight,
} from 'lucide-react';

type ResultCategory = 'all' | 'news' | 'announcements' | 'documents' | 'pages';

const categoryTabs: { id: ResultCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'ทั้งหมด', icon: <Globe className="w-4 h-4" /> },
  { id: 'news', label: 'ข่าวสาร', icon: <Newspaper className="w-4 h-4" /> },
  { id: 'announcements', label: 'ประกาศ', icon: <Megaphone className="w-4 h-4" /> },
  { id: 'documents', label: 'เอกสาร', icon: <FolderOpen className="w-4 h-4" /> },
  { id: 'pages', label: 'หน้าเว็บ', icon: <FileText className="w-4 h-4" /> },
];

interface SearchResult {
  id: number;
  title: string;
  excerpt: string;
  category: 'news' | 'announcements' | 'documents' | 'pages';
  categoryLabel: string;
  url: string;
  date: string;
}

const allResults: SearchResult[] = [
  {
    id: 1,
    title: 'เทศบาลตำบลสมาร์ทซิตี้ เปิดตัวโครงการพัฒนาเมืองอัจฉริยะ ประจำปี 2568',
    excerpt: 'โครงการพัฒนาเมืองอัจฉริยะมุ่งเน้นการนำเทคโนโลยีดิจิทัลมาใช้ในการบริหารจัดการเมือง เพื่อยกระดับคุณภาพชีวิตประชาชน...',
    category: 'news',
    categoryLabel: 'ข่าวสาร',
    url: '/news/smart-city-development-2568',
    date: '2568-03-10',
  },
  {
    id: 2,
    title: 'ประกาศเทศบาลตำบลสมาร์ทซิตี้ เรื่อง การชำระภาษีที่ดินและสิ่งปลูกสร้าง ประจำปี 2568',
    excerpt: 'ด้วยเทศบาลตำบลสมาร์ทซิตี้ จะดำเนินการจัดเก็บภาษีที่ดินและสิ่งปลูกสร้าง ประจำปี พ.ศ. 2568...',
    category: 'announcements',
    categoryLabel: 'ประกาศ',
    url: '/announcements/tax-payment-2568',
    date: '2568-03-15',
  },
  {
    id: 3,
    title: 'แบบฟอร์มคำร้องทั่วไป',
    excerpt: 'แบบฟอร์มสำหรับยื่นคำร้องทั่วไปต่อเทศบาลตำบลสมาร์ทซิตี้ ดาวน์โหลดได้ทันที...',
    category: 'documents',
    categoryLabel: 'เอกสาร',
    url: '/downloads',
    date: '2568-01-15',
  },
  {
    id: 4,
    title: 'เตรียมจัดงานเทศกาลสงกรานต์ ประจำปี 2568 ยิ่งใหญ่กว่าทุกปี',
    excerpt: 'เทศบาลเตรียมจัดงานเทศกาลสงกรานต์อย่างยิ่งใหญ่ พร้อมกิจกรรมสืบสานวัฒนธรรมไทย...',
    category: 'news',
    categoryLabel: 'ข่าวสาร',
    url: '/news/songkran-festival-2568',
    date: '2568-03-05',
  },
  {
    id: 5,
    title: 'ประวัติความเป็นมา เทศบาลตำบลสมาร์ทซิตี้',
    excerpt: 'เทศบาลตำบลสมาร์ทซิตี้ เดิมมีฐานะเป็นสุขาภิบาล จัดตั้งขึ้นตามประกาศกระทรวงมหาดไทย...',
    category: 'pages',
    categoryLabel: 'หน้าเว็บ',
    url: '/about',
    date: '2568-01-01',
  },
  {
    id: 6,
    title: 'ประกาศรับสมัครสอบคัดเลือกพนักงานเทศบาล ตำแหน่ง วิศวกรโยธา',
    excerpt: 'เทศบาลตำบลสมาร์ทซิตี้ ประกาศรับสมัครสอบคัดเลือกพนักงาน ตำแหน่ง วิศวกรโยธา จำนวน 2 อัตรา...',
    category: 'announcements',
    categoryLabel: 'ประกาศ',
    url: '/announcements/recruitment-engineer-2568',
    date: '2568-03-12',
  },
  {
    id: 7,
    title: 'คู่มือประชาชน: การขอใบอนุญาตประกอบกิจการ',
    excerpt: 'คู่มือขั้นตอนการขอใบอนุญาตประกอบกิจการต่าง ๆ ในเขตเทศบาลตำบลสมาร์ทซิตี้...',
    category: 'documents',
    categoryLabel: 'เอกสาร',
    url: '/downloads',
    date: '2567-06-01',
  },
  {
    id: 8,
    title: 'เปิดให้บริการระบบจองคิวออนไลน์ ลดเวลารอคอย',
    excerpt: 'เทศบาลเปิดตัวระบบจองคิวออนไลน์ผ่านเว็บไซต์และแอปพลิเคชัน เพื่อลดเวลารอคอยของประชาชน...',
    category: 'news',
    categoryLabel: 'ข่าวสาร',
    url: '/news/digital-service-launch',
    date: '2568-02-10',
  },
  {
    id: 9,
    title: 'ติดต่อเทศบาลตำบลสมาร์ทซิตี้',
    excerpt: 'ช่องทางการติดต่อเทศบาล ที่อยู่ เบอร์โทรศัพท์ อีเมล เวลาทำการ และแผนที่...',
    category: 'pages',
    categoryLabel: 'หน้าเว็บ',
    url: '/contact',
    date: '2568-01-01',
  },
  {
    id: 10,
    title: 'แผนพัฒนาท้องถิ่น (พ.ศ. 2566-2570)',
    excerpt: 'แผนพัฒนาท้องถิ่น 5 ปี ของเทศบาลตำบลสมาร์ทซิตี้ ฉบับแก้ไขเพิ่มเติม...',
    category: 'documents',
    categoryLabel: 'เอกสาร',
    url: '/downloads',
    date: '2567-10-01',
  },
];

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResultCategory>('all');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setHasSearched(true);
    }
  };

  const results = hasSearched
    ? allResults
        .filter((r) => activeCategory === 'all' || r.category === activeCategory)
        .filter(
          (r) =>
            query === '' ||
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.excerpt.toLowerCase().includes(query.toLowerCase())
        )
    : [];

  const getCounts = () => {
    if (!hasSearched) return { all: 0, news: 0, announcements: 0, documents: 0, pages: 0 };
    const base = allResults.filter(
      (r) =>
        query === '' ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.excerpt.toLowerCase().includes(query.toLowerCase())
    );
    return {
      all: base.length,
      news: base.filter((r) => r.category === 'news').length,
      announcements: base.filter((r) => r.category === 'announcements').length,
      documents: base.filter((r) => r.category === 'documents').length,
      pages: base.filter((r) => r.category === 'pages').length,
    };
  };

  const counts = getCounts();

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, React.ReactNode> = {
      news: <Newspaper className="w-4 h-4 text-blue-500" />,
      announcements: <Megaphone className="w-4 h-4 text-orange-500" />,
      documents: <FolderOpen className="w-4 h-4 text-green-500" />,
      pages: <FileText className="w-4 h-4 text-purple-500" />,
    };
    return icons[cat] || <Globe className="w-4 h-4 text-gray-500" />;
  };

  const getCategoryBadgeColor = (cat: string) => {
    const colors: Record<string, string> = {
      news: 'bg-blue-100 text-blue-700',
      announcements: 'bg-orange-100 text-orange-700',
      documents: 'bg-green-100 text-green-700',
      pages: 'bg-purple-100 text-purple-700',
    };
    return colors[cat] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">ค้นหาข้อมูล</h1>
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) setHasSearched(false);
              }}
              className="w-full pl-12 pr-32 py-4 rounded-xl text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
              placeholder="ค้นหาข่าวสาร ประกาศ เอกสาร..."
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2.5 min-h-[44px] rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              ค้นหา
            </button>
          </form>
          <div className="flex items-center gap-2 mt-6 text-sm text-blue-200 justify-center">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <span>ค้นหา</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {hasSearched ? (
          <>
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeCategory === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {counts[tab.id]}
                  </span>
                </button>
              ))}
            </div>

            {/* Results */}
            <p className="text-sm text-gray-500 mb-6">
              พบ {results.length} ผลลัพธ์สำหรับ &ldquo;{query}&rdquo;
            </p>

            <div className="space-y-4">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  className="block bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-5 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 shrink-0">{getCategoryIcon(result.category)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${getCategoryBadgeColor(
                            result.category
                          )}`}
                        >
                          {result.categoryLabel}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.date}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                        {highlightText(result.title, query)}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {highlightText(result.excerpt, query)}
                      </p>
                      <span className="text-xs text-blue-500 mt-2 inline-flex items-center gap-1 group-hover:underline">
                        อ่านเพิ่มเติม <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {results.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">ไม่พบผลลัพธ์</h3>
                <p className="text-gray-500 text-sm">
                  ลองค้นหาด้วยคำค้นอื่น หรือเลือกหมวดหมู่ที่แตกต่าง
                </p>
              </div>
            )}
          </>
        ) : (
          /* Initial State */
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">ค้นหาข้อมูลที่คุณต้องการ</h2>
            <p className="text-gray-500 mb-8">
              พิมพ์คำค้นหาด้านบนเพื่อค้นหาข่าวสาร ประกาศ เอกสาร และข้อมูลต่าง ๆ
            </p>

            {/* Popular Searches */}
            <div className="max-w-md mx-auto">
              <p className="text-sm text-gray-500 mb-3">คำค้นหายอดนิยม</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'ภาษีที่ดิน',
                  'สมัครงาน',
                  'แบบฟอร์ม',
                  'ใบอนุญาตก่อสร้าง',
                  'เบี้ยผู้สูงอายุ',
                  'คัดแยกขยะ',
                  'Smart City',
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      setHasSearched(true);
                    }}
                    className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
