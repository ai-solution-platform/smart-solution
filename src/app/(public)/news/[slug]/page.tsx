import NewsDetailClient from './NewsDetailClient';

export function generateStaticParams() {
  return [
    'smart-city-development-2568',
    'health-checkup-campaign',
    'songkran-festival-2568',
    'road-construction-update',
    'flood-prevention-preparation',
    'elderly-welfare-program',
    'waste-sorting-campaign',
    'youth-sports-day',
    'digital-service-launch',
  ].map((slug) => ({ slug }));
}

export default function NewsDetailPage() {
  return <NewsDetailClient />;
}
