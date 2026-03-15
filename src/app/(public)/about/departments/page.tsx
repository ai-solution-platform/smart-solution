'use client';

import Link from 'next/link';
import {
  Building2,
  Landmark,
  Wrench,
  HeartPulse,
  GraduationCap,
  HandHeart,
  Phone,
  Mail,
  Clock,
  CheckCircle,
} from 'lucide-react';

const departments = [
  {
    name: 'สำนักปลัดเทศบาล',
    icon: Building2,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    head: 'นางมาลี ศรีสุข',
    headTitle: 'ปลัดเทศบาล',
    phone: '043-000-001',
    email: 'office@smartcity.go.th',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    description: 'รับผิดชอบงานบริหารทั่วไปของเทศบาล งานนโยบายและแผน งานบุคลากร งานนิติการ และงานป้องกันและบรรเทาสาธารณภัย',
    responsibilities: [
      'งานธุรการและสารบรรณ',
      'งานการเจ้าหน้าที่และบุคลากร',
      'งานวิเคราะห์นโยบายและแผน',
      'งานนิติการ',
      'งานป้องกันและบรรเทาสาธารณภัย',
      'งานกิจการสภาเทศบาล',
    ],
  },
  {
    name: 'กองคลัง',
    icon: Landmark,
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    head: 'นางสาวพรทิพย์ รุ่งเรือง',
    headTitle: 'ผู้อำนวยการกองคลัง',
    phone: '043-000-002',
    email: 'finance@smartcity.go.th',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    description: 'รับผิดชอบงานการเงินการคลัง งานจัดเก็บรายได้ งานพัสดุและทรัพย์สิน รวมถึงการจัดทำงบประมาณของเทศบาล',
    responsibilities: [
      'งานการเงินและบัญชี',
      'งานพัสดุและทรัพย์สิน',
      'งานจัดเก็บรายได้',
      'งานแผนที่ภาษีและทะเบียนทรัพย์สิน',
      'งานจัดทำงบประมาณ',
    ],
  },
  {
    name: 'กองช่าง',
    icon: Wrench,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
    head: 'นายสุรชัย เทคโน',
    headTitle: 'ผู้อำนวยการกองช่าง',
    phone: '043-000-003',
    email: 'engineering@smartcity.go.th',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    description: 'รับผิดชอบงานโครงสร้างพื้นฐาน งานก่อสร้าง งานผังเมือง งานสาธารณูปโภค และการขออนุญาตก่อสร้าง',
    responsibilities: [
      'งานวิศวกรรมและออกแบบ',
      'งานสถาปัตยกรรม',
      'งานผังเมือง',
      'งานสาธารณูปโภค',
      'งานควบคุมอาคารและขออนุญาตก่อสร้าง',
      'งานไฟฟ้าสาธารณะ',
    ],
  },
  {
    name: 'กองสาธารณสุขและสิ่งแวดล้อม',
    icon: HeartPulse,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500',
    head: 'นางวิไลลักษณ์ สุขใจ',
    headTitle: 'ผู้อำนวยการกองสาธารณสุขฯ',
    phone: '043-000-004',
    email: 'health@smartcity.go.th',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    description: 'รับผิดชอบงานส่งเสริมสุขภาพ งานอนามัยสิ่งแวดล้อม งานรักษาความสะอาด งานควบคุมโรค และงานกำจัดขยะ',
    responsibilities: [
      'งานอนามัยและสิ่งแวดล้อม',
      'งานส่งเสริมสุขภาพ',
      'งานรักษาความสะอาด',
      'งานควบคุมโรค',
      'งานกำจัดขยะมูลฝอยและสิ่งปฏิกูล',
      'งานคุ้มครองผู้บริโภค',
    ],
  },
  {
    name: 'กองการศึกษา',
    icon: GraduationCap,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    head: 'นายเกรียงไกร ปัญญา',
    headTitle: 'ผู้อำนวยการกองการศึกษา',
    phone: '043-000-005',
    email: 'education@smartcity.go.th',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    description: 'รับผิดชอบงานการศึกษาปฐมวัย งานส่งเสริมการศึกษา ศาสนา วัฒนธรรม และกิจกรรมนันทนาการ',
    responsibilities: [
      'งานบริหารการศึกษา',
      'งานส่งเสริมการศึกษา ศาสนา และวัฒนธรรม',
      'งานกิจการโรงเรียนและศูนย์พัฒนาเด็กเล็ก',
      'งานกีฬาและนันทนาการ',
      'งานห้องสมุดและแหล่งเรียนรู้',
    ],
  },
  {
    name: 'กองสวัสดิการสังคม',
    icon: HandHeart,
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500',
    head: 'นางอรุณี เมตตา',
    headTitle: 'ผู้อำนวยการกองสวัสดิการสังคม',
    phone: '043-000-006',
    email: 'welfare@smartcity.go.th',
    hours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
    description: 'รับผิดชอบงานสวัสดิการสังคม งานพัฒนาชุมชน งานส่งเสริมอาชีพ และดูแลกลุ่มเปราะบาง ผู้สูงอายุ ผู้พิการ',
    responsibilities: [
      'งานสังคมสงเคราะห์',
      'งานพัฒนาชุมชน',
      'งานจัดสวัสดิการสังคม',
      'งานเบี้ยยังชีพผู้สูงอายุและผู้พิการ',
      'งานส่งเสริมอาชีพและพัฒนาสตรี',
    ],
  },
];

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ส่วนราชการ</h1>
          <p className="text-blue-100 text-lg">หน่วยงานภายในเทศบาลตำบลสมาร์ทซิตี้</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-white">เกี่ยวกับ</Link>
            <span>/</span>
            <span>ส่วนราชการ</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {departments.map((dept, i) => {
            const Icon = dept.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={`h-2 ${dept.color}`} />
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Icon & Title */}
                    <div className="md:w-1/3">
                      <div className={`w-16 h-16 rounded-xl ${dept.bgColor} flex items-center justify-center mb-4`}>
                        <Icon className={`w-8 h-8 ${dept.iconColor}`} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{dept.name}</h2>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{dept.description}</p>

                      {/* Contact Info */}
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">หัวหน้าส่วน</p>
                        <p className="text-gray-800 font-medium">{dept.head}</p>
                        <p className="text-gray-500 text-xs">{dept.headTitle}</p>
                        <div className="pt-2 space-y-1.5">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{dept.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{dept.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{dept.hours}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Responsibilities */}
                    <div className="md:w-2/3 md:border-l md:border-gray-100 md:pl-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2c5f8a]" />
                        ภารกิจและหน้าที่รับผิดชอบ
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {dept.responsibilities.map((resp, j) => (
                          <div
                            key={j}
                            className={`flex items-start gap-3 p-3 rounded-lg ${dept.bgColor} border border-gray-100`}
                          >
                            <span className={`w-6 h-6 rounded-full ${dept.color} text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}>
                              {j + 1}
                            </span>
                            <span className="text-gray-700 text-sm">{resp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
