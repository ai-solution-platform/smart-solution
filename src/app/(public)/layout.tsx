import React from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ChatWidget from '@/components/ai/ChatWidget';
import ConsentBanner from '@/components/shared/ConsentBanner';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
      <ConsentBanner />
    </>
  );
}
