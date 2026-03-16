import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว | Privacy Policy',
  description: 'นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)',
};

const sections = [
  { id: 'data-collected', title: 'ข้อมูลที่เราเก็บรวบรวม' },
  { id: 'purpose', title: 'วัตถุประสงค์ในการเก็บข้อมูล' },
  { id: 'cookies', title: 'การใช้คุกกี้' },
  { id: 'rights', title: 'สิทธิของเจ้าของข้อมูล' },
  { id: 'security', title: 'การรักษาความปลอดภัย' },
  { id: 'third-party', title: 'การเปิดเผยข้อมูลแก่บุคคลภายนอก' },
  { id: 'dpo', title: 'ช่องทางติดต่อ DPO' },
  { id: 'changes', title: 'การเปลี่ยนแปลงนโยบาย' },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">นโยบายความเป็นส่วนตัว</h1>
          <p className="text-blue-100 text-lg">Privacy Policy</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-200">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <span>นโยบายความเป็นส่วนตัว</span>
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
                เทศบาล/องค์การบริหารส่วนตำบล (&ldquo;องค์กร&rdquo;) ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน
                ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) นโยบายฉบับนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม
                ใช้ เปิดเผย และปกป้องข้อมูลส่วนบุคคลของท่านเมื่อใช้งานเว็บไซต์และบริการของเรา
              </p>

              {/* Section 1 */}
              <h2 id="data-collected" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                1. ข้อมูลที่เราเก็บรวบรวม
              </h2>
              <p className="text-gray-700">เราอาจเก็บรวบรวมข้อมูลส่วนบุคคลของท่านดังต่อไปนี้:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>ข้อมูลที่ท่านให้โดยตรง เช่น ชื่อ-นามสกุล หมายเลขบัตรประชาชน ที่อยู่ หมายเลขโทรศัพท์ อีเมล</li>
                <li>ข้อมูลจากการใช้งานเว็บไซต์ เช่น IP Address ประเภทเบราว์เซอร์ หน้าเว็บที่เข้าชม ระยะเวลาการใช้งาน</li>
                <li>ข้อมูลจากการลงทะเบียนใช้บริการออนไลน์ เช่น ข้อมูลการร้องเรียน การขอรับบริการ</li>
                <li>ข้อมูลจากคุกกี้และเทคโนโลยีที่คล้ายกัน</li>
              </ul>

              {/* Section 2 */}
              <h2 id="purpose" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                2. วัตถุประสงค์ในการเก็บข้อมูล
              </h2>
              <p className="text-gray-700">เราเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ดังต่อไปนี้:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>เพื่อให้บริการสาธารณะตามอำนาจหน้าที่ขององค์กร</li>
                <li>เพื่อดำเนินการตามคำร้องขอและเรื่องร้องเรียนของท่าน</li>
                <li>เพื่อสื่อสารและแจ้งข้อมูลข่าวสารที่เกี่ยวข้อง</li>
                <li>เพื่อปรับปรุงคุณภาพการให้บริการและพัฒนาเว็บไซต์</li>
                <li>เพื่อปฏิบัติตามกฎหมายและระเบียบที่เกี่ยวข้อง</li>
                <li>เพื่อการวิเคราะห์เชิงสถิติและการวางแผนพัฒนาท้องถิ่น</li>
              </ul>

              {/* Section 3 */}
              <h2 id="cookies" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                3. การใช้คุกกี้
              </h2>
              <p className="text-gray-700">
                เว็บไซต์ของเราใช้คุกกี้และเทคโนโลยีที่คล้ายกันเพื่อปรับปรุงประสบการณ์การใช้งาน
                คุกกี้ที่เราใช้แบ่งเป็นประเภทดังนี้:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>
                  <strong>คุกกี้ที่จำเป็น (Necessary Cookies):</strong> จำเป็นสำหรับการทำงานของเว็บไซต์
                  ไม่สามารถปิดการใช้งานได้
                </li>
                <li>
                  <strong>คุกกี้เพื่อการวิเคราะห์ (Analytics Cookies):</strong> ใช้เพื่อวิเคราะห์พฤติกรรมการใช้งาน
                  ช่วยให้เราปรับปรุงเว็บไซต์ได้ดีขึ้น
                </li>
                <li>
                  <strong>คุกกี้เพื่อการตลาด (Marketing Cookies):</strong> ใช้เพื่อแสดงเนื้อหาและประชาสัมพันธ์ที่ตรงกับความสนใจ
                </li>
              </ul>
              <p className="text-gray-700 mt-2">
                ท่านสามารถจัดการการตั้งค่าคุกกี้ได้ผ่านแบนเนอร์การยินยอมคุกกี้เมื่อเข้าใช้งานเว็บไซต์
              </p>

              {/* Section 4 */}
              <h2 id="rights" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                4. สิทธิของเจ้าของข้อมูล
              </h2>
              <p className="text-gray-700">
                ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ท่านมีสิทธิดังต่อไปนี้:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li><strong>สิทธิในการเข้าถึงข้อมูล:</strong> ท่านมีสิทธิขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคลของท่าน</li>
                <li><strong>สิทธิในการแก้ไขข้อมูล:</strong> ท่านมีสิทธิขอให้แก้ไขข้อมูลส่วนบุคคลที่ไม่ถูกต้องหรือไม่สมบูรณ์</li>
                <li><strong>สิทธิในการลบข้อมูล:</strong> ท่านมีสิทธิขอให้ลบหรือทำลายข้อมูลส่วนบุคคล เว้นแต่กรณีที่กฎหมายกำหนดให้เก็บรักษา</li>
                <li><strong>สิทธิในการระงับการใช้ข้อมูล:</strong> ท่านมีสิทธิขอให้ระงับการใช้ข้อมูลส่วนบุคคลในบางกรณี</li>
                <li><strong>สิทธิในการคัดค้าน:</strong> ท่านมีสิทธิคัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล</li>
                <li><strong>สิทธิในการโอนย้ายข้อมูล:</strong> ท่านมีสิทธิขอรับข้อมูลส่วนบุคคลในรูปแบบที่สามารถอ่านหรือใช้งานได้ทั่วไป</li>
                <li><strong>สิทธิในการถอนความยินยอม:</strong> ท่านมีสิทธิถอนความยินยอมที่เคยให้ไว้ได้ตลอดเวลา</li>
                <li><strong>สิทธิในการร้องเรียน:</strong> ท่านมีสิทธิร้องเรียนต่อคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล</li>
              </ul>
              <p className="text-gray-700 mt-2">
                หากท่านต้องการใช้สิทธิดังกล่าว สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) ตามช่องทางด้านล่าง
              </p>

              {/* Section 5 */}
              <h2 id="security" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                5. การรักษาความปลอดภัย
              </h2>
              <p className="text-gray-700">
                เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลส่วนบุคคลของท่าน ได้แก่:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>การเข้ารหัสข้อมูลด้วย SSL/TLS ในการรับส่งข้อมูลผ่านเว็บไซต์</li>
                <li>การจำกัดสิทธิการเข้าถึงข้อมูลเฉพาะเจ้าหน้าที่ที่เกี่ยวข้อง</li>
                <li>การตรวจสอบและทบทวนมาตรการรักษาความปลอดภัยอย่างสม่ำเสมอ</li>
                <li>การสำรองข้อมูลเพื่อป้องกันการสูญหาย</li>
              </ul>

              {/* Section 6 */}
              <h2 id="third-party" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                6. การเปิดเผยข้อมูลแก่บุคคลภายนอก
              </h2>
              <p className="text-gray-700">
                เราอาจเปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลภายนอกในกรณีต่อไปนี้:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>หน่วยงานราชการที่เกี่ยวข้องตามอำนาจหน้าที่ตามกฎหมาย</li>
                <li>ผู้ให้บริการที่ได้รับมอบหมายให้ดำเนินการแทน โดยมีข้อตกลงในการคุ้มครองข้อมูล</li>
                <li>กรณีที่กฎหมายกำหนดหรือตามคำสั่งศาล</li>
                <li>เพื่อปกป้องสิทธิ ทรัพย์สิน หรือความปลอดภัยขององค์กรหรือประชาชน</li>
              </ul>

              {/* Section 7 */}
              <h2 id="dpo" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                7. ช่องทางติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)
              </h2>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mt-3">
                <p className="text-gray-700 font-medium">เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (Data Protection Officer)</p>
                <ul className="text-gray-700 mt-2 space-y-1 text-sm">
                  <li>สถานที่: สำนักงานเทศบาล/อบต.</li>
                  <li>อีเมล: dpo@example.go.th</li>
                  <li>โทรศัพท์: 0-2xxx-xxxx</li>
                  <li>เวลาทำการ: จันทร์ - ศุกร์ เวลา 08:30 - 16:30 น.</li>
                </ul>
              </div>

              {/* Section 8 */}
              <h2 id="changes" className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-32">
                8. การเปลี่ยนแปลงนโยบาย
              </h2>
              <p className="text-gray-700">
                เราอาจปรับปรุงนโยบายความเป็นส่วนตัวฉบับนี้เป็นครั้งคราว เพื่อให้สอดคล้องกับการเปลี่ยนแปลงของกฎหมาย
                และแนวปฏิบัติขององค์กร หากมีการเปลี่ยนแปลงที่สำคัญ เราจะแจ้งให้ท่านทราบผ่านทางเว็บไซต์
                ท่านสามารถตรวจสอบวันที่ปรับปรุงล่าสุดได้ที่ด้านบนของหน้านี้
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200">
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
