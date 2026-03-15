'use client';

import { useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import {
  Calendar,
  Eye,
  User,
  Share2,
  Facebook,
  Link2,
  ArrowLeft,
  Clock,
  Tag,
} from 'lucide-react';

const allArticles: Record<
  string,
  {
    title: string;
    category: string;
    date: string;
    author: string;
    views: number;
    readTime: string;
    content: string;
    tags: string[];
  }
> = {
  'smart-city-development-2568': {
    title: 'เทศบาลตำบลสมาร์ทซิตี้ เปิดตัวโครงการพัฒนาเมืองอัจฉริยะ ประจำปี 2568',
    category: 'โครงการ',
    date: '10 มีนาคม 2568',
    author: 'งานประชาสัมพันธ์ เทศบาลตำบลสมาร์ทซิตี้',
    views: 1250,
    readTime: '5 นาที',
    tags: ['โครงการพัฒนา', 'Smart City', 'เทคโนโลยี', 'เมืองอัจฉริยะ'],
    content: `
      <p>เมื่อวันที่ 10 มีนาคม 2568 นายสมชาย รักเมือง นายกเทศมนตรีตำบลสมาร์ทซิตี้ เป็นประธานในพิธีเปิดตัวโครงการพัฒนาเมืองอัจฉริยะ (Smart City) ประจำปี 2568 ณ ศาลาประชาคมเทศบาลตำบลสมาร์ทซิตี้ โดยมีคณะผู้บริหาร สมาชิกสภาเทศบาล หัวหน้าส่วนราชการ ผู้นำชุมชน และประชาชนเข้าร่วมงานจำนวนมาก</p>

      <h2>วัตถุประสงค์ของโครงการ</h2>
      <p>โครงการพัฒนาเมืองอัจฉริยะมีวัตถุประสงค์หลักเพื่อนำเทคโนโลยีดิจิทัลมาใช้ในการบริหารจัดการเมือง โดยมุ่งเน้นใน 7 ด้านสำคัญ ได้แก่</p>
      <ul>
        <li><strong>Smart Environment</strong> - การจัดการสิ่งแวดล้อมอัจฉริยะ ติดตั้งเซ็นเซอร์วัดคุณภาพอากาศ</li>
        <li><strong>Smart Mobility</strong> - การจราจรและขนส่งอัจฉริยะ ติดตั้งระบบ CCTV อัจฉริยะ</li>
        <li><strong>Smart Living</strong> - คุณภาพชีวิตอัจฉริยะ ระบบแจ้งเหตุฉุกเฉินผ่านแอปพลิเคชัน</li>
        <li><strong>Smart Governance</strong> - การบริหารจัดการภาครัฐอัจฉริยะ ระบบบริการออนไลน์</li>
        <li><strong>Smart Economy</strong> - เศรษฐกิจอัจฉริยะ ส่งเสริม e-Commerce ชุมชน</li>
        <li><strong>Smart People</strong> - พลเมืองอัจฉริยะ อบรมทักษะดิจิทัลให้ประชาชน</li>
        <li><strong>Smart Energy</strong> - พลังงานอัจฉริยะ ติดตั้งไฟถนน LED พลังงานแสงอาทิตย์</li>
      </ul>

      <h2>งบประมาณและระยะเวลา</h2>
      <p>โครงการมีงบประมาณดำเนินการทั้งสิ้น 150 ล้านบาท โดยได้รับการสนับสนุนจากกองทุนพัฒนาเมืองอัจฉริยะแห่งชาติ จำนวน 100 ล้านบาท และงบประมาณของเทศบาลเอง จำนวน 50 ล้านบาท มีระยะเวลาดำเนินการ 3 ปี (พ.ศ. 2568-2570)</p>

      <h2>ประโยชน์ที่ประชาชนจะได้รับ</h2>
      <p>นายสมชาย รักเมือง นายกเทศมนตรี กล่าวว่า โครงการนี้จะทำให้ประชาชนได้รับความสะดวกสบายในการใช้บริการของเทศบาลมากยิ่งขึ้น ลดระยะเวลาในการติดต่อราชการ สามารถเข้าถึงข้อมูลข่าวสารของเทศบาลได้ง่ายและรวดเร็ว รวมทั้งมีส่วนร่วมในการพัฒนาท้องถิ่นผ่านช่องทางดิจิทัล</p>

      <p>สำหรับประชาชนที่สนใจสามารถสอบถามรายละเอียดเพิ่มเติมได้ที่ สำนักปลัดเทศบาล โทร. 02-XXX-XXXX ต่อ 101 หรือติดตามข้อมูลข่าวสารผ่านทางเว็บไซต์และเพจ Facebook ของเทศบาลตำบลสมาร์ทซิตี้</p>
    `,
  },
  'health-checkup-campaign': {
    title: 'รณรงค์ตรวจสุขภาพประจำปี 2568 ฟรี สำหรับประชาชนในพื้นที่',
    category: 'สาธารณสุข',
    date: '8 มีนาคม 2568',
    author: 'กองสาธารณสุขและสิ่งแวดล้อม',
    views: 890,
    readTime: '3 นาที',
    tags: ['สาธารณสุข', 'ตรวจสุขภาพ', 'บริการประชาชน'],
    content: `
      <p>เทศบาลร่วมกับโรงพยาบาลส่งเสริมสุขภาพตำบล จัดกิจกรรมตรวจสุขภาพฟรีให้แก่ประชาชนในเขตเทศบาล เพื่อส่งเสริมให้ประชาชนดูแลสุขภาพเชิงป้องกัน</p>

      <h2>รายละเอียดกิจกรรม</h2>
      <ul>
        <li>ตรวจวัดความดันโลหิต</li>
        <li>ตรวจระดับน้ำตาลในเลือด</li>
        <li>ตรวจสุขภาพตาและการมองเห็น</li>
        <li>ตรวจสุขภาพช่องปาก</li>
        <li>ให้คำปรึกษาด้านสุขภาพจากแพทย์ผู้เชี่ยวชาญ</li>
      </ul>

      <h2>กำหนดการ</h2>
      <p>วันที่ 15-17 เมษายน 2568 เวลา 08.00 - 16.00 น. ณ ศาลาประชาคมเทศบาลตำบลสมาร์ทซิตี้</p>
      <p>ประชาชนที่สนใจสามารถลงทะเบียนล่วงหน้าได้ที่ กองสาธารณสุขฯ โทร. 02-XXX-XXXX ต่อ 301</p>
    `,
  },
  'songkran-festival-2568': {
    title: 'เตรียมจัดงานเทศกาลสงกรานต์ ประจำปี 2568 ยิ่งใหญ่กว่าทุกปี',
    category: 'กิจกรรม',
    date: '5 มีนาคม 2568',
    author: 'งานประชาสัมพันธ์ เทศบาลตำบลสมาร์ทซิตี้',
    views: 2100,
    readTime: '4 นาที',
    tags: ['สงกรานต์', 'กิจกรรม', 'วัฒนธรรม', 'ประเพณี'],
    content: `
      <p>เทศบาลเตรียมจัดงานเทศกาลสงกรานต์อย่างยิ่งใหญ่ พร้อมกิจกรรมสืบสานวัฒนธรรมไทย รดน้ำดำหัวผู้สูงอายุ ก่อพระเจดีย์ทราย และขบวนแห่สงกรานต์</p>

      <h2>กิจกรรมภายในงาน</h2>
      <ul>
        <li>พิธีรดน้ำดำหัวผู้สูงอายุ</li>
        <li>ขบวนแห่สงกรานต์ 12 ชุมชน</li>
        <li>การประกวดเทพีสงกรานต์</li>
        <li>เวทีการแสดงศิลปวัฒนธรรมพื้นบ้าน</li>
        <li>ซุ้มอาหารและเครื่องดื่ม</li>
      </ul>

      <h2>กำหนดการจัดงาน</h2>
      <p>วันที่ 13-15 เมษายน 2568 ณ ลานอเนกประสงค์เทศบาลตำบลสมาร์ทซิตี้</p>
    `,
  },
  'road-construction-update': {
    title: 'ความคืบหน้าโครงการก่อสร้างถนนสายหลัก เฟส 2',
    category: 'โครงการ',
    date: '1 มีนาคม 2568',
    author: 'กองช่าง เทศบาลตำบลสมาร์ทซิตี้',
    views: 750,
    readTime: '3 นาที',
    tags: ['โครงการก่อสร้าง', 'ถนน', 'โครงสร้างพื้นฐาน'],
    content: `
      <p>โครงการก่อสร้างถนนสายหลักเฟส 2 คืบหน้าไปแล้วกว่า 65% คาดว่าจะแล้วเสร็จภายในเดือนมิถุนายน 2568</p>

      <h2>รายละเอียดโครงการ</h2>
      <p>โครงการก่อสร้างถนนคอนกรีตเสริมเหล็ก ความกว้าง 8 เมตร ยาว 2.5 กิโลเมตร พร้อมระบบระบายน้ำ และไฟฟ้าส่องสว่าง</p>

      <h2>ความคืบหน้า</h2>
      <ul>
        <li>งานดินและปรับพื้นที่ - แล้วเสร็จ 100%</li>
        <li>งานโครงสร้างถนน - แล้วเสร็จ 70%</li>
        <li>งานระบบระบายน้ำ - แล้วเสร็จ 55%</li>
        <li>งานไฟฟ้าส่องสว่าง - อยู่ระหว่างดำเนินการ</li>
      </ul>
    `,
  },
  'flood-prevention-preparation': {
    title: 'เตรียมพร้อมรับมือน้ำท่วมช่วงฤดูฝน ปี 2568',
    category: 'ข่าวด่วน',
    date: '28 กุมภาพันธ์ 2568',
    author: 'งานป้องกันและบรรเทาสาธารณภัย',
    views: 1800,
    readTime: '4 นาที',
    tags: ['ป้องกันภัย', 'น้ำท่วม', 'ฤดูฝน'],
    content: `
      <p>เทศบาลเตรียมแผนป้องกันและบรรเทาอุทกภัย พร้อมจัดเตรียมอุปกรณ์และกำลังพลไว้รองรับสถานการณ์น้ำท่วมในช่วงฤดูฝนที่จะถึงนี้</p>

      <h2>แผนการเตรียมพร้อม</h2>
      <ul>
        <li>ตรวจสอบและขุดลอกท่อระบายน้ำทุกสาย</li>
        <li>จัดเตรียมกระสอบทราย 10,000 ใบ</li>
        <li>ตรวจสอบระบบสูบน้ำ 15 สถานี</li>
        <li>จัดเตรียมศูนย์อพยพ 5 แห่ง</li>
        <li>ซ้อมแผนอพยพร่วมกับชุมชน</li>
      </ul>

      <p>ประชาชนสามารถแจ้งเหตุได้ที่สายด่วน 199 หรือ โทร. 02-XXX-XXXX ตลอด 24 ชั่วโมง</p>
    `,
  },
  'elderly-welfare-program': {
    title: 'โครงการส่งเสริมสวัสดิการผู้สูงอายุ ประจำปี 2568',
    category: 'ข่าวทั่วไป',
    date: '25 กุมภาพันธ์ 2568',
    author: 'กองสวัสดิการสังคม',
    views: 620,
    readTime: '3 นาที',
    tags: ['ผู้สูงอายุ', 'สวัสดิการ', 'คุณภาพชีวิต'],
    content: `
      <p>เทศบาลจัดโครงการส่งเสริมสวัสดิการผู้สูงอายุ มอบเบี้ยยังชีพ พร้อมจัดกิจกรรมส่งเสริมสุขภาพสำหรับผู้สูงอายุในพื้นที่</p>

      <h2>กิจกรรมในโครงการ</h2>
      <ul>
        <li>มอบเบี้ยยังชีพผู้สูงอายุประจำเดือน</li>
        <li>กิจกรรมออกกำลังกายสำหรับผู้สูงอายุ</li>
        <li>ตรวจสุขภาพประจำไตรมาส</li>
        <li>อบรมทักษะการใช้สมาร์ทโฟน</li>
      </ul>
    `,
  },
  'waste-sorting-campaign': {
    title: 'รณรงค์คัดแยกขยะที่ต้นทาง ลดปริมาณขยะในชุมชน',
    category: 'ข่าวทั่วไป',
    date: '20 กุมภาพันธ์ 2568',
    author: 'กองสาธารณสุขและสิ่งแวดล้อม',
    views: 430,
    readTime: '3 นาที',
    tags: ['สิ่งแวดล้อม', 'คัดแยกขยะ', 'ชุมชน'],
    content: `
      <p>เทศบาลเปิดตัวโครงการรณรงค์คัดแยกขยะที่ต้นทาง สร้างจิตสำนึกในการดูแลสิ่งแวดล้อมให้กับประชาชนทุกชุมชน</p>

      <h2>หลักการคัดแยกขยะ 4 ประเภท</h2>
      <ul>
        <li>ขยะรีไซเคิล (ถังสีเหลือง) - กระดาษ พลาสติก แก้ว โลหะ</li>
        <li>ขยะอินทรีย์ (ถังสีเขียว) - เศษอาหาร ใบไม้</li>
        <li>ขยะทั่วไป (ถังสีน้ำเงิน) - ขยะที่ไม่สามารถรีไซเคิลได้</li>
        <li>ขยะอันตราย (ถังสีแดง) - ถ่านไฟฉาย หลอดไฟ สารเคมี</li>
      </ul>
    `,
  },
  'youth-sports-day': {
    title: 'จัดการแข่งขันกีฬาเยาวชนต้านยาเสพติด ครั้งที่ 15',
    category: 'กิจกรรม',
    date: '15 กุมภาพันธ์ 2568',
    author: 'กองการศึกษา',
    views: 980,
    readTime: '3 นาที',
    tags: ['กีฬา', 'เยาวชน', 'ต้านยาเสพติด'],
    content: `
      <p>เทศบาลจัดการแข่งขันกีฬาเยาวชนต้านยาเสพติด เพื่อส่งเสริมให้เยาวชนใช้เวลาว่างให้เกิดประโยชน์ ห่างไกลยาเสพติด</p>

      <h2>ประเภทกีฬาที่แข่งขัน</h2>
      <ul>
        <li>ฟุตบอล 7 คน</li>
        <li>วอลเลย์บอล</li>
        <li>เปตอง</li>
        <li>กรีฑา</li>
        <li>กีฬาพื้นบ้าน</li>
      </ul>

      <p>กำหนดแข่งขัน วันที่ 1-3 มีนาคม 2568 ณ สนามกีฬาเทศบาลตำบลสมาร์ทซิตี้</p>
    `,
  },
  'digital-service-launch': {
    title: 'เปิดให้บริการระบบจองคิวออนไลน์ ลดเวลารอคอย',
    category: 'ข่าวทั่วไป',
    date: '10 กุมภาพันธ์ 2568',
    author: 'สำนักปลัดเทศบาล',
    views: 1500,
    readTime: '3 นาที',
    tags: ['ดิจิทัล', 'บริการออนไลน์', 'จองคิว'],
    content: `
      <p>เทศบาลเปิดตัวระบบจองคิวออนไลน์ผ่านเว็บไซต์และแอปพลิเคชัน เพื่อลดเวลารอคอยของประชาชนในการติดต่อราชการ</p>

      <h2>บริการที่สามารถจองคิวได้</h2>
      <ul>
        <li>งานทะเบียนราษฎร</li>
        <li>การชำระภาษี</li>
        <li>การขออนุญาตก่อสร้าง</li>
        <li>การขอใบอนุญาตประกอบกิจการ</li>
        <li>งานสวัสดิการสังคม</li>
      </ul>

      <p>เข้าใช้งานได้ที่ www.smartcity.go.th/booking หรือดาวน์โหลดแอปพลิเคชัน "Smart City Service"</p>
    `,
  },
};

const relatedNewsData: Record<string, { slug: string; title: string; date: string; category: string }[]> = {
  'smart-city-development-2568': [
    { slug: 'digital-service-launch', title: 'เปิดให้บริการระบบจองคิวออนไลน์ ลดเวลารอคอย', date: '2568-02-10', category: 'ข่าวทั่วไป' },
    { slug: 'road-construction-update', title: 'ความคืบหน้าโครงการก่อสร้างถนนสายหลัก เฟส 2', date: '2568-03-01', category: 'โครงการ' },
    { slug: 'waste-sorting-campaign', title: 'รณรงค์คัดแยกขยะที่ต้นทาง ลดปริมาณขยะในชุมชน', date: '2568-02-20', category: 'ข่าวทั่วไป' },
  ],
};

// Default related news for slugs without specific related items
const defaultRelated = [
  { slug: 'smart-city-development-2568', title: 'เปิดตัวโครงการพัฒนาเมืองอัจฉริยะ ประจำปี 2568', date: '2568-03-10', category: 'โครงการ' },
  { slug: 'songkran-festival-2568', title: 'เตรียมจัดงานเทศกาลสงกรานต์ ประจำปี 2568', date: '2568-03-05', category: 'กิจกรรม' },
  { slug: 'digital-service-launch', title: 'เปิดให้บริการระบบจองคิวออนไลน์ ลดเวลารอคอย', date: '2568-02-10', category: 'ข่าวทั่วไป' },
];

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [copied, setCopied] = useState(false);

  const articleData = allArticles[slug];
  const relatedNews = relatedNewsData[slug] || defaultRelated.filter((n) => n.slug !== slug).slice(0, 3);

  if (!articleData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
              <Link href="/" className="hover:text-white">หน้าแรก</Link>
              <span>/</span>
              <Link href="/news" className="hover:text-white">ข่าวสาร</Link>
              <span>/</span>
              <span className="text-white">ไม่พบข่าว</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">ไม่พบข่าวที่ต้องการ</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-gray-500 mb-6">ไม่พบข่าวสารที่คุณต้องการ หรืออาจถูกลบออกแล้ว</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าข่าวสาร
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

  const handleShareLine = () => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8a] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <Link href="/" className="hover:text-white">หน้าแรก</Link>
            <span>/</span>
            <Link href="/news" className="hover:text-white">ข่าวสาร</Link>
            <span>/</span>
            <span className="text-white">รายละเอียด</span>
          </div>
          <span className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium mb-3">
            {articleData.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold leading-relaxed">
            {articleData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-blue-200">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {articleData.date}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {articleData.author}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {articleData.views.toLocaleString()} ครั้ง
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              อ่าน {articleData.readTime}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl h-64 md:h-96 flex items-center justify-center mb-8">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-2" />
            <p className="text-blue-400 text-sm">ภาพประกอบข่าว</p>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
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
            onClick={handleShareLine}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
          >
            LINE
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
          >
            <Link2 className="w-4 h-4" />
            {copied ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}
          </button>
        </div>

        {/* Article Content */}
        <article
          className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-a:text-blue-600 mb-12"
          dangerouslySetInnerHTML={{ __html: articleData.content }}
        />

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-12 pb-8 border-b border-gray-200">
          <Tag className="w-4 h-4 text-gray-400" />
          {articleData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Related News */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">ข่าวที่เกี่ยวข้อง</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {relatedNews.map((news, i) => (
              <Link
                key={i}
                href={`/news/${news.slug}`}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-blue-300" />
                </div>
                <div className="p-4">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {news.category}
                  </span>
                  <h3 className="font-semibold text-gray-800 text-sm mt-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2">{news.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Back Button */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปหน้าข่าวสาร
        </Link>
      </div>
    </div>
  );
}
