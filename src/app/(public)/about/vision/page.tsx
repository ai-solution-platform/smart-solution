'use client';

import Link from 'next/link';
import {
  Eye,
  Target,
  Heart,
  Lightbulb,
  Shield,
  TrendingUp,
  Users,
  Leaf,
  GraduationCap,
  Building2,
  Wifi,
  HandHeart,
} from 'lucide-react';

const missions = [
  'พัฒนาโครงสร้างพื้นฐานและระบบสาธารณูปโภคให้ครอบคลุมและทั่วถึง',
  'ส่งเสริมคุณภาพการศึกษาและสร้างสังคมแห่งการเรียนรู้ตลอดชีวิต',
  'พัฒนาระบบสาธารณสุขและยกระดับสุขภาพประชาชนอย่างยั่งยืน',
  'อนุรักษ์ทรัพยากรธรรมชาติและจัดการสิ่งแวดล้อมอย่างมีประสิทธิภาพ',
  'ส่งเสริมเศรษฐกิจชุมชน การท่องเที่ยว และนวัตกรรมท้องถิ่น',
  'บริหารงานด้วยหลักธรรมาภิบาลและส่งเสริมการมีส่วนร่วมของประชาชน',
];

const coreValues = [
  {
    icon: Heart,
    title: 'ซื่อสัตย์สุจริต',
    description: 'ยึดมั่นในความถูกต้อง โปร่งใส ตรวจสอบได้',
    color: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    icon: Users,
    title: 'ประชาชนเป็นศูนย์กลาง',
    description: 'ให้บริการด้วยใจ มุ่งประโยชน์สุขของประชาชน',
    color: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    icon: Lightbulb,
    title: 'นวัตกรรมและความคิดสร้างสรรค์',
    description: 'พัฒนาด้วยเทคโนโลยีและแนวคิดใหม่อย่างต่อเนื่อง',
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
  },
  {
    icon: Shield,
    title: 'ความรับผิดชอบ',
    description: 'รับผิดชอบต่อหน้าที่และผลลัพธ์ของการดำเนินงาน',
    color: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  {
    icon: HandHeart,
    title: 'ความเอื้ออาทร',
    description: 'ดูแลทุกกลุ่มประชาชนอย่างเท่าเทียมและเป็นธรรม',
    color: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    icon: TrendingUp,
    title: 'มุ่งผลสัมฤทธิ์',
    description: 'ทำงานเชิงรุก มุ่งเป้าหมายและผลลัพธ์ที่เป็นรูปธรรม',
    color: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
];

const strategicGoals = [
  {
    icon: Building2,
    title: 'เมืองน่าอยู่',
    description: 'พัฒนาโครงสร้างพื้นฐาน ถนน ไฟฟ้า ประปา ระบบระบายน้ำ ให้ครอบคลุมทุกพื้นที่',
  },
  {
    icon: Wifi,
    title: 'เมืองอัจฉริยะ',
    description: 'นำเทคโนโลยีดิจิทัลมาใช้ในการบริหารจัดการเมืองและให้บริการประชาชน',
  },
  {
    icon: Leaf,
    title: 'เมืองสีเขียว',
    description: 'รักษาสิ่งแวดล้อม เพิ่มพื้นที่สีเขียว จัดการขยะอย่างเป็นระบบ',
  },
  {
    icon: GraduationCap,
    title: 'เมืองแห่งการเรียนรู้',
    description: 'ส่งเสริมการศึกษาทุกระดับ พัฒนาศูนย์การเรียนรู้ และกิจกรรมสร้างสรรค์',
  },
  {
    icon: Heart,
    title: 'เมืองสุขภาพดี',
    description: 'ยกระดับการสาธารณสุข ดูแลผู้สูงอายุ ส่งเสริมการออกกำลังกาย',
  },
  {
    icon: HandHeart,
    title: 'เมืองแห่งความเท่าเทียม',
    description: 'สร้างสวัสดิการที่ทั่วถึง ดูแลกลุ่มเปราะบาง ลดความเหลื่อมล้ำ',
  },
];

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">วิสัยทัศน์และพันธกิจ</h1>
          <p className="text-blue-100 text-lg">ทิศทางการพัฒนาเทศบาลตำบลสมาร์ทซิตี้สู่อนาคต</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-white">เกี่ยวกับ</Link>
            <span>/</span>
            <span>วิสัยทัศน์และพันธกิจ</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Vision */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2c5f8a] rounded-xl shadow-lg p-8 md:p-12 text-white text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                <Eye className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">วิสัยทัศน์</h2>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
              &ldquo;เมืองน่าอยู่อย่างยั่งยืน ประชาชนมีคุณภาพชีวิตที่ดี
              เศรษฐกิจมั่นคง สังคมเข้มแข็ง
              บริหารงานด้วยหลักธรรมาภิบาล
              มุ่งสู่การเป็นเมืองอัจฉริยะต้นแบบ&rdquo;
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Target className="w-7 h-7 text-[#2c5f8a]" />
            พันธกิจ
          </h2>
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <ul className="space-y-4">
              {missions.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="bg-[#1e3a5f] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Heart className="w-7 h-7 text-[#2c5f8a]" />
            ค่านิยมหลัก
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-14 h-14 rounded-xl ${value.color} flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${value.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Strategic Goals */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-[#2c5f8a]" />
            เป้าหมายเชิงยุทธศาสตร์
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategicGoals.map((goal, i) => {
              const Icon = goal.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="h-2 bg-gradient-to-r from-[#1e3a5f] to-[#e8a838]" />
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center mb-4 group-hover:bg-[#1e3a5f] transition-colors">
                      <Icon className="w-6 h-6 text-[#1e3a5f] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{goal.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{goal.description}</p>
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
