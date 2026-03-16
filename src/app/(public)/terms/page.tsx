import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ข้อกำหนดและเงื่อนไขการใช้บริการ | Terms of Service',
  description: 'ข้อกำหนดและเงื่อนไขการใช้บริการเว็บไซต์ขององค์กรปกครองส่วนท้องถิ่น',
};

const sections = [
  { id: 'usage', title: 'การใช้เว็บไซต์' },
  { id: 'registration', title: 'การลงทะเบียน' },
  { id: 'liability', title: 'ข้อจำกัดความรับผิดชอบ' },
  { id: 'ip', title: 'ทรัพย์สินทางปัญญา' },
  { id: 'dispute', title: 'การระงับข้อพิพาท' },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ข้อกำหนดและเงื่อนไขการใช้บริการ</h1>
          <p className="text-blue-100 text-lg">Terms of Service</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <span>ข้อกำหนดและเงื่อนไข</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-28 bg-white rounded-xl shadow-md border border-gray-100 p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3">สารบัญ</h2>
              <nav>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors block py-0.5"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-xl shadow-md border border-gray-100 p-6 lg:p-10">
            <p className="text-sm text-gray-500 mb-6">
              ปรับปรุงล่าสุด: 1 มกราคม 2569
            </p>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                ข้อกำหนดและเงื่อนไขฉบับนี้ (&ldquo;ข้อกำหนด&rdquo;) ระบุเงื่อนไขในการเข้าใช้งานเว็บไซต์และบริการออนไลน์
                ขององค์กรปกครองส่วนท้องถิ่น (&ldquo;องค์กร&rdquo;) การเข้าใช้งานเว็บไซต์ถือว่าท่านยอมรับข้อกำหนดเหล่านี้
              </p>

              {/* Section 1 */}
              <h2 id="usage" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                1. การใช้เว็บไซต์
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>เว็บไซต์นี้จัดทำขึ้นเพื่อเผยแพร่ข้อมูลข่าวสารและให้บริการประชาชนตามอำนาจหน้าที่ขององค์กร</li>
                <li>ท่านต้องใช้เว็บไซต์ในลักษณะที่ถูกต้องตามกฎหมายและไม่ละเมิดสิทธิของผู้อื่น</li>
                <li>ห้ามใช้เว็บไซต์เพื่อวัตถุประสงค์ที่ผิดกฎหมาย เผยแพร่ข้อมูลอันเป็นเท็จ หรือกระทำการใดที่อาจก่อให้เกิดความเสียหายต่อระบบ</li>
                <li>ห้ามพยายามเข้าถึงระบบหรือข้อมูลโดยไม่ได้รับอนุญาต</li>
                <li>เราสงวนสิทธิ์ในการระงับหรือยกเลิกการเข้าถึงเว็บไซต์ของท่าน หากพบการใช้งานที่ไม่เหมาะสม</li>
              </ul>

              {/* Section 2 */}
              <h2 id="registration" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                2. การลงทะเบียน
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>บริการบางอย่างอาจกำหนดให้ท่านต้องลงทะเบียนและสร้างบัญชีผู้ใช้</li>
                <li>ท่านต้องให้ข้อมูลที่ถูกต้อง ครบถ้วน และเป็นปัจจุบันในการลงทะเบียน</li>
                <li>ท่านมีหน้าที่รักษาความปลอดภัยของบัญชีผู้ใช้ รหัสผ่าน และข้อมูลการเข้าสู่ระบบ</li>
                <li>ท่านต้องรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของท่าน</li>
                <li>หากพบว่ามีการใช้บัญชีของท่านโดยไม่ได้รับอนุญาต กรุณาแจ้งเราทันที</li>
                <li>เราสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีที่ให้ข้อมูลเท็จหรือใช้งานไม่เหมาะสม</li>
              </ul>

              {/* Section 3 */}
              <h2 id="liability" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                3. ข้อจำกัดความรับผิดชอบ
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  ข้อมูลบนเว็บไซต์นี้จัดทำขึ้นเพื่อเป็นข้อมูลทั่วไป แม้เราจะพยายามให้ข้อมูลถูกต้องและเป็นปัจจุบัน
                  แต่เราไม่รับประกันความถูกต้อง ครบถ้วน หรือทันสมัยของข้อมูลทุกรายการ
                </li>
                <li>
                  เราไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้ข้อมูลบนเว็บไซต์
                  หรือจากการที่เว็บไซต์ไม่สามารถใช้งานได้ชั่วคราว
                </li>
                <li>
                  ลิงก์ภายนอกที่ปรากฏบนเว็บไซต์เป็นเพียงการอำนวยความสะดวก
                  เราไม่รับผิดชอบต่อเนื้อหาหรือนโยบายของเว็บไซต์ภายนอก
                </li>
                <li>
                  การตัดสินใจหรือการดำเนินการใดๆ ที่อาศัยข้อมูลจากเว็บไซต์ เป็นความรับผิดชอบของท่าน
                  สำหรับข้อมูลที่เป็นทางการ กรุณาติดต่อสำนักงานโดยตรง
                </li>
              </ul>

              {/* Section 4 */}
              <h2 id="ip" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                4. ทรัพย์สินทางปัญญา
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  เนื้อหา ข้อความ รูปภาพ กราฟิก โลโก้ และสื่อต่างๆ บนเว็บไซต์เป็นทรัพย์สินขององค์กร
                  หรือผู้ที่ได้รับอนุญาตให้ใช้สิทธิ์
                </li>
                <li>
                  ห้ามทำซ้ำ ดัดแปลง เผยแพร่ หรือใช้เนื้อหาจากเว็บไซต์เพื่อวัตถุประสงค์เชิงพาณิชย์
                  โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร
                </li>
                <li>
                  อนุญาตให้ใช้ข้อมูลเพื่อการศึกษา การวิจัย หรือเพื่อประโยชน์สาธารณะ
                  โดยต้องอ้างอิงแหล่งที่มาอย่างถูกต้อง
                </li>
              </ul>

              {/* Section 5 */}
              <h2 id="dispute" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                5. การระงับข้อพิพาท
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>ข้อกำหนดฉบับนี้อยู่ภายใต้กฎหมายแห่งราชอาณาจักรไทย</li>
                <li>
                  หากเกิดข้อพิพาทใดๆ เกี่ยวกับการใช้เว็บไซต์ คู่สัญญาจะพยายามระงับข้อพิพาทโดยการเจรจาไกล่เกลี่ยก่อน
                </li>
                <li>
                  หากไม่สามารถตกลงกันได้ ข้อพิพาทจะถูกส่งไปยังศาลที่มีเขตอำนาจตามกฎหมายไทย
                </li>
              </ul>

              <div className="mt-10 p-5 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  หากท่านมีข้อสงสัยเกี่ยวกับข้อกำหนดและเงื่อนไขเหล่านี้ สามารถติดต่อสอบถามได้ที่สำนักงานเทศบาล/อบต.
                  หรือส่งอีเมลมาที่ info@example.go.th
                </p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4">
              <Link
                href="/privacy"
                className="text-blue-600 hover:underline text-sm"
              >
                นโยบายความเป็นส่วนตัว
              </Link>
              <Link
                href="/"
                className="text-blue-600 hover:underline text-sm"
              >
                กลับหน้าแรก
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
