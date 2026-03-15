import type { Metadata } from 'next';
import HeroBanner from '@/components/public/HeroBanner';
import AnnouncementBar from '@/components/public/AnnouncementBar';
import QuickLinks from '@/components/public/QuickLinks';
import NewsSection from '@/components/public/NewsSection';
import GalleryPreview from '@/components/public/GalleryPreview';
import ProcurementPreview from '@/components/public/ProcurementPreview';
import ContactSection from '@/components/public/ContactSection';
import StatisticsBar from '@/components/public/StatisticsBar';
import ExternalLinks from '@/components/public/ExternalLinks';

export const metadata: Metadata = {
  title: 'เทศบาลตำบลสมาร์ทซิตี้ | Smart City Municipality',
  description:
    'เว็บไซต์เทศบาลตำบลสมาร์ทซิตี้ ให้บริการข้อมูลข่าวสาร ประกาศ บริการประชาชน และข้อมูลต่างๆ ของเทศบาล',
  keywords: [
    'เทศบาล',
    'สมาร์ทซิตี้',
    'Smart City',
    'บริการประชาชน',
    'ข่าวสาร',
    'ประกาศ',
    'องค์กรปกครองส่วนท้องถิ่น',
  ],
  openGraph: {
    title: 'เทศบาลตำบลสมาร์ทซิตี้',
    description: 'เว็บไซต์เทศบาลตำบลสมาร์ทซิตี้ ก้าวสู่การเป็นเมืองอัจฉริยะ',
    type: 'website',
    locale: 'th_TH',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Urgent Announcement Ticker */}
      <AnnouncementBar />

      {/* Hero Banner / Slider */}
      <HeroBanner />

      {/* Quick Access Service Cards */}
      <QuickLinks />

      {/* Latest News & Announcements */}
      <NewsSection />

      {/* Procurement / Bidding */}
      <ProcurementPreview />

      {/* Photo Gallery Preview */}
      <GalleryPreview />

      {/* Contact Info + Form */}
      <ContactSection />

      {/* Visitor Statistics */}
      <StatisticsBar />

      {/* External Organization Links */}
      <ExternalLinks />
    </main>
  );
}
