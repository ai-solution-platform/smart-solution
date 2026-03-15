'use client';

import Link from 'next/link';
import { Users, Phone, Crown, Award } from 'lucide-react';

const councilLeaders = [
  {
    name: 'นายสุทธิพงศ์ ยุติธรรม',
    position: 'ประธานสภาเทศบาล',
    phone: '087-111-2233',
    badge: 'ประธานสภา',
  },
  {
    name: 'นายวรพจน์ สร้างสรรค์',
    position: 'รองประธานสภาเทศบาล',
    phone: '087-222-3344',
    badge: 'รองประธานสภา',
  },
];

const councilMembers = [
  { name: 'นายอนันต์ มีชัย', district: 'เขต 1', phone: '088-111-0001' },
  { name: 'นางสมจิตร ดวงแก้ว', district: 'เขต 1', phone: '088-111-0002' },
  { name: 'นายพิชิต แสงทอง', district: 'เขต 1', phone: '088-111-0003' },
  { name: 'นางพรรณี สุขสันต์', district: 'เขต 1', phone: '088-111-0004' },
  { name: 'นายบุญมี ทองดี', district: 'เขต 1', phone: '088-111-0005' },
  { name: 'นายศักดิ์ชัย กล้าหาญ', district: 'เขต 1', phone: '088-111-0006' },
  { name: 'นางวันเพ็ญ ศรีวิไล', district: 'เขต 2', phone: '088-222-0001' },
  { name: 'นายธีรศักดิ์ ประสิทธิ์', district: 'เขต 2', phone: '088-222-0002' },
  { name: 'นายสมบัติ พูลทรัพย์', district: 'เขต 2', phone: '088-222-0003' },
  { name: 'นางนิตยา รุ่งอรุณ', district: 'เขต 2', phone: '088-222-0004' },
  { name: 'นายประสงค์ ใจกว้าง', district: 'เขต 2', phone: '088-222-0005' },
  { name: 'นายชาติชาย รักษ์ถิ่น', district: 'เขต 2', phone: '088-222-0006' },
];

export default function CouncilPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">สภาเทศบาล</h1>
          <p className="text-blue-100 text-lg">สมาชิกสภาเทศบาลตำบลสมาร์ทซิตี้</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-white">เกี่ยวกับ</Link>
            <span>/</span>
            <span>สภาเทศบาล</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Council Leaders */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Crown className="w-7 h-7 text-[#e8a838]" />
            ประธานและรองประธานสภาเทศบาล
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {councilLeaders.map((leader, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg border-2 border-[#e8a838] overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-[#1e3a5f] to-[#2c5f8a] flex items-center justify-center relative">
                  {i === 0 && (
                    <div className="absolute top-4 right-4">
                      <Award className="w-8 h-8 text-[#e8a838]" />
                    </div>
                  )}
                  <div className="w-28 h-28 rounded-full bg-white/20 shadow-lg flex items-center justify-center">
                    <Users className="w-12 h-12 text-white/80" />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#e8a838] text-white mb-3">
                    {leader.badge}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">{leader.name}</h3>
                  <p className="text-[#2c5f8a] font-medium mt-1">{leader.position}</p>
                  <div className="flex items-center justify-center gap-1 mt-3 text-gray-500 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{leader.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* เลขานุการสภา */}
        <section className="mb-12">
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center max-w-sm w-full">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-[#2c5f8a]" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2c5f8a]/10 text-[#2c5f8a] mb-2">
                เลขานุการสภา
              </span>
              <h3 className="text-lg font-semibold text-gray-800">นางมาลี ศรีสุข</h3>
              <p className="text-gray-500 text-sm mt-1">ปลัดเทศบาล (ทำหน้าที่เลขานุการสภา)</p>
              <div className="flex items-center justify-center gap-1 mt-3 text-gray-500 text-sm">
                <Phone className="w-4 h-4" />
                <span>085-678-9012</span>
              </div>
            </div>
          </div>
        </section>

        {/* Council Members */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Users className="w-7 h-7 text-[#2c5f8a]" />
            สมาชิกสภาเทศบาล
          </h2>

          {/* District 1 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold">1</span>
              สมาชิกสภาเทศบาล เขตเลือกตั้งที่ 1
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {councilMembers.filter(m => m.district === 'เขต 1').map((member, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-36 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white shadow-inner flex items-center justify-center">
                      <Users className="w-9 h-9 text-blue-400" />
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h4 className="font-semibold text-gray-800">{member.name}</h4>
                    <p className="text-[#2c5f8a] text-sm mt-1">สมาชิกสภาเทศบาล</p>
                    <div className="flex items-center justify-center gap-1 mt-2 text-gray-500 text-sm">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* District 2 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#2c5f8a] text-white flex items-center justify-center text-sm font-bold">2</span>
              สมาชิกสภาเทศบาล เขตเลือกตั้งที่ 2
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {councilMembers.filter(m => m.district === 'เขต 2').map((member, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-36 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white shadow-inner flex items-center justify-center">
                      <Users className="w-9 h-9 text-blue-400" />
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h4 className="font-semibold text-gray-800">{member.name}</h4>
                    <p className="text-[#2c5f8a] text-sm mt-1">สมาชิกสภาเทศบาล</p>
                    <div className="flex items-center justify-center gap-1 mt-2 text-gray-500 text-sm">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
