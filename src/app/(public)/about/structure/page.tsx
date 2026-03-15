'use client';

import Link from 'next/link';
import {
  Building2,
  Crown,
  Users,
  Landmark,
  Wrench,
  HeartPulse,
  GraduationCap,
  HandHeart,
  ChevronDown,
} from 'lucide-react';

const departments = [
  {
    name: 'สำนักปลัดเทศบาล',
    head: 'นางมาลี ศรีสุข',
    headTitle: 'ปลัดเทศบาล',
    icon: Building2,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    divisions: [
      'งานธุรการ',
      'งานการเจ้าหน้าที่',
      'งานวิเคราะห์นโยบายและแผน',
      'งานนิติการ',
      'งานป้องกันและบรรเทาสาธารณภัย',
    ],
  },
  {
    name: 'กองคลัง',
    head: 'นางสาวพรทิพย์ รุ่งเรือง',
    headTitle: 'ผู้อำนวยการกองคลัง',
    icon: Landmark,
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    divisions: [
      'งานการเงินและบัญชี',
      'งานพัสดุและทรัพย์สิน',
      'งานจัดเก็บรายได้',
      'งานแผนที่ภาษีและทะเบียนทรัพย์สิน',
    ],
  },
  {
    name: 'กองช่าง',
    head: 'นายสุรชัย เทคโน',
    headTitle: 'ผู้อำนวยการกองช่าง',
    icon: Wrench,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
    divisions: [
      'งานวิศวกรรม',
      'งานสถาปัตยกรรม',
      'งานผังเมือง',
      'งานสาธารณูปโภค',
    ],
  },
  {
    name: 'กองสาธารณสุขและสิ่งแวดล้อม',
    head: 'นางวิไลลักษณ์ สุขใจ',
    headTitle: 'ผู้อำนวยการกองสาธารณสุขฯ',
    icon: HeartPulse,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500',
    divisions: [
      'งานอนามัยและสิ่งแวดล้อม',
      'งานส่งเสริมสุขภาพ',
      'งานรักษาความสะอาด',
      'งานควบคุมโรค',
    ],
  },
  {
    name: 'กองการศึกษา',
    head: 'นายเกรียงไกร ปัญญา',
    headTitle: 'ผู้อำนวยการกองการศึกษา',
    icon: GraduationCap,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    divisions: [
      'งานบริหารการศึกษา',
      'งานส่งเสริมการศึกษา ศาสนา และวัฒนธรรม',
      'งานกิจการโรงเรียน',
    ],
  },
  {
    name: 'กองสวัสดิการสังคม',
    head: 'นางอรุณี เมตตา',
    headTitle: 'ผู้อำนวยการกองสวัสดิการสังคม',
    icon: HandHeart,
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500',
    divisions: [
      'งานสังคมสงเคราะห์',
      'งานพัฒนาชุมชน',
      'งานจัดสวัสดิการสังคม',
    ],
  },
];

export default function StructurePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">โครงสร้างองค์กร</h1>
          <p className="text-blue-100 text-lg">โครงสร้างการบริหารงานเทศบาลตำบลสมาร์ทซิตี้</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-white">เกี่ยวกับ</Link>
            <span>/</span>
            <span>โครงสร้างองค์กร</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Level - นายกเทศมนตรี */}
        <section className="mb-12">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2c5f8a] rounded-xl shadow-lg p-6 md:p-8 text-white text-center max-w-md w-full">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-10 h-10 text-[#e8a838]" />
              </div>
              <h2 className="text-xl font-bold">นายกเทศมนตรี</h2>
              <p className="text-blue-200 mt-1">นายสมชาย รักเมือง</p>
              <p className="text-blue-300 text-sm mt-1">ผู้บริหารสูงสุดของเทศบาล</p>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center mb-8">
            <div className="w-0.5 h-12 bg-[#1e3a5f]" />
          </div>

          {/* Second Level - รองนายกฯ & ปลัด */}
          <div className="flex justify-center mb-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full">
              <div className="bg-white rounded-xl shadow-md border-2 border-[#e8a838] p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#e8a838]/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-[#e8a838]" />
                </div>
                <h3 className="font-semibold text-gray-800">รองนายกเทศมนตรี</h3>
                <p className="text-gray-500 text-sm mt-1">นางสาวสุดา ใจดี</p>
              </div>
              <div className="bg-white rounded-xl shadow-md border-2 border-[#e8a838] p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#e8a838]/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-[#e8a838]" />
                </div>
                <h3 className="font-semibold text-gray-800">รองนายกเทศมนตรี</h3>
                <p className="text-gray-500 text-sm mt-1">นายวิชัย พัฒนา</p>
              </div>
              <div className="bg-white rounded-xl shadow-md border-2 border-[#2c5f8a] p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-[#2c5f8a]/10 flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-[#2c5f8a]" />
                </div>
                <h3 className="font-semibold text-gray-800">ปลัดเทศบาล</h3>
                <p className="text-gray-500 text-sm mt-1">นางมาลี ศรีสุข</p>
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center mb-8">
            <div className="w-0.5 h-12 bg-[#2c5f8a]" />
          </div>

          {/* Third Level - รองปลัด */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-xl shadow-md border-2 border-[#2c5f8a]/50 p-5 text-center max-w-sm w-full">
              <div className="w-12 h-12 rounded-full bg-[#2c5f8a]/10 flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-[#2c5f8a]" />
              </div>
              <h3 className="font-semibold text-gray-800">รองปลัดเทศบาล</h3>
              <p className="text-gray-500 text-sm mt-1">นายธนกฤต วงศ์ประเสริฐ</p>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center mb-8">
            <ChevronDown className="w-8 h-8 text-[#2c5f8a]" />
          </div>
        </section>

        {/* Departments */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-[#2c5f8a]" />
            ส่วนราชการภายใน
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, i) => {
              const Icon = dept.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className={`h-2 ${dept.color}`} />
                  <div className="p-6">
                    <div className={`w-14 h-14 rounded-xl ${dept.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 ${dept.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{dept.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{dept.headTitle}: {dept.head}</p>
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">หน่วยงานภายใน</p>
                      <ul className="space-y-1.5">
                        {dept.divisions.map((div, j) => (
                          <li key={j} className="flex items-center gap-2 text-gray-600 text-sm">
                            <span className={`w-2 h-2 rounded-full ${dept.color} shrink-0`} />
                            {div}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
