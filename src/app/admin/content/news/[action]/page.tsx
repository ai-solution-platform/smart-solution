import NewsFormClient from './NewsFormClient';

export function generateStaticParams() {
  return [{ action: 'create' }, { action: 'edit' }];
}

export default function NewsFormPage() {
  return <NewsFormClient />;
}
