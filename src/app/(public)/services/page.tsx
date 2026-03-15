'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Receipt,
  HardHat,
  HeartPulse,
  GraduationCap,
  HandHeart,
  MessageSquareWarning,
  Globe,
  Clock,
  FileText,
  ChevronRight,
  Search,
  Briefcase,
} from 'lucide-react';

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  link: string;
  hours: string;
  documents: string[];
  department: string;
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'registration',
    title: 'งานทะเบียนราษฎร',
    description:
      'บริการด้านทะเบียนราษฎร ได้แก่ แจ้งเกิด แจ้งตาย แจ้งย้ายที่อยู่ แก้ไขรายการทะเบียนราษฎร และคัดสำเนาทะเบียนบ้าน',
    icon: UserCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    link: '/e-service',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    documents: [
      'บัตรประจำตัวประชาชน',
      'สำเนาทะเบียนบ้าน',
      'หลักฐานอื่นที่เกี่ยวข้อง',
    ],
    department: 'สำนักปลัดเทศบาล',
  },
  {
    id: 'tax',
    title: 'งานภาษี',
    description:
      'บริการด้านภาษีท้องถิ่น ได้แก่ ภาษีที่ดินและสิ่งปลูกสร้าง ภาษีป้าย ค่าธรรมเนียมต่าง ๆ รวมถึงการชำระภาษีออนไลน์',
    icon: Receipt,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    link: '/e-service',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    documents: [
      'บัตรประจำตัวประชาชน',
      'สำเนาโฉนดที่ดิน',
      'แบบแสดงรายการภาษี',
    ],
    department: 'กองคลัง',
  },
  {
    id: 'construction',
    title: 'งานช่าง/ก่อสร้าง',
    description:
      'บริการด้านการขออนุญาตก่อสร้าง ดัดแปลง รื้อถอนอาคาร ขอเลขที่บ้าน งานผังเมือง และงานสาธารณูปโภค',
    icon: HardHat,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    link: '/e-service',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    documents: [
      'คำขออนุญาตก่อสร้าง (แบบ ข.1)',
      'แบบแปลนก่อสร้าง 5 ชุด',
      'สำเนาโฉนดที่ดิน',
      'บัตรประชาชนและทะเบียนบ้าน',
    ],
    department: 'กองช่าง',
  },
  {
    id: 'health',
    title: 'งานสาธารณสุข',
    description:
      'บริการด้านการส่งเสริมสุขภาพ ควบคุมโรค อนามัยสิ่งแวดล้อม งานรักษาความสะอาด จัดเก็บขยะ และควบคุมมลพิษ',
    icon: HeartPulse,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    link: '/e-service',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    documents: [
      'บัตรประจำตัวประชาชน',
      'เอกสารที่เกี่ยวข้องกับการขออนุญาต',
    ],
    department: 'กองสาธารณสุขและสิ่งแวดล้อม',
  },
  {
    id: 'education',
    title: 'งานการศึกษา',
    description:
      'บริการด้านการศึกษา ศูนย์พัฒนาเด็กเล็ก โรงเรียนในสังกัด ทุนการศึกษา กิจกรรมส่งเสริมการเรียนรู้ ศาสนา ศิลปะ และวัฒนธรรม',
    icon: GraduationCap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    link: '/e-service',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    documents: [
      'สำเนาสูติบัตร',
      'สำเนาทะเบียนบ้าน',
      'รูปถ่ายขนาด 1 นิ้ว',
    ],
    department: 'กองการศึกษา',
  },
  {
    id: 'welfare',
    title: 'งานสวัสดิการสังคม',
    description:
      'บริการด้านสวัสดิการ เบี้ยยังชีพผู้สูงอายุ เบี้ยผู้พิการ เงินสงเคราะห์ การพัฒนาชุมชน และการจัดสวัสดิการสังคม',
    icon: HandHeart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    link: '/e-service',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    documents: [
      'บัตรประจำตัวประชาชน',
      'สำเนาทะเบียนบ้าน',
      'สมุดบัญชีธนาคาร',
      'บัตรประจำตัวคนพิการ (กรณีผู้พิการ)',
    ],
    department: 'กองสวัสดิการสังคม',
  },
  {
    id: 'complaints',
    title: 'งานร้องเรียน/ร้องทุกข์',
    description:
      'บริการรับเรื่องร้องเรียน ร้องทุกข์ แจ้งเหตุเดือดร้อนรำคาญ ปัญหาถนน ไฟส่องสว่าง น้ำท่วม และปัญหาอื่น ๆ ในพื้นที่',
    icon: MessageSquareWarning,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    link: '/complaints',
    hours: 'รับเรื่องตลอด 24 ชั่วโมง (ออนไลน์)',
    documents: [
      'บัตรประจำตัวประชาชน (กรณีมาด้วยตนเอง)',
      'รูปถ่ายประกอบ (ถ้ามี)',
    ],
    department: 'สำนักปลัดเทศบาล',
  },
  {
    id: 'online',
    title: 'บริการออนไลน์',
    description:
      'บริการผ่านระบบออนไลน์ ชำระภาษี ยื่นคำร้อง ดาวน์โหลดแบบฟอร์ม ตรวจสอบสถานะ จองคิวล่วงหน้า และบริการ e-Service ต่าง ๆ',
    icon: Globe,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    link: '/e-service',
    hours: 'ให้บริการตลอด 24 ชั่วโมง',
    documents: ['ลงทะเบียนสมาชิกออนไลน์ก่อนใช้งาน'],
    department: 'ทุกกอง/สำนัก',
  },
];

export default function ServicesPage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">บริการประชาชน</h1>
          <p className="text-blue-100 text-lg">
            บริการต่าง ๆ ของเทศบาลตำบลสมาร์ทซิตี้ เพื่ออำนวยความสะดวกแก่ประชาชน
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">
              หน้าแรก
            </Link>
            <span>/</span>
            <span>บริการประชาชน</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Service Hours Info */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#e8a838]/10 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-[#e8a838]" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">เวลาให้บริการ</h2>
            <p className="text-gray-600 text-sm mt-1">
              วันจันทร์ - ศุกร์ เวลา 08:30 - 16:30 น. (ยกเว้นวันหยุดราชการ)
              | บริการออนไลน์เปิดให้บริการตลอด 24 ชั่วโมง
            </p>
          </div>
        </div>

        {/* Service Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serviceCategories.map((service) => {
            const Icon = service.icon;
            const isExpanded = expandedCard === service.id;
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div
                    className={`w-14 h-14 rounded-xl ${service.bgColor} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-7 h-7 ${service.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Expandable Details */}
                  <button
                    onClick={() =>
                      setExpandedCard(isExpanded ? null : service.id)
                    }
                    className="text-sm text-[#2c5f8a] font-medium hover:underline flex items-center gap-1"
                  >
                    {isExpanded ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'}
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          หน่วยงานรับผิดชอบ
                        </div>
                        <p className="text-sm text-gray-700">
                          {service.department}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                          <Clock className="w-3.5 h-3.5" />
                          เวลาให้บริการ
                        </div>
                        <p className="text-sm text-gray-700">{service.hours}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                          <FileText className="w-3.5 h-3.5" />
                          เอกสารที่ต้องใช้
                        </div>
                        <ul className="space-y-1">
                          {service.documents.map((doc, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-700 flex items-start gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 bg-[#2c5f8a] rounded-full mt-1.5 shrink-0" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Link */}
                <Link
                  href={service.link}
                  className="block border-t border-gray-100 px-6 py-3 text-sm font-medium text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white transition-colors text-center"
                >
                  เข้าสู่บริการ
                </Link>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Search className="w-7 h-7 text-[#2c5f8a]" />
            ลิงก์ที่เกี่ยวข้อง
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'ดาวน์โหลดแบบฟอร์ม', href: '/downloads', icon: FileText },
              { label: 'ติดต่อเรา', href: '/contact', icon: Search },
              { label: 'ร้องเรียน/ร้องทุกข์', href: '/complaints', icon: MessageSquareWarning },
              { label: 'คำถามที่พบบ่อย', href: '/faq', icon: Globe },
            ].map((item, i) => {
              const LinkIcon = item.icon;
              return (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-[#2c5f8a]/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-[#1e3a5f] transition-colors">
                    <LinkIcon className="w-5 h-5 text-[#2c5f8a] group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-[#1e3a5f]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
