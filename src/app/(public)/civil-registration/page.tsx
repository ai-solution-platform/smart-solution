'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Phone,
  ChevronDown,
  ChevronUp,
  Baby,
  UserX,
  Home,
  PenLine,
  Copy,
  Edit3,
  Building2,
  BadgeCheck,
  Banknote,
  CalendarDays,
} from 'lucide-react';

interface ServiceItem {
  id: number;
  title: string;
  icon: React.ElementType;
  description: string;
  documents: string[];
  duration: string;
  fee: string;
}

const services: ServiceItem[] = [
  {
    id: 1,
    title: 'แจ้งเกิด',
    icon: Baby,
    description: 'การแจ้งเกิดบุตร ต้องแจ้งภายใน 15 วัน นับแต่วันเกิด',
    documents: [
      'บัตรประจำตัวประชาชนของบิดาหรือมารดา',
      'สำเนาทะเบียนบ้านที่จะเพิ่มชื่อเด็ก',
      'หนังสือรับรองการเกิดจากโรงพยาบาล (ท.ร.1/1)',
      'สำเนาทะเบียนสมรส (ถ้ามี)',
      'พยานบุคคล 2 คน (กรณีเกิดนอกโรงพยาบาล)',
    ],
    duration: 'ประมาณ 15-30 นาที',
    fee: 'ไม่เสียค่าธรรมเนียม',
  },
  {
    id: 2,
    title: 'แจ้งตาย',
    icon: UserX,
    description: 'การแจ้งการตาย ต้องแจ้งภายใน 24 ชั่วโมง นับแต่เวลาตายหรือเวลาพบศพ',
    documents: [
      'บัตรประจำตัวประชาชนของผู้แจ้ง',
      'สำเนาทะเบียนบ้านฉบับเจ้าบ้านที่คนตายมีชื่ออยู่',
      'หนังสือรับรองการตายจากโรงพยาบาล (ท.ร.4/1) (ถ้ามี)',
      'บัตรประจำตัวประชาชนของผู้ตาย (ถ้ามี)',
      'พยานบุคคล 1 คน',
    ],
    duration: 'ประมาณ 15-30 นาที',
    fee: 'ไม่เสียค่าธรรมเนียม',
  },
  {
    id: 3,
    title: 'แจ้งย้ายที่อยู่ (ย้ายเข้า/ย้ายออก)',
    icon: Home,
    description: 'การแจ้งย้ายที่อยู่เข้าหรือออกจากทะเบียนบ้าน ต้องแจ้งภายใน 15 วัน',
    documents: [
      'บัตรประจำตัวประชาชนของผู้แจ้ง (เจ้าบ้าน)',
      'สำเนาทะเบียนบ้านฉบับเจ้าบ้าน',
      'ใบแจ้งย้ายที่อยู่ (ท.ร.6) ตอนที่ 1 และ 2',
      'หนังสือมอบอำนาจ (กรณีเจ้าบ้านไม่สามารถมาดำเนินการเอง)',
      'บัตรประจำตัวประชาชนของผู้ย้าย',
    ],
    duration: 'ประมาณ 15-30 นาที',
    fee: 'ค่าธรรมเนียม 20 บาท',
  },
  {
    id: 4,
    title: 'เปลี่ยนชื่อ-สกุล',
    icon: PenLine,
    description: 'การยื่นคำร้องขอเปลี่ยนชื่อตัว หรือชื่อสกุล',
    documents: [
      'บัตรประจำตัวประชาชน',
      'สำเนาทะเบียนบ้าน',
      'สูติบัตร (กรณีผู้เยาว์)',
      'หนังสือยินยอมจากบิดามารดา (กรณีผู้เยาว์)',
      'หลักฐานอื่น ๆ (ถ้ามี) เช่น ทะเบียนสมรส ทะเบียนหย่า',
    ],
    duration: 'ประมาณ 30 นาที - 1 ชั่วโมง',
    fee: 'ค่าธรรมเนียม 50 บาท',
  },
  {
    id: 5,
    title: 'คัดสำเนาทะเบียนบ้าน',
    icon: Copy,
    description: 'การขอคัดสำเนาหรือคัดและรับรองสำเนาทะเบียนบ้าน',
    documents: [
      'บัตรประจำตัวประชาชนของผู้ยื่นคำร้อง',
      'สำเนาทะเบียนบ้าน (ถ้ามี)',
      'หนังสือมอบอำนาจ (กรณีมอบอำนาจให้ผู้อื่นดำเนินการ)',
      'บัตรประจำตัวประชาชนของผู้รับมอบอำนาจ',
    ],
    duration: 'ประมาณ 10-15 นาที',
    fee: 'ค่าธรรมเนียม 10 บาท/ฉบับ',
  },
  {
    id: 6,
    title: 'แก้ไขรายการในทะเบียนบ้าน',
    icon: Edit3,
    description: 'การขอแก้ไขรายการที่ผิดพลาดในทะเบียนบ้าน เช่น ชื่อ วันเกิด สัญชาติ',
    documents: [
      'บัตรประจำตัวประชาชน',
      'สำเนาทะเบียนบ้าน',
      'เอกสารหลักฐานที่เกี่ยวข้องกับรายการที่ต้องการแก้ไข',
      'สูติบัตร หรือเอกสารราชการอื่นที่แสดงข้อมูลถูกต้อง',
      'พยานบุคคล (กรณีจำเป็น)',
    ],
    duration: 'ประมาณ 30 นาที - 1 ชั่วโมง (อาจนานกว่านี้หากต้องตรวจสอบเพิ่มเติม)',
    fee: 'ไม่เสียค่าธรรมเนียม (กรณีเจ้าหน้าที่บันทึกผิดพลาด)',
  },
];

export default function CivilRegistrationPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleService = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">งานทะเบียนราษฎร</h1>
          <p className="text-blue-100 text-lg">
            บริการงานทะเบียนราษฎรของเทศบาลตำบลสมาร์ทซิตี้ พร้อมข้อมูลเอกสาร ขั้นตอน
            และค่าธรรมเนียม
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">
              หน้าแรก
            </Link>
            <span>/</span>
            <span>งานทะเบียนราษฎร</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">เกี่ยวกับงานทะเบียนราษฎร</h2>
              <p className="text-gray-600 leading-relaxed">
                งานทะเบียนราษฎร สำนักปลัดเทศบาลตำบลสมาร์ทซิตี้
                ให้บริการประชาชนด้านงานทะเบียนต่าง ๆ ตามพระราชบัญญัติการทะเบียนราษฎร พ.ศ. 2534
                และแก้ไขเพิ่มเติม ท่านสามารถตรวจสอบรายละเอียดเอกสารที่ต้องใช้
                ระยะเวลาดำเนินการ และค่าธรรมเนียมสำหรับแต่ละบริการได้ด้านล่าง
              </p>
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="space-y-4 mb-12">
          {services.map((service) => {
            const isOpen = openId === service.id;
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => toggleService(service.id)}
                  className="w-full flex items-start justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-[#1e3a5f]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{service.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0 mt-2" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 mt-2" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 md:px-6 pb-6 border-t border-gray-100">
                    <div className="grid md:grid-cols-3 gap-6 mt-5">
                      {/* Required Documents */}
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          เอกสารที่ต้องใช้
                        </h4>
                        <ul className="space-y-2">
                          {service.documents.map((doc, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-medium mt-0.5">
                                {idx + 1}
                              </span>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Duration & Fee */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-orange-500" />
                            ระยะเวลาดำเนินการ
                          </h4>
                          <p className="text-sm text-gray-600">{service.duration}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                            <Banknote className="w-4 h-4 text-green-500" />
                            ค่าธรรมเนียม
                          </h4>
                          <p className="text-sm text-gray-600">{service.fee}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Online Request CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">ยื่นคำร้องออนไลน์</h3>
              <p className="text-purple-100">
                นัดหมายล่วงหน้าผ่านระบบออนไลน์ ลดเวลารอคิว เตรียมเอกสารได้ก่อนมาติดต่อ
              </p>
            </div>
            <Link
              href="/e-service/civil-registration"
              className="shrink-0 bg-white text-purple-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2 shadow-lg"
            >
              <PenLine className="w-5 h-5" />
              ยื่นคำร้องออนไลน์
            </Link>
          </div>
        </div>

        {/* Status Tracking */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            ติดตามสถานะคำร้อง
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="กรอกหมายเลขอ้างอิง เช่น REG-2568-12345"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => alert('ระบบ Demo: คำร้อง REG-2568-12345 สถานะ: กำลังดำเนินการ (เจ้าหน้าที่ตรวจสอบเอกสารแล้ว รอนัดหมาย)')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shrink-0"
            >
              ตรวจสอบสถานะ
            </button>
          </div>
        </div>

        {/* Contact & Service Hours */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              ติดต่อสอบถาม
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-800">สำนักปลัดเทศบาล</p>
                  <p className="text-sm text-gray-500">งานทะเบียนราษฎร</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">โทร. 02-XXX-XXXX ต่อ 101-103</p>
                  <p className="text-sm text-gray-600">สายด่วน: 1132</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Hours */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              วันและเวลาให้บริการ
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800">จันทร์ - ศุกร์</p>
                  <p className="text-sm text-gray-500">เวลา 08:30 - 16:30 น.</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <p className="text-sm text-amber-700">
                  ปิดให้บริการวันเสาร์-อาทิตย์ และวันหยุดนักขัตฤกษ์
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  แนะนำให้เตรียมเอกสารให้ครบถ้วนก่อนมาติดต่อ เพื่อความสะดวกและรวดเร็วในการดำเนินการ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
