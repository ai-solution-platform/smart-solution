import EServiceDetailClient from './EServiceDetailClient';

export function generateStaticParams() {
  return ['tax-payment', 'building-permit', 'queue-booking', 'report-issue', 'information-request'].map(
    (service) => ({ service })
  );
}

export default function EServiceDetailPage() {
  return <EServiceDetailClient />;
}
