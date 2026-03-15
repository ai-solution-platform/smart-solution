'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Receipt,
  UserCheck,
  Building,
  Heart,
  Trash2,
  Droplets,
  MessageSquareWarning,
  Globe,
  Phone,
} from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const categories = [
  { key: 'ทั้งหมด', label: 'ทั้งหมด', icon: HelpCircle },
  { key: 'ภาษี', label: 'ภาษี', icon: Receipt },
  { key: 'ทะเบียนราษฎร', label: 'ทะเบียนราษฎร', icon: UserCheck },
  { key: 'ก่อสร้าง', label: 'ขออนุญาตก่อสร้าง', icon: Building },
  { key: 'สวัสดิการ', label: 'เบี้ยผู้สูงอายุ/สวัสดิการ', icon: Heart },
  { key: 'ขยะ', label: 'ขยะ', icon: Trash2 },
  { key: 'น้ำประปา', label: 'น้ำประปา', icon: Droplets },
  { key: 'ร้องเรียน', label: 'ร้องเรียน', icon: MessageSquareWarning },
  { key: 'ออนไลน์', label: 'บริการออนไลน์', icon: Globe },
  { key: 'ติดต่อ', label: 'ติดต่อ', icon: Phone },
];

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'ภาษีที่ดินและสิ่งปลูกสร้างต้องชำระเมื่อไหร่?',
    answer:
      'เทศบาลจะจัดส่งแบบแจ้งการประเมินภาษีให้ผู้เสียภาษีทราบภายในเดือนกุมภาพันธ์ของทุกปี และผู้เสียภาษีต้องชำระภาษีภายในเดือนเมษายนของทุกปี หากชำระล่าช้าจะมีเงินเพิ่มตามอัตราที่กฎหมายกำหนด สามารถชำระได้ที่กองคลัง เทศบาลตำบลสมาร์ทซิตี้ หรือผ่านช่องทางออนไลน์',
    category: 'ภาษี',
  },
  {
    id: 2,
    question: 'ภาษีป้ายต้องยื่นแบบเมื่อไหร่ และใช้เอกสารอะไรบ้าง?',
    answer:
      'ผู้ที่เป็นเจ้าของป้ายต้องยื่นแบบแสดงรายการภาษีป้าย (ภ.ป.1) ภายในเดือนมีนาคมของทุกปี เอกสารที่ต้องใช้ ได้แก่ สำเนาบัตรประชาชน สำเนาทะเบียนบ้าน รูปถ่ายป้าย และขนาดของป้าย หากเป็นนิติบุคคลต้องมีหนังสือรับรองการจดทะเบียนด้วย',
    category: 'ภาษี',
  },
  {
    id: 3,
    question: 'ต้องการแจ้งย้ายทะเบียนบ้านต้องทำอย่างไร?',
    answer:
      'การแจ้งย้ายทะเบียนบ้านสามารถทำได้ที่งานทะเบียนราษฎร สำนักปลัดเทศบาล เอกสารที่ต้องใช้ ได้แก่ บัตรประจำตัวประชาชนผู้แจ้ง สำเนาทะเบียนบ้านต้นทาง ใบแจ้งย้ายที่อยู่ (ท.ร.6) และทะเบียนบ้านปลายทาง ระยะเวลาดำเนินการประมาณ 15-30 นาที ค่าธรรมเนียม 20 บาท',
    category: 'ทะเบียนราษฎร',
  },
  {
    id: 4,
    question: 'การแจ้งเกิดต้องใช้เอกสารอะไรบ้าง และแจ้งภายในกี่วัน?',
    answer:
      'ต้องแจ้งเกิดภายใน 15 วัน นับแต่วันเกิด เอกสารที่ต้องใช้ ได้แก่ บัตรประชาชนของบิดาหรือมารดา สำเนาทะเบียนบ้าน หนังสือรับรองการเกิดจากโรงพยาบาล (ท.ร.1/1) และสำเนาทะเบียนสมรส (ถ้ามี) ไม่มีค่าธรรมเนียม',
    category: 'ทะเบียนราษฎร',
  },
  {
    id: 5,
    question: 'ขออนุญาตก่อสร้างอาคารต้องใช้เอกสารอะไรบ้าง?',
    answer:
      'เอกสารที่ต้องใช้ ได้แก่ คำขออนุญาตก่อสร้าง (แบบ ข.1) แบบแปลนก่อสร้าง 5 ชุด สำเนาบัตรประชาชนและทะเบียนบ้านของผู้ขอ สำเนาโฉนดที่ดิน หนังสือยินยอมจากเจ้าของที่ดิน (กรณีที่ดินผู้อื่น) ระยะเวลาพิจารณาอนุญาตไม่เกิน 45 วัน',
    category: 'ก่อสร้าง',
  },
  {
    id: 6,
    question: 'ต้องการลงทะเบียนรับเบี้ยยังชีพผู้สูงอายุต้องทำอย่างไร?',
    answer:
      'ผู้สูงอายุที่มีอายุครบ 60 ปีบริบูรณ์ขึ้นไป มีภูมิลำเนาในเขตเทศบาล สามารถลงทะเบียนได้ที่กองสวัสดิการสังคม ในเดือนตุลาคม - พฤศจิกายนของทุกปี เอกสารที่ต้องใช้ ได้แก่ บัตรประชาชน สำเนาทะเบียนบ้าน และสมุดบัญชีธนาคาร อัตราเบี้ยยังชีพตามขั้นบันได: 60-69 ปี ได้รับ 600 บาท/เดือน, 70-79 ปี ได้รับ 700 บาท/เดือน, 80-89 ปี ได้รับ 800 บาท/เดือน, 90 ปีขึ้นไป ได้รับ 1,000 บาท/เดือน',
    category: 'สวัสดิการ',
  },
  {
    id: 7,
    question: 'ตารางเวลาเก็บขยะในแต่ละชุมชนเป็นอย่างไร?',
    answer:
      'เทศบาลจัดเก็บขยะมูลฝอยทุกวัน (จันทร์-เสาร์) โดยแบ่งพื้นที่จัดเก็บตามโซน ชุมชนที่ 1-4 เก็บช่วงเช้า 06:00-10:00 น. ชุมชนที่ 5-8 เก็บช่วงเช้า 08:00-12:00 น. ชุมชนที่ 9-12 เก็บช่วงบ่าย 13:00-17:00 น. กรุณาวางถังขยะหน้าบ้านก่อนเวลาเก็บ หากมีปัญหาการจัดเก็บ โทร. 02-XXX-XXXX ต่อ 401',
    category: 'ขยะ',
  },
  {
    id: 8,
    question: 'น้ำประปาไม่ไหลหรือน้ำขุ่นต้องแจ้งที่ไหน?',
    answer:
      'สามารถแจ้งได้ที่กองช่าง โทร. 02-XXX-XXXX ต่อ 301-303 ในวันและเวลาทำการ หรือแจ้งผ่านระบบร้องเรียนออนไลน์ได้ตลอด 24 ชั่วโมง ที่หน้าเว็บไซต์เทศบาล กรณีเร่งด่วนนอกเวลาทำการ โทร.สายด่วน 199 เจ้าหน้าที่จะเข้าตรวจสอบและแก้ไขภายใน 24-48 ชั่วโมง',
    category: 'น้ำประปา',
  },
  {
    id: 9,
    question: 'ต้องการร้องเรียนเรื่องเดือดร้อนรำคาญทำอย่างไร?',
    answer:
      'สามารถร้องเรียนได้หลายช่องทาง ได้แก่ 1) มาร้องเรียนด้วยตนเองที่สำนักปลัดเทศบาล 2) โทรศัพท์ 02-XXX-XXXX ต่อ 101 3) เว็บไซต์เทศบาล หน้าร้องเรียนออนไลน์ 4) LINE Official: @smartcity 5) Facebook: เทศบาลตำบลสมาร์ทซิตี้ ทุกเรื่องร้องเรียนจะได้รับการตอบกลับภายใน 3 วันทำการ',
    category: 'ร้องเรียน',
  },
  {
    id: 10,
    question: 'บริการออนไลน์ของเทศบาลมีอะไรบ้าง?',
    answer:
      'เทศบาลเปิดให้บริการออนไลน์ผ่านเว็บไซต์ ได้แก่ ชำระภาษีออนไลน์ ยื่นคำร้องขออนุญาตก่อสร้าง ลงทะเบียนสวัสดิการ ร้องเรียน/ร้องทุกข์ออนไลน์ ดาวน์โหลดแบบฟอร์มต่าง ๆ ตรวจสอบสถานะคำร้อง และจองคิวนัดหมายล่วงหน้า สามารถใช้บริการได้ตลอด 24 ชั่วโมง โดยลงทะเบียนสมัครสมาชิกก่อนใช้งาน',
    category: 'ออนไลน์',
  },
  {
    id: 11,
    question: 'ช่องทางการติดต่อเทศบาลมีอะไรบ้าง?',
    answer:
      'สามารถติดต่อเทศบาลได้หลายช่องทาง ได้แก่ มาติดต่อด้วยตนเอง ณ สำนักงานเทศบาลตำบลสมาร์ทซิตี้ เลขที่ 999 ถนนเทศบาล 1 ในวันจันทร์-ศุกร์ เวลา 08:30-16:30 น. โทรศัพท์ 02-XXX-XXXX อีเมล info@smartcity.go.th LINE Official: @smartcity Facebook: เทศบาลตำบลสมาร์ทซิตี้ หรือผ่านแบบฟอร์มติดต่อบนเว็บไซต์',
    category: 'ติดต่อ',
  },
  {
    id: 12,
    question: 'ขอรับเงินสงเคราะห์ผู้พิการต้องใช้เอกสารอะไรบ้าง?',
    answer:
      'เอกสารที่ต้องใช้ ได้แก่ บัตรประจำตัวคนพิการ บัตรประชาชน สำเนาทะเบียนบ้าน สมุดบัญชีธนาคาร กรณีมอบอำนาจต้องมีหนังสือมอบอำนาจและบัตรประชาชนผู้รับมอบ ลงทะเบียนได้ที่กองสวัสดิการสังคม ตลอดทั้งปี ได้รับเงินเดือนละ 800 บาท',
    category: 'สวัสดิการ',
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqData.filter((faq) => {
    const matchCategory =
      selectedCategory === 'ทั้งหมด' || faq.category === selectedCategory;
    const matchSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">คำถามที่พบบ่อย</h1>
          <p className="text-blue-100 text-lg">
            รวมคำถามและคำตอบที่ประชาชนสอบถามบ่อย เกี่ยวกับบริการของเทศบาลตำบลสมาร์ทซิตี้
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">
              หน้าแรก
            </Link>
            <span>/</span>
            <span>คำถามที่พบบ่อย</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาคำถาม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1e3a5f] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                ไม่พบคำถามที่ตรงกับการค้นหา
              </h3>
              <p className="text-gray-400">
                ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-start justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-[#e8a838]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <HelpCircle className="w-4 h-4 text-[#e8a838]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                        <span className="inline-block mt-1 text-xs bg-blue-50 text-[#2c5f8a] px-2 py-0.5 rounded-full">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <p className="mt-4 text-gray-600 leading-relaxed pl-11">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Results count */}
        {filteredFAQs.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-8">
            แสดง {filteredFAQs.length} คำถาม
            {selectedCategory !== 'ทั้งหมด' && ` ในหมวด "${selectedCategory}"`}
          </p>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-br from-[#1e3a5f] to-[#2c5f8a] rounded-2xl p-8 md:p-12 text-center text-white">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-3">ยังไม่พบคำตอบที่ต้องการ?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            หากมีคำถามเพิ่มเติม สามารถติดต่อสอบถามได้โดยตรง
            เจ้าหน้าที่ยินดีให้บริการ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#1e3a5f] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              ติดต่อเรา
            </Link>
            <Link
              href="/complaints"
              className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              ร้องเรียน/ร้องทุกข์
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
