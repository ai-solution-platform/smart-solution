'use client';

import Link from 'next/link';
import {
  Database,
  Download,
  ExternalLink,
  Calendar,
  FileSpreadsheet,
  Users,
  Landmark,
  ShoppingCart,
  Droplets,
  Map,
  BarChart3,
  Globe,
  Search,
  Info,
} from 'lucide-react';

interface Dataset {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  formats: string[];
  lastUpdated: string;
  downloads: number;
  category: string;
}

const datasets: Dataset[] = [
  {
    id: 1,
    title: 'งบประมาณรายรับ-รายจ่าย',
    description:
      'ข้อมูลงบประมาณรายรับ-รายจ่ายประจำปีของเทศบาลตำบลสมาร์ทซิตี้ จำแนกตามหมวดรายรับรายจ่าย และแผนงาน',
    icon: FileSpreadsheet,
    formats: ['XLSX', 'CSV', 'PDF'],
    lastUpdated: '15 ก.พ. 2569',
    downloads: 1234,
    category: 'การเงิน',
  },
  {
    id: 2,
    title: 'สถิติประชากร',
    description:
      'ข้อมูลสถิติประชากรในเขตเทศบาล จำแนกตามเพศ ช่วงอายุ ชุมชน จำนวนครัวเรือน และการเปลี่ยนแปลงรายปี',
    icon: Users,
    formats: ['CSV', 'XLSX'],
    lastUpdated: '1 ม.ค. 2569',
    downloads: 892,
    category: 'ประชากร',
  },
  {
    id: 3,
    title: 'โครงการพัฒนาท้องถิ่น',
    description:
      'รายละเอียดโครงการพัฒนาท้องถิ่นทั้งหมด สถานะการดำเนินงาน งบประมาณ ระยะเวลา และผลการดำเนินโครงการ',
    icon: Landmark,
    formats: ['CSV', 'PDF'],
    lastUpdated: '28 ก.พ. 2569',
    downloads: 567,
    category: 'โครงการ',
  },
  {
    id: 4,
    title: 'ผลการจัดซื้อจัดจ้าง',
    description:
      'ข้อมูลผลการจัดซื้อจัดจ้างประจำปี รายละเอียดสัญญา ผู้รับจ้าง วงเงิน และสถานะการดำเนินการ',
    icon: ShoppingCart,
    formats: ['XLSX', 'CSV', 'PDF'],
    lastUpdated: '10 มี.ค. 2569',
    downloads: 2156,
    category: 'จัดซื้อจัดจ้าง',
  },
  {
    id: 5,
    title: 'คุณภาพน้ำ/อากาศ',
    description:
      'ข้อมูลการตรวจวัดคุณภาพน้ำและอากาศในพื้นที่เทศบาล ค่า PM2.5 คุณภาพน้ำประปา และน้ำเสีย รายเดือน',
    icon: Droplets,
    formats: ['CSV', 'XLSX'],
    lastUpdated: '1 มี.ค. 2569',
    downloads: 445,
    category: 'สิ่งแวดล้อม',
  },
  {
    id: 6,
    title: 'แผนพัฒนาท้องถิ่น',
    description:
      'แผนพัฒนาท้องถิ่น 5 ปี (พ.ศ. 2566-2570) วิสัยทัศน์ ยุทธศาสตร์ แผนงาน และตัวชี้วัดความสำเร็จ',
    icon: Map,
    formats: ['PDF'],
    lastUpdated: '15 ธ.ค. 2568',
    downloads: 789,
    category: 'แผนงาน',
  },
];

const formatColors: Record<string, string> = {
  CSV: 'bg-green-100 text-green-700',
  XLSX: 'bg-blue-100 text-blue-700',
  PDF: 'bg-red-100 text-red-700',
};

export default function OpenDataPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ข้อมูลเปิดภาครัฐ</h1>
          <p className="text-blue-100 text-lg">
            Open Government Data - เทศบาลตำบลสมาร์ทซิตี้เปิดเผยข้อมูลเพื่อความโปร่งใส
            และส่งเสริมการมีส่วนร่วมของประชาชน
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">
              หน้าแรก
            </Link>
            <span>/</span>
            <span>ข้อมูลเปิดภาครัฐ</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Open Data */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ข้อมูลเปิดภาครัฐคืออะไร?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                ข้อมูลเปิดภาครัฐ (Open Government Data)
                คือข้อมูลที่หน่วยงานราชการเปิดเผยให้ประชาชนสามารถเข้าถึง ใช้งาน
                และนำไปต่อยอดได้อย่างเสรี โดยอยู่ในรูปแบบที่เครื่องสามารถอ่านได้ (Machine Readable)
                ตามนโยบายรัฐบาลดิจิทัล และพระราชบัญญัติข้อมูลข่าวสารของราชการ พ.ศ. 2540
              </p>
              <p className="text-gray-600 leading-relaxed">
                เทศบาลตำบลสมาร์ทซิตี้มุ่งมั่นเปิดเผยข้อมูลสาธารณะเพื่อส่งเสริมความโปร่งใส
                ตรวจสอบได้ และสนับสนุนการมีส่วนร่วมของภาคประชาชนในการพัฒนาท้องถิ่น
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">6</p>
            <p className="text-sm text-gray-500">ชุดข้อมูลทั้งหมด</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">6,083</p>
            <p className="text-sm text-gray-500">ดาวน์โหลดทั้งหมด</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">มี.ค. 69</p>
            <p className="text-sm text-gray-500">อัปเดตล่าสุด</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาชุดข้อมูล..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c5f8a] focus:border-transparent shadow-sm"
              readOnly
            />
          </div>
        </div>

        {/* Dataset Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#1e3a5f]" />
            ชุดข้อมูลที่เปิดเผย
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset) => {
              const Icon = dataset.icon;
              return (
                <div
                  key={dataset.id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#1e3a5f]" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          {dataset.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">{dataset.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {dataset.description}
                    </p>

                    {/* Format Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dataset.formats.map((format) => (
                        <span
                          key={format}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${formatColors[format] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {format}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        อัปเดต: {dataset.lastUpdated}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        {dataset.downloads.toLocaleString()} ครั้ง
                      </span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="px-6 pb-6">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white py-2.5 rounded-lg font-medium hover:bg-[#2c5f8a] transition-colors text-sm">
                      <Download className="w-4 h-4" />
                      ดาวน์โหลดข้อมูล
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-10">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">เงื่อนไขการใช้ข้อมูล</h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                ข้อมูลทั้งหมดเผยแพร่ภายใต้สัญญาอนุญาตครีเอทีฟคอมมอนส์แบบแสดงที่มา (CC BY)
                สามารถนำไปใช้ได้อย่างเสรี โดยต้องอ้างอิงแหล่งที่มาว่า
                &quot;เทศบาลตำบลสมาร์ทซิตี้&quot; ข้อมูลอาจมีการปรับปรุงโดยไม่แจ้งให้ทราบล่วงหน้า
              </p>
            </div>
          </div>
        </div>

        {/* data.go.th CTA */}
        <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2c5f8a] rounded-2xl p-8 md:p-12 text-center text-white">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-3">ศูนย์กลางข้อมูลเปิดภาครัฐ</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            เข้าถึงข้อมูลเปิดภาครัฐจากทุกหน่วยงานได้ที่ศูนย์กลางข้อมูลเปิดภาครัฐ (data.go.th)
            แพลตฟอร์มข้อมูลเปิดของประเทศไทย
          </p>
          <a
            href="https://data.go.th"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#1e3a5f] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            เยี่ยมชม data.go.th
          </a>
        </div>
      </div>
    </div>
  );
}
