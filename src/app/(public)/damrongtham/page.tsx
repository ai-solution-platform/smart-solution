'use client';

import Link from 'next/link';
import {
  Scale,
  MessageSquareWarning,
  Handshake,
  Gavel,
  ArrowRightLeft,
  Phone,
  MapPin,
  Globe,
  Clock,
  CheckCircle,
  Loader,
  BarChart3,
  ExternalLink,
  Shield,
  Users,
} from 'lucide-react';

const services = [
  {
    icon: MessageSquareWarning,
    title: 'รับเรื่องร้องเรียน/ร้องทุกข์',
    description:
      'รับเรื่องร้องเรียน ร้องทุกข์จากประชาชนในทุกประเด็นที่เกี่ยวข้องกับการบริการสาธารณะ ความเดือดร้อนจากหน่วยงานราชการ หรือปัญหาในชุมชน',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: Handshake,
    title: 'ไกล่เกลี่ยข้อพิพาท',
    description:
      'ให้บริการไกล่เกลี่ยข้อพิพาทระหว่างประชาชน ทั้งข้อพิพาททางแพ่งและปัญหาความขัดแย้งในชุมชน โดยคณะกรรมการไกล่เกลี่ยที่ได้รับการแต่งตั้ง',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Gavel,
    title: 'ให้คำปรึกษาทางกฎหมาย',
    description:
      'ให้คำปรึกษาและคำแนะนำทางกฎหมายแก่ประชาชน โดยไม่เสียค่าใช้จ่าย ครอบคลุมกฎหมายแพ่ง กฎหมายอาญา กฎหมายที่ดิน กฎหมายแรงงาน และกฎหมายปกครอง',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: ArrowRightLeft,
    title: 'ประสานงานแก้ไขปัญหา',
    description:
      'ประสานงานกับหน่วยงานที่เกี่ยวข้องทั้งภายในและภายนอกเทศบาล เพื่อแก้ไขปัญหาและตอบสนองความต้องการของประชาชนอย่างรวดเร็ว',
    color: 'bg-blue-100 text-blue-600',
  },
];

const stats = [
  {
    label: 'เรื่องร้องเรียนทั้งหมด',
    value: '245',
    icon: BarChart3,
    color: 'bg-blue-100 text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    label: 'ดำเนินการแล้ว',
    value: '198',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    label: 'อยู่ระหว่างดำเนินการ',
    value: '47',
    icon: Loader,
    color: 'bg-orange-100 text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const channels = [
  {
    icon: MapPin,
    title: 'มาด้วยตนเอง',
    description: 'ศูนย์ดำรงธรรมเทศบาลตำบลสมาร์ทซิตี้ ชั้น 1 อาคารสำนักงานเทศบาล',
    detail: 'จันทร์ - ศุกร์ เวลา 08:30 - 16:30 น.',
  },
  {
    icon: Phone,
    title: 'โทรศัพท์',
    description: 'โทร. 02-XXX-XXXX ต่อ 101',
    detail: 'สายด่วนศูนย์ดำรงธรรม 1567',
  },
  {
    icon: Globe,
    title: 'ออนไลน์',
    description: 'ยื่นเรื่องร้องเรียนผ่านระบบออนไลน์ได้ตลอด 24 ชั่วโมง',
    detail: 'คลิกปุ่มด้านล่างเพื่อยื่นเรื่อง',
    hasLink: true,
  },
];

export default function DamrongthamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ศูนย์ดำรงธรรมเทศบาล</h1>
          <p className="text-blue-100 text-lg">
            ศูนย์รับเรื่องร้องเรียน ร้องทุกข์ ไกล่เกลี่ยข้อพิพาท
            และให้คำปรึกษาทางกฎหมายแก่ประชาชน
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">
              หน้าแรก
            </Link>
            <span>/</span>
            <span>ศูนย์ดำรงธรรมเทศบาล</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                เกี่ยวกับศูนย์ดำรงธรรมเทศบาล
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                ศูนย์ดำรงธรรมเทศบาลตำบลสมาร์ทซิตี้
                จัดตั้งขึ้นตามนโยบายของกระทรวงมหาดไทยและคำสั่งคณะรักษาความสงบแห่งชาติ
                เพื่อเป็นศูนย์กลางในการรับเรื่องร้องเรียน ร้องทุกข์ของประชาชน
                ให้บริการแก้ไขปัญหาความเดือดร้อน ไกล่เกลี่ยข้อพิพาท
                และให้คำปรึกษาทางกฎหมายแก่ประชาชนในเขตเทศบาล
              </p>
              <p className="text-gray-600 leading-relaxed">
                ศูนย์ดำรงธรรมยึดหลักการทำงานด้วยความเป็นธรรม โปร่งใส รวดเร็ว
                และเป็นมิตรกับประชาชน โดยมีเป้าหมายเพื่อลดความเหลื่อมล้ำ สร้างความเป็นธรรม
                และอำนวยความสะดวกให้แก่ประชาชนในการเข้าถึงกระบวนการยุติธรรม
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`${stat.bgColor} rounded-xl border border-gray-100 p-6 text-center`}
              >
                <div
                  className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-1">ข้อมูล ณ ปีงบประมาณ 2568</p>
              </div>
            );
          })}
        </div>

        {/* Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#1e3a5f]" />
            บริการของศูนย์ดำรงธรรม
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How to Submit */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1e3a5f]" />
            ช่องทางการยื่นเรื่องร้องเรียน
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {channels.map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#1e3a5f]" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{channel.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
                  <p className="text-xs text-gray-400">{channel.detail}</p>
                  {channel.hasLink && (
                    <Link
                      href="/complaints"
                      className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      ยื่นเรื่องออนไลน์
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">ขั้นตอนการดำเนินการ</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: 'รับเรื่อง',
                desc: 'เจ้าหน้าที่รับเรื่องร้องเรียน/ร้องทุกข์ และออกเลขรับเรื่อง',
              },
              {
                step: 2,
                title: 'ตรวจสอบและคัดกรอง',
                desc: 'ตรวจสอบข้อมูล คัดกรองเรื่อง และส่งต่อหน่วยงานที่รับผิดชอบ',
              },
              {
                step: 3,
                title: 'ดำเนินการแก้ไข',
                desc: 'หน่วยงานที่เกี่ยวข้องดำเนินการแก้ไขปัญหาตามอำนาจหน้าที่',
              },
              {
                step: 4,
                title: 'แจ้งผลดำเนินการ',
                desc: 'แจ้งผลการดำเนินการให้ผู้ร้องเรียนทราบผ่านช่องทางที่ระบุไว้',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Hours & CTA */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
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
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">โทร. 02-XXX-XXXX ต่อ 101</p>
                  <p className="text-sm text-gray-600">สายด่วนศูนย์ดำรงธรรม 1567</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2c5f8a] rounded-xl p-6 text-white flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-3">ต้องการร้องเรียนหรือแจ้งปัญหา?</h3>
            <p className="text-blue-100 text-sm mb-5">
              ยื่นเรื่องร้องเรียนออนไลน์ได้ง่าย ๆ ผ่านระบบรับเรื่องร้องเรียนของเทศบาล
              ติดตามสถานะได้ตลอด 24 ชั่วโมง
            </p>
            <Link
              href="/complaints"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1e3a5f] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors w-fit"
            >
              <MessageSquareWarning className="w-5 h-5" />
              ยื่นเรื่องร้องเรียนออนไลน์
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
