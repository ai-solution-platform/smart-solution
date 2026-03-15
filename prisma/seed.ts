import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================================================
  // 1. Create Default Tenant
  // ============================================================================
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'smart-city' },
    update: {},
    create: {
      name: 'เทศบาลตำบลสมาร์ทซิตี้',
      slug: 'smart-city',
      primaryColor: '#1e3a5f',
      secondaryColor: '#2c5f8a',
      accentColor: '#e8a838',
      fontFamily: 'Prompt',
      description: 'เทศบาลตำบลสมาร์ทซิตี้ - Smart City Tambon Municipality',
      address: '999 ถ.สมาร์ท ต.สมาร์ทซิตี้ อ.เมือง จ.สมาร์ท 10000',
      phone: '02-xxx-xxxx',
      email: 'contact@smartcity.go.th',
      fax: '02-xxx-xxxx',
      socialFacebook: 'https://facebook.com/smartcity.go.th',
      socialLine: '@smartcity',
    },
  });

  console.log(`✅ Tenant created: ${tenant.name}`);

  // ============================================================================
  // 2. Create Admin User
  // ============================================================================
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@smartcity.go.th' },
    update: {},
    create: {
      email: 'admin@smartcity.go.th',
      password: hashedPassword,
      name: 'ผู้ดูแลระบบ',
      role: 'SUPER_ADMIN',
      tenantId: tenant.id,
    },
  });

  console.log(`✅ Admin user created: ${adminUser.email}`);

  // ============================================================================
  // 3. Create Sample News
  // ============================================================================
  const newsData = [
    {
      title: 'เทศบาลตำบลสมาร์ทซิตี้เปิดตัวแอปพลิเคชันบริการประชาชน',
      slug: 'smart-city-app-launch',
      excerpt: 'เทศบาลเปิดตัวแอปพลิเคชันใหม่เพื่ออำนวยความสะดวกให้ประชาชนในการเข้าถึงบริการต่างๆ',
      content: 'เทศบาลตำบลสมาร์ทซิตี้ได้เปิดตัวแอปพลิเคชันใหม่สำหรับให้บริการประชาชน โดยประชาชนสามารถแจ้งเรื่องร้องเรียน ตรวจสอบสถานะการดำเนินการ ชำระค่าธรรมเนียมต่างๆ และรับข่าวสารจากเทศบาลได้อย่างสะดวกรวดเร็ว ผ่านทางโทรศัพท์มือถือ ทั้งระบบ Android และ iOS',
      category: 'NEWS' as const,
      featuredImage: 'https://picsum.photos/seed/news1/800/400',
      isPinned: true,
      isPublished: true,
      publishedAt: new Date('2024-01-15'),
      tags: 'แอปพลิเคชัน,บริการประชาชน,Smart City',
    },
    {
      title: 'โครงการปรับปรุงระบบไฟฟ้าส่องสว่างอัจฉริยะ',
      slug: 'smart-lighting-project',
      excerpt: 'เทศบาลเดินหน้าโครงการติดตั้งไฟฟ้าส่องสว่างอัจฉริยะทั่วเขตเทศบาล',
      content: 'เทศบาลตำบลสมาร์ทซิตี้ได้เริ่มดำเนินโครงการปรับปรุงระบบไฟฟ้าส่องสว่างอัจฉริยะ (Smart Lighting) ทั่วเขตเทศบาล โดยใช้หลอดไฟ LED ที่สามารถควบคุมผ่านระบบ IoT ทำให้สามารถปรับความสว่างได้ตามสภาพแวดล้อม ช่วยประหยัดพลังงานได้มากถึง 60% และยังช่วยเพิ่มความปลอดภัยให้กับประชาชนในเวลากลางคืน',
      category: 'NEWS' as const,
      featuredImage: 'https://picsum.photos/seed/news2/800/400',
      isPinned: false,
      isPublished: true,
      publishedAt: new Date('2024-01-20'),
      tags: 'Smart Lighting,IoT,ประหยัดพลังงาน',
    },
    {
      title: 'งานประเพณีสงกรานต์สมาร์ทซิตี้ ประจำปี 2567',
      slug: 'songkran-festival-2567',
      excerpt: 'ขอเชิญร่วมงานประเพณีสงกรานต์ สืบสานวัฒนธรรมไทย ณ ลานกิจกรรมเทศบาล',
      content: 'เทศบาลตำบลสมาร์ทซิตี้ขอเชิญชวนประชาชนร่วมงานประเพณีสงกรานต์ ประจำปี 2567 ระหว่างวันที่ 13-15 เมษายน 2567 ณ ลานกิจกรรมเทศบาล โดยภายในงานมีกิจกรรมรดน้ำดำหัวผู้สูงอายุ การแสดงศิลปวัฒนธรรม การประกวดเทพีสงกรานต์ และกิจกรรมสนุกสนานมากมาย',
      category: 'PR' as const,
      featuredImage: 'https://picsum.photos/seed/news3/800/400',
      isPinned: false,
      isPublished: true,
      publishedAt: new Date('2024-03-25'),
      tags: 'สงกรานต์,ประเพณี,วัฒนธรรม',
    },
    {
      title: 'เปิดรับสมัครอบรมหลักสูตรดิจิทัลสำหรับผู้สูงอายุ รุ่นที่ 3',
      slug: 'digital-training-elderly-batch3',
      excerpt: 'โครงการอบรมการใช้งานสมาร์ทโฟนและอินเทอร์เน็ตสำหรับผู้สูงอายุ',
      content: 'เทศบาลตำบลสมาร์ทซิตี้เปิดรับสมัครผู้สูงอายุเข้าร่วมอบรมหลักสูตร "ดิจิทัลสำหรับผู้สูงอายุ" รุ่นที่ 3 ระหว่างวันที่ 1-5 พฤษภาคม 2567 ณ ศูนย์เรียนรู้ดิจิทัลชุมชน เทศบาลตำบลสมาร์ทซิตี้ โดยผู้เข้าร่วมจะได้เรียนรู้การใช้งานสมาร์ทโฟน แอปพลิเคชันที่จำเป็นในชีวิตประจำวัน การใช้งานโซเชียลมีเดีย และการระวังภัยออนไลน์',
      category: 'PR' as const,
      featuredImage: 'https://picsum.photos/seed/news4/800/400',
      isPinned: false,
      isPublished: true,
      publishedAt: new Date('2024-04-10'),
      tags: 'อบรม,ดิจิทัล,ผู้สูงอายุ',
    },
    {
      title: 'สรุปผลการดำเนินงานไตรมาสที่ 1 ปีงบประมาณ 2567',
      slug: 'q1-2567-summary',
      excerpt: 'รายงานผลการดำเนินงานของเทศบาลตำบลสมาร์ทซิตี้ ไตรมาสที่ 1',
      content: 'เทศบาลตำบลสมาร์ทซิตี้ขอรายงานสรุปผลการดำเนินงานไตรมาสที่ 1 ปีงบประมาณ 2567 (ตุลาคม - ธันวาคม 2566) โดยมีโครงการที่ดำเนินการแล้วเสร็จ 15 โครงการ อยู่ระหว่างดำเนินการ 8 โครงการ งบประมาณที่ใช้ไป 25,000,000 บาท คิดเป็นร้อยละ 30 ของงบประมาณทั้งหมด ประชาชนมีความพึงพอใจในระดับดีมาก',
      category: 'NEWS' as const,
      featuredImage: 'https://picsum.photos/seed/news5/800/400',
      isPinned: false,
      isPublished: true,
      publishedAt: new Date('2024-01-30'),
      tags: 'รายงาน,ผลการดำเนินงาน,งบประมาณ',
    },
  ];

  for (const news of newsData) {
    await prisma.news.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: news.slug } },
      update: {},
      create: {
        tenantId: tenant.id,
        authorId: adminUser.id,
        ...news,
      },
    });
  }

  console.log(`✅ ${newsData.length} news items created`);

  // ============================================================================
  // 4. Create Announcements (using News model with ANNOUNCEMENT category)
  // ============================================================================
  const announcementData = [
    {
      title: 'ประกาศ เรื่อง การชำระภาษีที่ดินและสิ่งปลูกสร้าง ประจำปี 2567',
      slug: 'land-tax-2567',
      excerpt: 'ขอเชิญชวนเจ้าของที่ดินและสิ่งปลูกสร้างมาชำระภาษีภายในกำหนด',
      content: 'เทศบาลตำบลสมาร์ทซิตี้ ขอประกาศให้เจ้าของที่ดินและสิ่งปลูกสร้างในเขตเทศบาล มาชำระภาษีที่ดินและสิ่งปลูกสร้าง ประจำปี 2567 ภายในเดือนมิถุนายน 2567 ณ กองคลัง เทศบาลตำบลสมาร์ทซิตี้ หรือชำระผ่านช่องทางออนไลน์ ผู้ที่ชำระภายในกำหนดจะได้รับส่วนลด 10%',
      category: 'ANNOUNCEMENT' as const,
      isPublished: true,
      publishedAt: new Date('2024-02-01'),
      tags: 'ภาษี,ที่ดิน,ประกาศ',
    },
    {
      title: 'ประกาศ เรื่อง กำหนดการจ่ายเบี้ยยังชีพผู้สูงอายุ เดือนกุมภาพันธ์ 2567',
      slug: 'elderly-allowance-feb-2567',
      excerpt: 'แจ้งกำหนดการจ่ายเบี้ยยังชีพผู้สูงอายุประจำเดือน',
      content: 'เทศบาลตำบลสมาร์ทซิตี้ ขอแจ้งกำหนดการจ่ายเบี้ยยังชีพผู้สูงอายุ ประจำเดือนกุมภาพันธ์ 2567 โดยจะโอนเข้าบัญชีธนาคารในวันที่ 10 กุมภาพันธ์ 2567 ผู้สูงอายุที่มีปัญหาเรื่องการรับเงิน สามารถติดต่อสอบถามได้ที่ กองสวัสดิการสังคม โทร 02-xxx-xxxx ต่อ 123',
      category: 'ANNOUNCEMENT' as const,
      isPublished: true,
      publishedAt: new Date('2024-02-05'),
      tags: 'ผู้สูงอายุ,เบี้ยยังชีพ,ประกาศ',
    },
    {
      title: 'ประกาศ เรื่อง ปิดให้บริการชั่วคราว วันที่ 12 กุมภาพันธ์ 2567',
      slug: 'temporary-closure-feb-2567',
      excerpt: 'แจ้งปิดให้บริการชั่วคราวเนื่องจากการปรับปรุงระบบ',
      content: 'เทศบาลตำบลสมาร์ทซิตี้ ขอแจ้งปิดให้บริการชั่วคราวในวันที่ 12 กุมภาพันธ์ 2567 เนื่องจากมีการปรับปรุงระบบไฟฟ้าและระบบเครือข่ายภายในอาคาร เพื่อรองรับระบบ Smart Office ใหม่ จึงขออภัยในความไม่สะดวก',
      category: 'ANNOUNCEMENT' as const,
      isPublished: true,
      publishedAt: new Date('2024-02-08'),
      tags: 'ปิดบริการ,ประกาศ',
    },
  ];

  for (const announcement of announcementData) {
    await prisma.news.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: announcement.slug } },
      update: {},
      create: {
        tenantId: tenant.id,
        authorId: adminUser.id,
        ...announcement,
      },
    });
  }

  console.log(`✅ ${announcementData.length} announcements created`);

  // ============================================================================
  // 5. Create Banners
  // ============================================================================
  const bannerData = [
    {
      title: 'ยินดีต้อนรับสู่เทศบาลตำบลสมาร์ทซิตี้',
      subtitle: 'เมืองแห่งอนาคต ด้วยเทคโนโลยีเพื่อประชาชน',
      imageUrl: 'https://picsum.photos/seed/banner1/1920/600',
      linkUrl: '/about',
      order: 1,
      isActive: true,
    },
    {
      title: 'บริการออนไลน์ 24 ชั่วโมง',
      subtitle: 'สะดวก รวดเร็ว ทุกที่ทุกเวลา',
      imageUrl: 'https://picsum.photos/seed/banner2/1920/600',
      linkUrl: '/services',
      order: 2,
      isActive: true,
    },
    {
      title: 'ร่วมสร้างเมืองน่าอยู่',
      subtitle: 'แจ้งปัญหา ร้องเรียน ร้องทุกข์ ได้ง่ายๆ',
      imageUrl: 'https://picsum.photos/seed/banner3/1920/600',
      linkUrl: '/complaints',
      order: 3,
      isActive: true,
    },
  ];

  for (const banner of bannerData) {
    await prisma.banner.create({
      data: {
        tenantId: tenant.id,
        ...banner,
      },
    });
  }

  console.log(`✅ ${bannerData.length} banners created`);

  // ============================================================================
  // 6. Create Menu Items
  // ============================================================================
  const menuItems = [
    { label: 'หน้าหลัก', labelEn: 'Home', url: '/', order: 1 },
    { label: 'ข้อมูลเทศบาล', labelEn: 'About', url: '/about', order: 2 },
    { label: 'ข่าวสาร', labelEn: 'News', url: '/news', order: 3 },
    { label: 'ประกาศ', labelEn: 'Announcements', url: '/announcements', order: 4 },
    { label: 'จัดซื้อจัดจ้าง', labelEn: 'Procurement', url: '/procurement', order: 5 },
    { label: 'อัลบั้มภาพ', labelEn: 'Gallery', url: '/gallery', order: 6 },
    { label: 'ดาวน์โหลดเอกสาร', labelEn: 'Downloads', url: '/downloads', order: 7 },
    { label: 'ติดต่อเรา', labelEn: 'Contact', url: '/contact', order: 8 },
    { label: 'ร้องเรียน/ร้องทุกข์', labelEn: 'Complaints', url: '/complaints', order: 9 },
  ];

  const createdMenuItems: Record<string, string> = {};

  for (const item of menuItems) {
    const created = await prisma.menuItem.create({
      data: {
        tenantId: tenant.id,
        ...item,
      },
    });
    createdMenuItems[item.url] = created.id;
  }

  // Create children for "ข้อมูลเทศบาล"
  const aboutChildren = [
    { label: 'ประวัติ', labelEn: 'History', url: '/about/history', order: 1 },
    { label: 'วิสัยทัศน์', labelEn: 'Vision', url: '/about/vision', order: 2 },
    { label: 'โครงสร้าง', labelEn: 'Structure', url: '/about/structure', order: 3 },
    { label: 'ผู้บริหาร', labelEn: 'Executives', url: '/about/executives', order: 4 },
  ];

  for (const child of aboutChildren) {
    await prisma.menuItem.create({
      data: {
        tenantId: tenant.id,
        parentId: createdMenuItems['/about'],
        ...child,
      },
    });
  }

  console.log(`✅ ${menuItems.length + aboutChildren.length} menu items created`);

  // ============================================================================
  // 7. Create Procurement Entries
  // ============================================================================
  const procurementData = [
    {
      title: 'จ้างปรับปรุงระบบไฟฟ้าส่องสว่างภายในเขตเทศบาล',
      description: 'โครงการปรับปรุงระบบไฟฟ้าส่องสว่างเป็นหลอด LED อัจฉริยะ จำนวน 500 จุด',
      type: 'HIRE' as const,
      status: 'PUBLISHED' as const,
      budget: 5000000,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-01'),
      publishedAt: new Date('2024-02-01'),
    },
    {
      title: 'ซื้อครุภัณฑ์คอมพิวเตอร์สำหรับศูนย์บริการประชาชน',
      description: 'จัดซื้อคอมพิวเตอร์ตั้งโต๊ะ 20 ชุด และเครื่องพิมพ์ 5 เครื่อง',
      type: 'PURCHASE' as const,
      status: 'PUBLISHED' as const,
      budget: 1200000,
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-03-15'),
      publishedAt: new Date('2024-02-15'),
    },
    {
      title: 'ประกวดราคาจ้างก่อสร้างสวนสาธารณะอัจฉริยะ',
      description: 'โครงการก่อสร้างสวนสาธารณะอัจฉริยะ พร้อมระบบ Wi-Fi สาธารณะ และสนามเด็กเล่น',
      type: 'BID' as const,
      status: 'PUBLISHED' as const,
      budget: 15000000,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-04-01'),
      publishedAt: new Date('2024-03-01'),
    },
  ];

  for (const procurement of procurementData) {
    await prisma.procurement.create({
      data: {
        tenantId: tenant.id,
        authorId: adminUser.id,
        ...procurement,
      },
    });
  }

  console.log(`✅ ${procurementData.length} procurement entries created`);

  // ============================================================================
  // 8. Create Sample Documents
  // ============================================================================
  const documentData = [
    {
      title: 'แผนพัฒนาท้องถิ่น (พ.ศ. 2566 - 2570)',
      category: 'แผนพัฒนา',
      fileUrl: '/documents/development-plan-2566-2570.pdf',
      fileSize: 2500000,
      isPublished: true,
      publishedAt: new Date('2024-01-01'),
    },
    {
      title: 'รายงานงบประมาณประจำปี 2567',
      category: 'งบประมาณ',
      fileUrl: '/documents/budget-report-2567.pdf',
      fileSize: 1800000,
      isPublished: true,
      publishedAt: new Date('2024-01-15'),
    },
    {
      title: 'แบบฟอร์มคำร้องทั่วไป',
      category: 'แบบฟอร์ม',
      fileUrl: '/documents/general-request-form.pdf',
      fileSize: 500000,
      isPublished: true,
      publishedAt: new Date('2024-01-01'),
    },
    {
      title: 'ข้อบัญญัติเทศบาลตำบลสมาร์ทซิตี้',
      category: 'กฎหมาย',
      fileUrl: '/documents/municipal-regulations.pdf',
      fileSize: 3200000,
      isPublished: true,
      publishedAt: new Date('2024-01-01'),
    },
    {
      title: 'คู่มือสำหรับประชาชน การขออนุญาตก่อสร้าง',
      category: 'คู่มือ',
      fileUrl: '/documents/construction-permit-guide.pdf',
      fileSize: 1200000,
      isPublished: true,
      publishedAt: new Date('2024-02-01'),
    },
  ];

  for (const doc of documentData) {
    await prisma.document.create({
      data: {
        tenantId: tenant.id,
        authorId: adminUser.id,
        ...doc,
      },
    });
  }

  console.log(`✅ ${documentData.length} documents created`);

  // ============================================================================
  // 9. Create Site Config Entries
  // ============================================================================
  const siteConfigData = [
    { key: 'operating_hours', value: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.', group: 'general' },
    { key: 'operating_hours_note', value: 'หยุดวันเสาร์-อาทิตย์ และวันหยุดนักขัตฤกษ์', group: 'general' },
    { key: 'map_latitude', value: '13.7563', group: 'location' },
    { key: 'map_longitude', value: '100.5018', group: 'location' },
    { key: 'map_zoom', value: '15', group: 'location' },
    { key: 'seo_title', value: 'เทศบาลตำบลสมาร์ทซิตี้ - Smart City Municipality', group: 'seo' },
    { key: 'seo_description', value: 'เว็บไซต์ทางการของเทศบาลตำบลสมาร์ทซิตี้ ให้บริการข้อมูลข่าวสาร ประกาศ และบริการออนไลน์สำหรับประชาชน', group: 'seo' },
    { key: 'seo_keywords', value: 'เทศบาล,สมาร์ทซิตี้,Smart City,อปท,ท้องถิ่น', group: 'seo' },
    { key: 'visitor_counter_enabled', value: 'true', group: 'analytics' },
    { key: 'chatbot_enabled', value: 'true', group: 'ai' },
    { key: 'emergency_phone', value: '1669', group: 'contact' },
    { key: 'fire_department_phone', value: '199', group: 'contact' },
  ];

  for (const config of siteConfigData) {
    await prisma.siteConfig.upsert({
      where: { tenantId_key: { tenantId: tenant.id, key: config.key } },
      update: { value: config.value },
      create: {
        tenantId: tenant.id,
        ...config,
      },
    });
  }

  console.log(`✅ ${siteConfigData.length} site config entries created`);

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
