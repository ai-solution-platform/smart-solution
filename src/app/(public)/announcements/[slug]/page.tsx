'use client';

import { useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import {
  Calendar,
  Download,
  FileText,
  ArrowLeft,
  Share2,
  Facebook,
  Link2,
  Printer,
  Eye,
  Tag,
} from 'lucide-react';

const allAnnouncements: Record<
  string,
  {
    title: string;
    category: string;
    date: string;
    department: string;
    views: number;
    content: string;
    tags: string[];
    attachments: { name: string; size: string; type: string }[];
  }
> = {
  'tax-payment-2568': {
    title: 'ประกาศเทศบาลตำบลสมาร์ทซิตี้ เรื่อง การชำระภาษีที่ดินและสิ่งปลูกสร้าง ประจำปี 2568',
    category: 'ภาษี',
    date: '15 มีนาคม 2568',
    department: 'กองคลัง เทศบาลตำบลสมาร์ทซิตี้',
    views: 580,
    tags: ['ภาษี', 'ที่ดินและสิ่งปลูกสร้าง', 'กองคลัง', 'ประจำปี 2568'],
    attachments: [
      { name: 'ประกาศภาษีที่ดิน_2568.pdf', size: '1.2 MB', type: 'pdf' },
      { name: 'แบบฟอร์มชำระภาษี.pdf', size: '245 KB', type: 'pdf' },
      { name: 'อัตราภาษีที่ดิน_2568.xlsx', size: '320 KB', type: 'xlsx' },
    ],
    content: `
      <p>ด้วยเทศบาลตำบลสมาร์ทซิตี้ จะดำเนินการจัดเก็บภาษีที่ดินและสิ่งปลูกสร้าง ประจำปี พ.ศ. 2568 ตามพระราชบัญญัติภาษีที่ดินและสิ่งปลูกสร้าง พ.ศ. 2562 จึงขอประกาศให้เจ้าของที่ดินและสิ่งปลูกสร้างทราบ ดังนี้</p>

      <h2>1. กำหนดการชำระภาษี</h2>
      <ul>
        <li>เริ่มชำระภาษีได้ตั้งแต่ เดือนเมษายน 2568 ถึง เดือนมิถุนายน 2568</li>
        <li>หากชำระภาษีภายในเดือนเมษายน 2568 จะได้รับส่วนลด 10%</li>
        <li>หากไม่ชำระภาษีภายในกำหนด จะต้องชำระเงินเพิ่มอัตราร้อยละ 1 ต่อเดือน</li>
      </ul>

      <h2>2. สถานที่ชำระภาษี</h2>
      <p>กองคลัง เทศบาลตำบลสมาร์ทซิตี้ เลขที่ 999 ถนนเทศบาล 1 ตำบลสมาร์ทซิตี้ อำเภอเมือง จังหวัดสมาร์ท ในวันและเวลาราชการ (จันทร์-ศุกร์ เวลา 08.30-16.30 น.)</p>

      <h2>3. ช่องทางการชำระภาษี</h2>
      <ul>
        <li>ชำระด้วยตนเอง ณ กองคลัง เทศบาลตำบลสมาร์ทซิตี้</li>
        <li>ชำระผ่านธนาคารกรุงไทย ทุกสาขา</li>
        <li>ชำระผ่านระบบ QR Payment</li>
        <li>ชำระผ่านระบบออนไลน์ทางเว็บไซต์เทศบาล</li>
      </ul>

      <h2>4. เอกสารที่ต้องนำมา</h2>
      <ul>
        <li>สำเนาบัตรประจำตัวประชาชน</li>
        <li>สำเนาทะเบียนบ้าน</li>
        <li>หนังสือแจ้งประเมินภาษี (ถ้ามี)</li>
        <li>เอกสารสิทธิ์ที่ดิน (ถ้ามี)</li>
      </ul>

      <h2>5. สอบถามรายละเอียดเพิ่มเติม</h2>
      <p>กองคลัง เทศบาลตำบลสมาร์ทซิตี้ โทร. 02-XXX-XXXX ต่อ 201-203 ในวันและเวลาราชการ</p>

      <p>จึงประกาศมาให้ทราบโดยทั่วกัน</p>
      <p class="mt-8 text-right">ประกาศ ณ วันที่ 15 มีนาคม พ.ศ. 2568</p>
      <p class="text-right">(นายสมชาย รักเมือง)</p>
      <p class="text-right">นายกเทศมนตรีตำบลสมาร์ทซิตี้</p>
    `,
  },
  'recruitment-engineer-2568': {
    title: 'ประกาศรับสมัครสอบคัดเลือกพนักงานเทศบาล ตำแหน่ง วิศวกรโยธา จำนวน 2 อัตรา',
    category: 'รับสมัครงาน',
    date: '12 มีนาคม 2568',
    department: 'กองช่าง เทศบาลตำบลสมาร์ทซิตี้',
    views: 1200,
    tags: ['รับสมัครงาน', 'วิศวกรโยธา', 'กองช่าง'],
    attachments: [
      { name: 'ประกาศรับสมัคร_วิศวกร.pdf', size: '890 KB', type: 'pdf' },
      { name: 'ใบสมัคร.pdf', size: '150 KB', type: 'pdf' },
    ],
    content: `
      <p>ด้วยเทศบาลตำบลสมาร์ทซิตี้ มีความประสงค์จะรับสมัครสอบคัดเลือกบุคคลเพื่อบรรจุเป็นพนักงานเทศบาล ตำแหน่ง วิศวกรโยธา จำนวน 2 อัตรา</p>

      <h2>คุณสมบัติผู้สมัคร</h2>
      <ul>
        <li>สัญชาติไทย</li>
        <li>อายุไม่ต่ำกว่า 18 ปีบริบูรณ์</li>
        <li>วุฒิการศึกษาไม่ต่ำกว่าปริญญาตรี สาขาวิศวกรรมโยธา</li>
        <li>มีใบอนุญาตประกอบวิชาชีพวิศวกรรม (กว.)</li>
      </ul>

      <h2>การรับสมัคร</h2>
      <p>เปิดรับสมัครตั้งแต่วันที่ 15 มีนาคม - 15 เมษายน 2568 ในวันและเวลาราชการ ณ กองช่าง เทศบาลตำบลสมาร์ทซิตี้</p>

      <h2>เอกสารหลักฐานที่ต้องใช้</h2>
      <ul>
        <li>ใบสมัครตามแบบที่กำหนด</li>
        <li>สำเนาบัตรประจำตัวประชาชน</li>
        <li>สำเนาทะเบียนบ้าน</li>
        <li>สำเนาวุฒิการศึกษา</li>
        <li>สำเนาใบอนุญาตประกอบวิชาชีพ</li>
        <li>รูปถ่ายขนาด 1 นิ้ว จำนวน 3 รูป</li>
      </ul>
    `,
  },
  'water-supply-maintenance': {
    title: 'แจ้งหยุดจ่ายน้ำประปาชั่วคราว เพื่อซ่อมบำรุงระบบ วันที่ 20-21 มีนาคม 2568',
    category: 'ประกาศทั่วไป',
    date: '10 มีนาคม 2568',
    department: 'กองช่าง เทศบาลตำบลสมาร์ทซิตี้',
    views: 950,
    tags: ['ประปา', 'ซ่อมบำรุง', 'แจ้งเตือน'],
    attachments: [],
    content: `
      <p>เทศบาลตำบลสมาร์ทซิตี้ ขอแจ้งหยุดจ่ายน้ำประปาชั่วคราว เพื่อดำเนินการซ่อมบำรุงระบบประปาและเปลี่ยนท่อส่งน้ำ</p>

      <h2>รายละเอียด</h2>
      <ul>
        <li>วันที่หยุดจ่ายน้ำ: 20-21 มีนาคม 2568</li>
        <li>เวลา: 08.00 - 17.00 น.</li>
        <li>พื้นที่ได้รับผลกระทบ: ชุมชนที่ 3, 5, 7 และ 9</li>
      </ul>

      <p>ขอให้ประชาชนในพื้นที่ดังกล่าวสำรองน้ำไว้ใช้ล่วงหน้า เทศบาลต้องขออภัยในความไม่สะดวก</p>
      <p>สอบถามข้อมูลเพิ่มเติม โทร. 02-XXX-XXXX ต่อ 401</p>
    `,
  },
  'building-permit-regulation': {
    title: 'ข้อบัญญัติเทศบาล เรื่อง การควบคุมอาคาร พ.ศ. 2568',
    category: 'ข้อบัญญัติ/ระเบียบ',
    date: '8 มีนาคม 2568',
    department: 'กองช่าง เทศบาลตำบลสมาร์ทซิตี้',
    views: 420,
    tags: ['ข้อบัญญัติ', 'ควบคุมอาคาร', 'ก่อสร้าง'],
    attachments: [
      { name: 'ข้อบัญญัติควบคุมอาคาร_2568.pdf', size: '2.5 MB', type: 'pdf' },
    ],
    content: `
      <p>อาศัยอำนาจตามความในพระราชบัญญัติเทศบาล พ.ศ. 2496 และพระราชบัญญัติควบคุมอาคาร พ.ศ. 2522 เทศบาลตำบลสมาร์ทซิตี้ จึงออกข้อบัญญัติว่าด้วยการควบคุมอาคารไว้ดังต่อไปนี้</p>

      <h2>สาระสำคัญ</h2>
      <ul>
        <li>การขออนุญาตก่อสร้างอาคารใหม่</li>
        <li>การขออนุญาตดัดแปลงอาคาร</li>
        <li>มาตรฐานความปลอดภัยของอาคาร</li>
        <li>บทกำหนดโทษ</li>
      </ul>

      <p>ประชาชนสามารถศึกษารายละเอียดได้จากเอกสารแนบ หรือสอบถามเพิ่มเติมที่กองช่าง โทร. 02-XXX-XXXX ต่อ 401</p>
    `,
  },
  'scholarship-result-2568': {
    title: 'ประกาศผลการคัดเลือกนักเรียนรับทุนการศึกษา ประจำปีการศึกษา 2568',
    category: 'ประกาศผล',
    date: '5 มีนาคม 2568',
    department: 'กองการศึกษา เทศบาลตำบลสมาร์ทซิตี้',
    views: 780,
    tags: ['ทุนการศึกษา', 'ประกาศผล', 'การศึกษา'],
    attachments: [
      { name: 'ผลทุนการศึกษา_2568.pdf', size: '450 KB', type: 'pdf' },
    ],
    content: `
      <p>ตามที่เทศบาลตำบลสมาร์ทซิตี้ ได้ดำเนินการคัดเลือกนักเรียนเพื่อรับทุนการศึกษา ประจำปีการศึกษา 2568 นั้น บัดนี้การคัดเลือกได้เสร็จสิ้นแล้ว จึงขอประกาศผลดังนี้</p>

      <h2>ทุนการศึกษาระดับประถมศึกษา</h2>
      <p>จำนวน 20 ทุน ทุนละ 3,000 บาท</p>

      <h2>ทุนการศึกษาระดับมัธยมศึกษา</h2>
      <p>จำนวน 15 ทุน ทุนละ 5,000 บาท</p>

      <h2>ทุนการศึกษาระดับอุดมศึกษา</h2>
      <p>จำนวน 10 ทุน ทุนละ 10,000 บาท</p>

      <p>รายชื่อผู้ได้รับทุนการศึกษาตามเอกสารแนบ กำหนดรับทุนในวันที่ 20 มีนาคม 2568 ณ ห้องประชุมเทศบาลตำบลสมาร์ทซิตี้</p>
    `,
  },
  'market-permit-renewal': {
    title: 'แจ้งการต่ออายุใบอนุญาตประกอบกิจการตลาด ประจำปี 2568',
    category: 'ประกาศทั่วไป',
    date: '1 มีนาคม 2568',
    department: 'กองสาธารณสุขและสิ่งแวดล้อม',
    views: 340,
    tags: ['ใบอนุญาต', 'ตลาด', 'ต่ออายุ'],
    attachments: [
      { name: 'แบบฟอร์มต่อใบอนุญาต.pdf', size: '180 KB', type: 'pdf' },
    ],
    content: `
      <p>เทศบาลตำบลสมาร์ทซิตี้ ขอแจ้งให้ผู้ประกอบกิจการตลาดในเขตเทศบาลทราบว่า ใบอนุญาตประกอบกิจการตลาดจะหมดอายุในวันที่ 30 เมษายน 2568</p>

      <p>ขอให้ผู้ประกอบการดำเนินการต่ออายุใบอนุญาตภายในวันที่ 30 เมษายน 2568 ณ กองสาธารณสุขฯ เทศบาลตำบลสมาร์ทซิตี้</p>
    `,
  },
  'waste-collection-schedule': {
    title: 'ประกาศตารางเก็บขยะมูลฝอยประจำเดือนเมษายน 2568',
    category: 'ประกาศทั่วไป',
    date: '28 กุมภาพันธ์ 2568',
    department: 'กองสาธารณสุขและสิ่งแวดล้อม',
    views: 290,
    tags: ['ขยะ', 'ตารางเก็บขยะ', 'สาธารณสุข'],
    attachments: [
      { name: 'ตารางเก็บขยะ_เมย68.pdf', size: '560 KB', type: 'pdf' },
    ],
    content: `
      <p>เทศบาลตำบลสมาร์ทซิตี้ ขอประกาศตารางการจัดเก็บขยะมูลฝอย ประจำเดือนเมษายน 2568 ดังรายละเอียดตามเอกสารแนบ</p>

      <p>ขอความร่วมมือประชาชนนำขยะออกวางตามจุดที่กำหนดก่อนเวลา 06.00 น. ของวันเก็บขยะ</p>
    `,
  },
  'recruitment-teacher-result': {
    title: 'ประกาศผลสอบคัดเลือกพนักงานจ้าง ตำแหน่ง ผู้ช่วยครูผู้ดูแลเด็ก',
    category: 'ประกาศผล',
    date: '25 กุมภาพันธ์ 2568',
    department: 'กองการศึกษา เทศบาลตำบลสมาร์ทซิตี้',
    views: 650,
    tags: ['ประกาศผล', 'รับสมัครงาน', 'ครูผู้ดูแลเด็ก'],
    attachments: [
      { name: 'ผลสอบครูผู้ดูแลเด็ก.pdf', size: '320 KB', type: 'pdf' },
    ],
    content: `
      <p>ตามที่เทศบาลตำบลสมาร์ทซิตี้ ได้ดำเนินการสอบคัดเลือกพนักงานจ้าง ตำแหน่ง ผู้ช่วยครูผู้ดูแลเด็ก จำนวน 3 อัตรา นั้น บัดนี้การสอบคัดเลือกเสร็จสิ้นแล้ว</p>

      <p>รายชื่อผู้ผ่านการคัดเลือกตามเอกสารแนบ กำหนดรายงานตัวในวันที่ 10 มีนาคม 2568</p>
    `,
  },
  'business-tax-regulation': {
    title: 'ข้อบัญญัติเทศบาล เรื่อง การจัดเก็บภาษีป้าย พ.ศ. 2568',
    category: 'ข้อบัญญัติ/ระเบียบ',
    date: '20 กุมภาพันธ์ 2568',
    department: 'กองคลัง เทศบาลตำบลสมาร์ทซิตี้',
    views: 310,
    tags: ['ข้อบัญญัติ', 'ภาษีป้าย', 'กองคลัง'],
    attachments: [
      { name: 'ข้อบัญญัติภาษีป้าย_2568.pdf', size: '1.8 MB', type: 'pdf' },
    ],
    content: `
      <p>อาศัยอำนาจตามพระราชบัญญัติภาษีป้าย พ.ศ. 2510 และที่แก้ไขเพิ่มเติม เทศบาลตำบลสมาร์ทซิตี้ จึงออกข้อบัญญัติว่าด้วยการจัดเก็บภาษีป้ายดังต่อไปนี้</p>

      <h2>อัตราภาษีป้าย</h2>
      <ul>
        <li>ป้ายที่มีอักษรไทยล้วน - อัตรา 5 บาท ต่อ 500 ตร.ซม.</li>
        <li>ป้ายที่มีอักษรไทยปนอักษรต่างประเทศ - อัตรา 26 บาท ต่อ 500 ตร.ซม.</li>
        <li>ป้ายที่ไม่มีอักษรไทย หรือป้ายที่มีอักษรไทยบางส่วน - อัตรา 52 บาท ต่อ 500 ตร.ซม.</li>
      </ul>

      <p>กำหนดชำระภาษีป้ายภายในเดือนมีนาคมของทุกปี</p>
    `,
  },
  'recruitment-nurse': {
    title: 'ประกาศรับสมัครพนักงานจ้างทั่วไป ตำแหน่ง ผู้ช่วยเจ้าพนักงานสาธารณสุข',
    category: 'รับสมัครงาน',
    date: '18 กุมภาพันธ์ 2568',
    department: 'กองสาธารณสุขและสิ่งแวดล้อม',
    views: 890,
    tags: ['รับสมัครงาน', 'สาธารณสุข', 'พนักงานจ้าง'],
    attachments: [
      { name: 'ประกาศรับสมัคร_สาธารณสุข.pdf', size: '720 KB', type: 'pdf' },
    ],
    content: `
      <p>เทศบาลตำบลสมาร์ทซิตี้ ประสงค์จะรับสมัครบุคคลเพื่อจ้างเป็นพนักงานจ้างทั่วไป ตำแหน่ง ผู้ช่วยเจ้าพนักงานสาธารณสุข จำนวน 1 อัตรา</p>

      <h2>คุณสมบัติ</h2>
      <ul>
        <li>วุฒิการศึกษาไม่ต่ำกว่าประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) สาขาสาธารณสุข</li>
        <li>มีความรู้ความสามารถในงานสาธารณสุข</li>
      </ul>

      <p>รับสมัครตั้งแต่วันที่ 20 กุมภาพันธ์ - 20 มีนาคม 2568</p>
    `,
  },
};

const defaultRelated = [
  { slug: 'tax-payment-2568', title: 'การชำระภาษีที่ดินและสิ่งปลูกสร้าง ประจำปี 2568', date: '2568-03-15' },
  { slug: 'recruitment-engineer-2568', title: 'รับสมัครสอบคัดเลือก ตำแหน่ง วิศวกรโยธา', date: '2568-03-12' },
];

export default function AnnouncementDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [copied, setCopied] = useState(false);

  const announcementData = allAnnouncements[slug];
  const relatedAnnouncements = defaultRelated.filter((a) => a.slug !== slug).slice(0, 2);

  if (!announcementData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
              <Link href="/" className="hover:text-white">หน้าแรก</Link>
              <span>/</span>
              <Link href="/announcements" className="hover:text-white">ประกาศ</Link>
              <span>/</span>
              <span className="text-white">ไม่พบประกาศ</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">ไม่พบประกาศที่ต้องการ</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-gray-500 mb-6">ไม่พบประกาศที่คุณต้องการ หรืออาจถูกลบออกแล้ว</p>
          <Link
            href="/announcements"
            className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าประกาศ
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const getFileIcon = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'bg-red-100 text-red-600',
      xlsx: 'bg-green-100 text-green-600',
      doc: 'bg-blue-100 text-blue-600',
      docx: 'bg-blue-100 text-blue-600',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <Link href="/announcements" className="hover:text-white">ประกาศ</Link>
            <span>/</span>
            <span className="text-white">รายละเอียด</span>
          </div>
          <span className="inline-block bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium mb-3">
            {announcementData.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold leading-relaxed">
            {announcementData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-blue-200">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {announcementData.date}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {announcementData.department}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {announcementData.views.toLocaleString()} ครั้ง
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-gray-200">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            แชร์:
          </span>
          <button
            onClick={handleShareFacebook}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
          >
            <Link2 className="w-4 h-4" />
            {copied ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
          >
            <Printer className="w-4 h-4" />
            พิมพ์
          </button>
        </div>

        {/* Article Content */}
        <article
          className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 mb-8"
          dangerouslySetInnerHTML={{ __html: announcementData.content }}
        />

        {/* Attachments */}
        {announcementData.attachments.length > 0 && (
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              เอกสารแนบ
            </h3>
            <div className="space-y-3">
              {announcementData.attachments.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white rounded-lg p-4 border border-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileIcon(
                        file.type
                      )}`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{file.name}</p>
                      <p className="text-xs text-gray-400">{file.size}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors">
                    <Download className="w-4 h-4" />
                    ดาวน์โหลด
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-12 pb-8 border-b border-gray-200">
          <Tag className="w-4 h-4 text-gray-400" />
          {announcementData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Related Announcements */}
        {relatedAnnouncements.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6">ประกาศที่เกี่ยวข้อง</h2>
            <div className="space-y-3">
              {relatedAnnouncements.map((item, i) => (
                <Link
                  key={i}
                  href={`/announcements/${item.slug}`}
                  className="block bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow"
                >
                  <p className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back Button */}
        <Link
          href="/announcements"
          className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปหน้าประกาศ
        </Link>
      </div>
    </div>
  );
}
