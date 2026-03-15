'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Download,
  FileText,
  File,
  Filter,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Lock,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useCitizenAuth } from '@/hooks/useCitizenAuth';
import AuthPrompt from '@/components/shared/AuthPrompt';

const categories = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'form', label: 'แบบฟอร์ม/คำร้อง' },
  { id: 'regulation', label: 'ข้อบัญญัติ/ระเบียบ' },
  { id: 'plan', label: 'แผนพัฒนา' },
  { id: 'report', label: 'รายงาน' },
  { id: 'manual', label: 'คู่มือ' },
  { id: 'budget', label: 'งบประมาณ' },
];

interface Document {
  id: number;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  fileType: string;
  fileSize: string;
  downloads: number;
  date: string;
  requiresAuth?: boolean;
}

const documents: Document[] = [
  {
    id: 1,
    title: 'แบบฟอร์มคำร้องทั่วไป',
    description: 'แบบฟอร์มสำหรับยื่นคำร้องทั่วไปต่อเทศบาล',
    category: 'form',
    categoryLabel: 'แบบฟอร์ม/คำร้อง',
    fileType: 'pdf',
    fileSize: '125 KB',
    downloads: 2450,
    date: '2568-01-15',
  },
  {
    id: 2,
    title: 'แบบฟอร์มขออนุญาตก่อสร้างอาคาร (แบบ ข.1)',
    description: 'แบบฟอร์มคำขออนุญาตก่อสร้างอาคาร ดัดแปลงอาคาร หรือรื้อถอนอาคาร',
    category: 'form',
    categoryLabel: 'แบบฟอร์ม/คำร้อง',
    fileType: 'pdf',
    fileSize: '340 KB',
    downloads: 1890,
    date: '2568-01-15',
  },
  {
    id: 3,
    title: 'แบบฟอร์มลงทะเบียนผู้สูงอายุ',
    description: 'แบบฟอร์มลงทะเบียนเพื่อรับเบี้ยยังชีพผู้สูงอายุ',
    category: 'form',
    categoryLabel: 'แบบฟอร์ม/คำร้อง',
    fileType: 'pdf',
    fileSize: '180 KB',
    downloads: 3200,
    date: '2568-01-10',
  },
  {
    id: 4,
    title: 'ข้อบัญญัติเทศบาล เรื่อง งบประมาณรายจ่าย ประจำปี พ.ศ. 2568',
    description: 'ข้อบัญญัติงบประมาณรายจ่ายประจำปี 2568 ของเทศบาลตำบลสมาร์ทซิตี้',
    category: 'budget',
    categoryLabel: 'งบประมาณ',
    fileType: 'pdf',
    fileSize: '8.5 MB',
    downloads: 920,
    date: '2567-09-30',
  },
  {
    id: 5,
    title: 'แผนพัฒนาท้องถิ่น (พ.ศ. 2566-2570) แก้ไขเพิ่มเติม ครั้งที่ 3',
    description: 'แผนพัฒนาท้องถิ่น 5 ปี ฉบับแก้ไขเพิ่มเติม',
    category: 'plan',
    categoryLabel: 'แผนพัฒนา',
    fileType: 'pdf',
    fileSize: '15.2 MB',
    downloads: 680,
    date: '2567-10-01',
  },
  {
    id: 6,
    title: 'แผนดำเนินงาน ประจำปีงบประมาณ พ.ศ. 2568',
    description: 'แผนดำเนินงานประจำปีงบประมาณ 2568',
    category: 'plan',
    categoryLabel: 'แผนพัฒนา',
    fileType: 'pdf',
    fileSize: '5.8 MB',
    downloads: 520,
    date: '2567-10-15',
  },
  {
    id: 7,
    title: 'รายงานผลการดำเนินงาน ประจำปี พ.ศ. 2567',
    description: 'รายงานสรุปผลการดำเนินงานของเทศบาลตำบลสมาร์ทซิตี้ ประจำปี 2567',
    category: 'report',
    categoryLabel: 'รายงาน',
    fileType: 'pdf',
    fileSize: '12.3 MB',
    downloads: 450,
    date: '2568-01-31',
    requiresAuth: true,
  },
  {
    id: 8,
    title: 'รายงานการเงินประจำปี พ.ศ. 2567',
    description: 'รายงานการเงินและงบแสดงฐานะการเงิน ประจำปี 2567',
    category: 'report',
    categoryLabel: 'รายงาน',
    fileType: 'xlsx',
    fileSize: '2.1 MB',
    downloads: 380,
    date: '2568-02-15',
    requiresAuth: true,
  },
  {
    id: 9,
    title: 'คู่มือประชาชน: การขอใบอนุญาตประกอบกิจการ',
    description: 'คู่มือขั้นตอนการขอใบอนุญาตประกอบกิจการต่าง ๆ ในเขตเทศบาล',
    category: 'manual',
    categoryLabel: 'คู่มือ',
    fileType: 'pdf',
    fileSize: '3.4 MB',
    downloads: 1200,
    date: '2567-06-01',
  },
  {
    id: 10,
    title: 'คู่มือการชำระภาษีออนไลน์',
    description: 'คู่มือวิธีการชำระภาษีที่ดินและสิ่งปลูกสร้างผ่านระบบออนไลน์',
    category: 'manual',
    categoryLabel: 'คู่มือ',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    downloads: 1560,
    date: '2568-02-01',
  },
  {
    id: 11,
    title: 'ข้อบัญญัติเทศบาล เรื่อง การจัดการมูลฝอยทั่วไป พ.ศ. 2567',
    description: 'ข้อบัญญัติว่าด้วยการจัดการขยะมูลฝอยในเขตเทศบาล',
    category: 'regulation',
    categoryLabel: 'ข้อบัญญัติ/ระเบียบ',
    fileType: 'pdf',
    fileSize: '980 KB',
    downloads: 320,
    date: '2567-08-01',
  },
  {
    id: 12,
    title: 'แบบฟอร์มแจ้งเรื่องร้องเรียน',
    description: 'แบบฟอร์มสำหรับแจ้งเรื่องร้องเรียน ร้องทุกข์',
    category: 'form',
    categoryLabel: 'แบบฟอร์ม/คำร้อง',
    fileType: 'doc',
    fileSize: '95 KB',
    downloads: 870,
    date: '2568-01-05',
  },
];

const ITEMS_PER_PAGE = 10;

const getFileTypeStyle = (type: string) => {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    pdf: { bg: 'bg-red-100', text: 'text-red-600', label: 'PDF' },
    doc: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'DOC' },
    docx: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'DOCX' },
    xls: { bg: 'bg-green-100', text: 'text-green-600', label: 'XLS' },
    xlsx: { bg: 'bg-green-100', text: 'text-green-600', label: 'XLSX' },
  };
  return styles[type] || { bg: 'bg-gray-100', text: 'text-gray-600', label: type.toUpperCase() };
};

interface DownloadHistoryItem {
  documentId: number;
  title: string;
  downloadedAt: string;
}

export default function DownloadsPage() {
  const { isLoggedIn, citizen, token } = useCitizenAuth();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadCounts, setDownloadCounts] = useState<Record<number, number>>(() => {
    const counts: Record<number, number> = {};
    documents.forEach((d) => {
      counts[d.id] = d.downloads;
    });
    return counts;
  });
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([]);
  const [showAuthPromptFor, setShowAuthPromptFor] = useState<number | null>(null);

  // Load download history when logged in
  useEffect(() => {
    if (isLoggedIn && token) {
      fetch('/api/downloads/history', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => setDownloadHistory(data.history || []))
        .catch(() => setDownloadHistory([]));
    }
  }, [isLoggedIn, token]);

  const handleDownload = async (doc: Document) => {
    // If document requires auth and user is not logged in, show prompt
    if (doc.requiresAuth && !isLoggedIn) {
      setShowAuthPromptFor(doc.id);
      return;
    }

    // Increment local counter
    setDownloadCounts((prev) => ({
      ...prev,
      [doc.id]: (prev[doc.id] || 0) + 1,
    }));

    // Log download activity if logged in
    if (isLoggedIn && token) {
      fetch('/api/downloads/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId: doc.id,
          title: doc.title,
        }),
      }).catch(() => {
        // silently fail
      });

      // Add to local history
      setDownloadHistory((prev) => [
        {
          documentId: doc.id,
          title: doc.title,
          downloadedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    // Trigger download (placeholder - in production, this would be a real file URL)
    const link = document.createElement('a');
    link.href = `/api/downloads/file/${doc.id}`;
    link.download = `${doc.title}.${doc.fileType}`;
    link.click();
  };

  const filtered = documents
    .filter((d) => activeCategory === 'all' || d.category === activeCategory)
    .filter(
      (d) =>
        searchQuery === '' ||
        d.title.includes(searchQuery) ||
        d.description.includes(searchQuery)
    );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
            <FolderOpen className="w-9 h-9" />
            ศูนย์ดาวน์โหลดเอกสาร
          </h1>
          <p className="text-blue-100 text-lg">ดาวน์โหลดแบบฟอร์ม เอกสาร คู่มือ และรายงานต่าง ๆ</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <a href="/" className="hover:text-white">
              หน้าแรก
            </a>
            <span>/</span>
            <span>ดาวน์โหลด</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Download History (logged in) */}
        {isLoggedIn && downloadHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-5 mb-8">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              เอกสารที่ดาวน์โหลดล่าสุด
            </h3>
            <div className="flex flex-wrap gap-2">
              {downloadHistory.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{item.title}</span>
                  <span className="text-xs text-blue-400">
                    {new Date(item.downloadedAt).toLocaleDateString('th-TH')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-5 mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาเอกสาร..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Filter className="w-5 h-5 text-gray-400 mt-1" />
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

        <p className="text-sm text-gray-500 mb-4">
          แสดง {paged.length} จาก {filtered.length} รายการ
        </p>

        {/* Document List */}
        <div className="space-y-3 mb-8">
          {paged.map((doc) => {
            const fileStyle = getFileTypeStyle(doc.fileType);
            const isRestricted = doc.requiresAuth && !isLoggedIn;

            return (
              <div key={doc.id}>
                <div
                  className={`bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 p-5 ${
                    isRestricted ? 'opacity-90' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* File Type Icon */}
                    <div
                      className={`w-14 h-14 rounded-lg ${fileStyle.bg} flex flex-col items-center justify-center shrink-0 relative hidden sm:flex`}
                    >
                      <FileText className={`w-6 h-6 ${fileStyle.text}`} />
                      <span className={`text-[10px] font-bold mt-0.5 ${fileStyle.text}`}>
                        {fileStyle.label}
                      </span>
                      {doc.requiresAuth && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {/* Mobile file type badge */}
                            <span className={`sm:hidden inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${fileStyle.bg} ${fileStyle.text}`}>
                              {fileStyle.label}
                            </span>
                            {doc.requiresAuth && (
                              <span className="text-amber-600 bg-amber-50 rounded-full px-2 py-0.5 text-xs sm:hidden">
                                ต้องเข้าสู่ระบบ
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {doc.title}
                            {doc.requiresAuth && (
                              <span className="ml-2 text-amber-600 bg-amber-50 rounded-full px-3 py-1 text-sm hidden sm:inline">
                                ต้องเข้าสู่ระบบ
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">{doc.description}</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400">
                            <span className="bg-gray-100 text-gray-600 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm">
                              {doc.categoryLabel}
                            </span>
                            <span>ขนาด: {doc.fileSize}</span>
                            <span className="hidden sm:inline">อัพเดท: {doc.date}</span>
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {(downloadCounts[doc.id] || doc.downloads).toLocaleString()} ครั้ง
                            </span>
                          </div>
                        </div>

                        {isRestricted ? (
                          <button
                            onClick={() =>
                              setShowAuthPromptFor(
                                showAuthPromptFor === doc.id ? null : doc.id
                              )
                            }
                            className="flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2.5 min-h-[44px] rounded-lg text-sm hover:bg-amber-600 transition-colors shrink-0 w-full sm:w-auto"
                          >
                            <Lock className="w-4 h-4" />
                            <span>เข้าสู่ระบบเพื่อดาวน์โหลด</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDownload(doc)}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 min-h-[44px] rounded-lg text-sm hover:bg-blue-700 transition-colors shrink-0 w-full sm:w-auto"
                          >
                            <Download className="w-4 h-4" />
                            <span>ดาวน์โหลด</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auth prompt for restricted docs */}
                {showAuthPromptFor === doc.id && (
                  <div className="mt-2">
                    <AuthPrompt
                      message="เข้าสู่ระบบเพื่อดาวน์โหลดเอกสารนี้"
                      returnUrl="/downloads"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {paged.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <File className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">ไม่พบเอกสารที่ค้นหา</p>
          </div>
        )}

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
      </div>
    </div>
  );
}
