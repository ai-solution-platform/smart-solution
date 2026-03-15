'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Target,
  Eye,
  Users,
  MapPin,
  Phone,
  TreePine,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const executives = [
  {
    name: 'นายสมชาย รักเมือง',
    position: 'นายกเทศมนตรี',
    image: '/images/executives/mayor.jpg',
    phone: '081-234-5678',
  },
  {
    name: 'นางสาวสุดา ใจดี',
    position: 'รองนายกเทศมนตรี',
    image: '/images/executives/deputy1.jpg',
    phone: '082-345-6789',
  },
  {
    name: 'นายวิชัย พัฒนา',
    position: 'รองนายกเทศมนตรี',
    image: '/images/executives/deputy2.jpg',
    phone: '083-456-7890',
  },
  {
    name: 'นายประเสริฐ มั่นคง',
    position: 'เลขานุการนายกเทศมนตรี',
    image: '/images/executives/secretary.jpg',
    phone: '084-567-8901',
  },
  {
    name: 'นางมาลี ศรีสุข',
    position: 'ปลัดเทศบาล',
    image: '/images/executives/clerk.jpg',
    phone: '085-678-9012',
  },
  {
    name: 'นายธนกฤต วงศ์ประเสริฐ',
    position: 'รองปลัดเทศบาล',
    image: '/images/executives/deputy-clerk.jpg',
    phone: '086-789-0123',
  },
];

const orgDepartments = [
  {
    name: 'สำนักปลัดเทศบาล',
    head: 'นางมาลี ศรีสุข',
    sub: ['งานธุรการ', 'งานการเจ้าหน้าที่', 'งานวิเคราะห์นโยบายและแผน', 'งานนิติการ', 'งานป้องกันและบรรเทาสาธารณภัย'],
  },
  {
    name: 'กองคลัง',
    head: 'นางสาวพรทิพย์ รุ่งเรือง',
    sub: ['งานการเงินและบัญชี', 'งานพัสดุและทรัพย์สิน', 'งานจัดเก็บรายได้', 'งานแผนที่ภาษีและทะเบียนทรัพย์สิน'],
  },
  {
    name: 'กองช่าง',
    head: 'นายสุรชัย เทคโน',
    sub: ['งานวิศวกรรม', 'งานสถาปัตยกรรม', 'งานผังเมือง', 'งานสาธารณูปโภค'],
  },
  {
    name: 'กองสาธารณสุขและสิ่งแวดล้อม',
    head: 'นางวิไลลักษณ์ สุขใจ',
    sub: ['งานอนามัยและสิ่งแวดล้อม', 'งานส่งเสริมสุขภาพ', 'งานรักษาความสะอาด', 'งานควบคุมโรค'],
  },
  {
    name: 'กองการศึกษา',
    head: 'นายเกรียงไกร ปัญญา',
    sub: ['งานบริหารการศึกษา', 'งานส่งเสริมการศึกษา ศาสนา และวัฒนธรรม', 'งานกิจการโรงเรียน'],
  },
  {
    name: 'กองสวัสดิการสังคม',
    head: 'นางอรุณี เมตตา',
    sub: ['งานสังคมสงเคราะห์', 'งานพัฒนาชุมชน', 'งานจัดสวัสดิการสังคม'],
  },
];

export default function AboutPage() {
  const [expandedDept, setExpandedDept] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">เกี่ยวกับเทศบาลตำบลสมาร์ทซิตี้</h1>
          <p className="text-blue-100 text-lg">ข้อมูลทั่วไป ประวัติความเป็นมา และโครงสร้างการบริหาร</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <span>เกี่ยวกับเรา</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Symbols Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Award className="w-7 h-7 text-blue-600" />
            สัญลักษณ์ประจำเทศบาล
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-32 h-32 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">ตราสัญลักษณ์</h3>
              <p className="text-gray-600 text-sm">
                ตราสัญลักษณ์เทศบาลตำบลสมาร์ทซิตี้ เป็นรูปเสมาธรรมจักร
                ล้อมรอบด้วยลายกนกไทย สื่อถึงความเจริญรุ่งเรืองและ
                การพัฒนาที่ยั่งยืนของท้องถิ่น
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-32 h-32 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-green-600 text-center leading-tight">
                  คำขวัญ
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">คำขวัญประจำเทศบาล</h3>
              <p className="text-gray-600 text-sm italic">
                &ldquo;เมืองน่าอยู่ ผู้คนมีสุข เศรษฐกิจมั่นคง
                สิ่งแวดล้อมยั่งยืน การศึกษาก้าวไกล
                ใส่ใจคุณภาพชีวิต&rdquo;
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-32 h-32 mx-auto bg-pink-50 rounded-full flex items-center justify-center mb-4">
                <TreePine className="w-16 h-16 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">ดอกไม้ประจำเทศบาล</h3>
              <p className="text-gray-600 text-sm">
                ดอกราชพฤกษ์ (ดอกคูน) สีเหลืองทอง เป็นสัญลักษณ์แห่ง
                ความเจริญรุ่งเรืองและความสง่างามของท้องถิ่น
              </p>
            </div>
          </div>
        </section>

        {/* History */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-blue-600" />
            ประวัติความเป็นมา
          </h2>
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                เทศบาลตำบลสมาร์ทซิตี้ เดิมมีฐานะเป็นสุขาภิบาล จัดตั้งขึ้นตามประกาศกระทรวงมหาดไทย
                เมื่อวันที่ 15 มิถุนายน พ.ศ. 2499 ต่อมาได้รับการยกฐานะเป็นเทศบาลตำบล
                ตามพระราชบัญญัติเปลี่ยนแปลงฐานะของสุขาภิบาลเป็นเทศบาล พ.ศ. 2542
                เมื่อวันที่ 25 พฤษภาคม พ.ศ. 2542
              </p>
              <p>
                ปัจจุบันเทศบาลตำบลสมาร์ทซิตี้มีพื้นที่รับผิดชอบประมาณ 28.5 ตารางกิโลเมตร
                ครอบคลุมพื้นที่ 12 ชุมชน มีประชากรตามทะเบียนราษฎรประมาณ 35,000 คน
                จำนวนครัวเรือนประมาณ 12,500 ครัวเรือน
              </p>
              <p>
                ตลอดระยะเวลาที่ผ่านมา เทศบาลได้มุ่งมั่นพัฒนาท้องถิ่นให้เจริญก้าวหน้า
                ทั้งด้านโครงสร้างพื้นฐาน การศึกษา สาธารณสุข สิ่งแวดล้อม
                และคุณภาพชีวิตของประชาชน โดยยึดหลักธรรมาภิบาลในการบริหารงาน
                เพื่อให้เกิดประโยชน์สูงสุดแก่ประชาชนในท้องถิ่น
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Eye className="w-7 h-7 text-blue-600" />
            วิสัยทัศน์และพันธกิจ
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2c5f8a] rounded-xl shadow-md p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-8 h-8" />
                <h3 className="text-xl font-bold">วิสัยทัศน์</h3>
              </div>
              <p className="text-blue-100 leading-relaxed text-lg">
                &ldquo;เมืองน่าอยู่อย่างยั่งยืน ประชาชนมีคุณภาพชีวิตที่ดี
                เศรษฐกิจมั่นคง สังคมเข้มแข็ง
                บริหารงานด้วยหลักธรรมาภิบาล&rdquo;
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">พันธกิจ</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                {[
                  'พัฒนาโครงสร้างพื้นฐานและสาธารณูปโภคให้ทั่วถึง',
                  'ส่งเสริมคุณภาพการศึกษาและการเรียนรู้ตลอดชีวิต',
                  'พัฒนาระบบสาธารณสุขและส่งเสริมสุขภาพประชาชน',
                  'อนุรักษ์ทรัพยากรธรรมชาติและสิ่งแวดล้อม',
                  'ส่งเสริมเศรษฐกิจชุมชนและการท่องเที่ยว',
                  'บริหารจัดการที่ดีตามหลักธรรมาภิบาล',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mt-0.5 shrink-0">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* General Info */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <MapPin className="w-7 h-7 text-blue-600" />
            สภาพทั่วไปและข้อมูลพื้นฐาน
          </h2>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              <div className="p-8 space-y-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">ที่ตั้งและอาณาเขต</h3>
                <div className="space-y-3 text-gray-600 text-sm">
                  <p><strong>ที่ตั้ง:</strong> เลขที่ 999 ถนนเทศบาล 1 ตำบลสมาร์ทซิตี้ อำเภอเมือง จังหวัดสมาร์ท 10000</p>
                  <p><strong>พื้นที่:</strong> 28.5 ตารางกิโลเมตร</p>
                  <p><strong>ทิศเหนือ:</strong> ติดต่อกับ ตำบลบ้านเหนือ อำเภอเมือง</p>
                  <p><strong>ทิศใต้:</strong> ติดต่อกับ ตำบลบ้านใต้ อำเภอเมือง</p>
                  <p><strong>ทิศตะวันออก:</strong> ติดต่อกับ ตำบลบ้านตะวันออก อำเภอเมือง</p>
                  <p><strong>ทิศตะวันตก:</strong> ติดต่อกับ ตำบลบ้านตะวันตก อำเภอเมือง</p>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">ข้อมูลประชากร</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'ประชากรทั้งหมด', value: '35,280 คน' },
                    { label: 'ชาย', value: '17,150 คน' },
                    { label: 'หญิง', value: '18,130 คน' },
                    { label: 'จำนวนครัวเรือน', value: '12,500 ครัวเรือน' },
                    { label: 'จำนวนชุมชน', value: '12 ชุมชน' },
                    { label: 'ความหนาแน่น', value: '1,238 คน/ตร.กม.' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-lg font-semibold text-blue-700">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Executive Team */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-600" />
            คณะผู้บริหาร
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {executives.map((exec, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-white shadow-inner flex items-center justify-center">
                    <Users className="w-12 h-12 text-blue-400" />
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">{exec.name}</h3>
                  <p className="text-blue-600 text-sm font-medium mt-1">{exec.position}</p>
                  <div className="flex items-center justify-center gap-1 mt-3 text-gray-500 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{exec.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Organization Chart */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-blue-600" />
            โครงสร้างการบริหาร
          </h2>
          <div className="space-y-4">
            {orgDepartments.map((dept, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedDept(expandedDept === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">{dept.name}</h3>
                      <p className="text-sm text-gray-500">หัวหน้าส่วน: {dept.head}</p>
                    </div>
                  </div>
                  {expandedDept === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedDept === i && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <ul className="mt-4 space-y-2">
                      {dept.sub.map((sub, j) => (
                        <li key={j} className="flex items-center gap-2 text-gray-600 text-sm">
                          <span className="w-2 h-2 bg-blue-400 rounded-full shrink-0" />
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
