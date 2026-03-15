import AnnouncementDetailClient from './AnnouncementDetailClient';

export function generateStaticParams() {
  return [
    'tax-payment-2568',
    'recruitment-engineer-2568',
    'water-supply-maintenance',
    'building-permit-regulation',
    'scholarship-result-2568',
    'market-permit-renewal',
    'waste-collection-schedule',
    'recruitment-teacher-result',
    'business-tax-regulation',
    'recruitment-nurse',
  ].map((slug) => ({ slug }));
}

export default function AnnouncementDetailPage() {
  return <AnnouncementDetailClient />;
}
