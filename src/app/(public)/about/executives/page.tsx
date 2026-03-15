'use client';

import Link from 'next/link';
import { Users, Phone, Mail, Crown } from 'lucide-react';

const executiveTeam = [
  {
    name: 'นายสมชาย รักเมือง',
    position: 'นายกเทศมนตรีตำบลสมาร์ทซิตี้',
    phone: '081-234-5678',
    email: 'mayor@smartcity.go.th',
    level: 'top',
  },
  {
    name: 'นางสาวสุดา ใจดี',
    position: 'รองนายกเทศมนตรี',
    phone: '082-345-6789',
    email: 'deputy1@smartcity.go.th',
    level: 'deputy',
  },
  {
    name: 'นายวิชัย พัฒนา',
    position: 'รองนายกเทศมนตรี',
    phone: '083-456-7890',
    email: 'deputy2@smartcity.go.th',
    level: 'deputy',
  },
  {
    name: 'นายประเสริฐ มั่นคง',
    position: 'เลขานุการนายกเทศมนตรี',
    phone: '084-567-8901',
    email: 'secretary@smartcity.go.th',
    level: 'support',
  },
  {
    name: 'นายอำนาจ วิสุทธิ์',
    position: 'ที่ปรึกษานายกเทศมนตรี',
    phone: '084-678-9012',
    email: 'advisor@smartcity.go.th',
    level: 'support',
  },
  {
    name: 'นางมาลี ศรีสุข',
    position: 'ปลัดเทศบาล',
    phone: '085-678-9012',
    email: 'clerk@smartcity.go.th',
    level: 'staff',
  },
  {
    name: 'นายธนกฤต วงศ์ประเสริฐ',
    position: 'รองปลัดเทศบาล',
    phone: '086-789-0123',
    email: 'deputyclerk@smartcity.go.th',
    level: 'staff',
  },
];

function getLevelStyle(level: string) {
  switch (level) {
    case 'top':
      return {
        border: 'border-[#e8a838]',
        gradient: 'from-[#1e3a5f] to-[#2c5f8a]',
        badge: 'bg-[#e8a838] text-white',
        avatarBg: 'bg-white/20',
      };
    case 'deputy':
      return {
        border: 'border-[#2c5f8a]',
        gradient: 'from-[#2c5f8a] to-[#3a7ab5]',
        badge: 'bg-[#2c5f8a] text-white',
        avatarBg: 'bg-white/20',
      };
    case 'support':
      return {
        border: 'border-[#e8a838]/50',
        gradient: 'from-amber-100 to-amber-200',
        badge: 'bg-[#e8a838]/20 text-[#b07d1a]',
        avatarBg: 'bg-white',
      };
    default:
      return {
        border: 'border-blue-200',
        gradient: 'from-blue-100 to-blue-200',
        badge: 'bg-blue-100 text-blue-700',
        avatarBg: 'bg-white',
      };
  }
}

export default function ExecutivesPage() {
  const mayor = executiveTeam.filter((e) => e.level === 'top');
  const deputies = executiveTeam.filter((e) => e.level === 'deputy');
  const support = executiveTeam.filter((e) => e.level === 'support');
  const staff = executiveTeam.filter((e) => e.level === 'staff');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">คณะผู้บริหาร</h1>
          <p className="text-blue-100 text-lg">ผู้บริหารเทศบาลตำบลสมาร์ทซิตี้</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-white">เกี่ยวกับ</Link>
            <span>/</span>
            <span>คณะผู้บริหาร</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mayor */}
        <section className="mb-12">
          <div className="flex justify-center">
            {mayor.map((exec, i) => {
              const style = getLevelStyle(exec.level);
              return (
                <div
                  key={i}
                  className={`bg-white rounded-xl shadow-lg border-2 ${style.border} overflow-hidden max-w-lg w-full hover:shadow-xl transition-shadow`}
                >
                  <div className={`h-52 bg-gradient-to-br ${style.gradient} flex items-center justify-center relative`}>
                    <div className="absolute top-4 left-4">
                      <Crown className="w-6 h-6 text-[#e8a838]" />
                    </div>
                    <div className={`w-32 h-32 rounded-full ${style.avatarBg} shadow-lg flex items-center justify-center`}>
                      <Users className="w-14 h-14 text-white/80" />
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style.badge} mb-3`}>
                      ผู้บริหารสูงสุด
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800">{exec.name}</h2>
                    <p className="text-[#2c5f8a] font-medium mt-1">{exec.position}</p>
                    <div className="flex items-center justify-center gap-6 mt-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{exec.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{exec.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Deputies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Users className="w-7 h-7 text-[#2c5f8a]" />
            รองนายกเทศมนตรี
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {deputies.map((exec, i) => {
              const style = getLevelStyle(exec.level);
              return (
                <div
                  key={i}
                  className={`bg-white rounded-xl shadow-md border-2 ${style.border} overflow-hidden hover:shadow-lg transition-shadow`}
                >
                  <div className={`h-44 bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                    <div className={`w-24 h-24 rounded-full ${style.avatarBg} shadow-lg flex items-center justify-center`}>
                      <Users className="w-10 h-10 text-white/80" />
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">{exec.name}</h3>
                    <p className="text-[#2c5f8a] text-sm font-medium mt-1">{exec.position}</p>
                    <div className="flex flex-col items-center gap-1 mt-3 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{exec.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{exec.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Support Staff */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Users className="w-7 h-7 text-[#e8a838]" />
            เลขานุการและที่ปรึกษา
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {support.map((exec, i) => {
              const style = getLevelStyle(exec.level);
              return (
                <div
                  key={i}
                  className={`bg-white rounded-xl shadow-md border ${style.border} overflow-hidden hover:shadow-lg transition-shadow`}
                >
                  <div className={`h-40 bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                    <div className={`w-20 h-20 rounded-full ${style.avatarBg} shadow-inner flex items-center justify-center`}>
                      <Users className="w-9 h-9 text-[#e8a838]" />
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">{exec.name}</h3>
                    <p className="text-[#e8a838] text-sm font-medium mt-1">{exec.position}</p>
                    <div className="flex items-center justify-center gap-1 mt-3 text-gray-500 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{exec.phone}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Permanent Staff */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Users className="w-7 h-7 text-[#2c5f8a]" />
            ข้าราชการประจำ
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {staff.map((exec, i) => {
              const style = getLevelStyle(exec.level);
              return (
                <div
                  key={i}
                  className={`bg-white rounded-xl shadow-md border ${style.border} overflow-hidden hover:shadow-lg transition-shadow`}
                >
                  <div className={`h-40 bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                    <div className={`w-20 h-20 rounded-full ${style.avatarBg} shadow-inner flex items-center justify-center`}>
                      <Users className="w-9 h-9 text-blue-400" />
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">{exec.name}</h3>
                    <p className="text-[#2c5f8a] text-sm font-medium mt-1">{exec.position}</p>
                    <div className="flex flex-col items-center gap-1 mt-3 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{exec.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{exec.email}</span>
                      </div>
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
