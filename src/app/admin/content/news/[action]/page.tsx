'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  Eye,
  Upload,
  ArrowLeft,
  ImageIcon,
  X,
  Calendar,
} from 'lucide-react';

export default function NewsFormPage() {
  const params = useParams();
  const router = useRouter();
  const isEdit = params.action !== 'create';

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    tags: '',
    content: '',
    featuredImage: null as string | null,
    metaTitle: '',
    metaDescription: '',
    publishOption: 'draft' as 'draft' | 'published' | 'scheduled',
    scheduledDate: '',
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit) {
      const slug = form.title
        .toLowerCase()
        .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setForm((prev) => ({ ...prev, slug }));
    }
  }, [form.title, isEdit]);

  // Load demo data for edit mode
  useEffect(() => {
    if (isEdit) {
      setForm({
        title: 'โครงการพัฒนาชุมชนปี 2569',
        slug: 'โครงการพัฒนาชุมชนปี-2569',
        category: 'โครงการ',
        tags: 'พัฒนาชุมชน, โครงการ',
        content:
          'เนื้อหาข่าวโครงการพัฒนาชุมชนปี 2569 องค์การบริหารส่วนตำบลได้ดำเนินโครงการพัฒนาชุมชนเพื่อยกระดับคุณภาพชีวิตของประชาชนในพื้นที่ โดยมีกิจกรรมหลัก ได้แก่ การปรับปรุงถนน การพัฒนาแหล่งน้ำ และการส่งเสริมอาชีพ',
        featuredImage: null,
        metaTitle: 'โครงการพัฒนาชุมชนปี 2569 | อบต.ตัวอย่าง',
        metaDescription: 'องค์การบริหารส่วนตำบลดำเนินโครงการพัฒนาชุมชนเพื่อยกระดับคุณภาพชีวิตของประชาชน',
        publishOption: 'published',
        scheduledDate: '',
      });
    }
  }, [isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${isEdit ? 'อัปเดต' : 'สร้าง'}ข่าวสำเร็จ!`);
    router.push('/admin/content/news');
  };

  const updateField = (key: string, value: string | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content/news"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEdit ? 'แก้ไขรายละเอียดข่าวสาร' : 'กรอกข้อมูลเพื่อสร้างข่าวสารใหม่'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            ดูตัวอย่าง
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  หัวข้อข่าว <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="กรอกหัวข้อข่าว"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  placeholder="auto-generated-slug"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-500 font-mono"
                />
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                เนื้อหา <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center gap-1 flex-wrap">
                  {['B', 'I', 'U', 'H1', 'H2', 'H3', 'UL', 'OL', 'Link', 'Img', 'Table'].map(
                    (btn) => (
                      <button
                        key={btn}
                        type="button"
                        className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-white hover:text-gray-700 rounded transition-colors"
                      >
                        {btn}
                      </button>
                    )
                  )}
                </div>
                <textarea
                  value={form.content}
                  onChange={(e) => updateField('content', e.target.value)}
                  placeholder="เขียนเนื้อหาข่าวที่นี่..."
                  rows={15}
                  className="w-full px-4 py-3 focus:outline-none resize-y text-sm"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">* พื้นที่นี้จะเป็น Rich Text Editor ในเวอร์ชันถัดไป</p>
            </div>

            {/* SEO Fields */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-base font-semibold text-gray-900">ตั้งค่า SEO</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => updateField('metaTitle', e.target.value)}
                  placeholder="ชื่อที่แสดงบนผลการค้นหา"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  maxLength={60}
                />
                <p className="text-xs text-gray-400 mt-1">{form.metaTitle.length}/60 ตัวอักษร</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Meta Description
                </label>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => updateField('metaDescription', e.target.value)}
                  placeholder="คำอธิบายที่แสดงบนผลการค้นหา"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  maxLength={160}
                />
                <p className="text-xs text-gray-400 mt-1">{form.metaDescription.length}/160 ตัวอักษร</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-base font-semibold text-gray-900">การเผยแพร่</h3>
              <div className="space-y-2">
                {[
                  { value: 'draft', label: 'แบบร่าง' },
                  { value: 'published', label: 'เผยแพร่ทันที' },
                  { value: 'scheduled', label: 'ตั้งเวลาเผยแพร่' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="publishOption"
                      value={opt.value}
                      checked={form.publishOption === opt.value}
                      onChange={(e) => updateField('publishOption', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
              {form.publishOption === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    วันเวลาที่เผยแพร่
                  </label>
                  <input
                    type="datetime-local"
                    value={form.scheduledDate}
                    onChange={(e) => updateField('scheduledDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isEdit ? 'บันทึกการแก้ไข' : 'บันทึก'}
              </button>
            </div>

            {/* Category & Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  หมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">เลือกหมวดหมู่</option>
                  <option value="ข่าวสาร">ข่าวสาร</option>
                  <option value="กิจกรรม">กิจกรรม</option>
                  <option value="โครงการ">โครงการ</option>
                  <option value="ประกาศ">ประกาศ</option>
                  <option value="รายงาน">รายงาน</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  แท็ก
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => updateField('tags', e.target.value)}
                  placeholder="คั่นด้วยเครื่องหมายจุลภาค"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-base font-semibold text-gray-900">ภาพปก</h3>
              {form.featuredImage ? (
                <div className="relative">
                  <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('featuredImage', null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => updateField('featuredImage', 'placeholder')}
                  className="w-full aspect-video border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">คลิกเพื่ออัปโหลด</p>
                  <p className="text-xs text-gray-300 mt-0.5">PNG, JPG สูงสุด 5MB</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
