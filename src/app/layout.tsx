import React from 'react';
import type { Metadata } from 'next';
import { Prompt } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-prompt',
});

export const metadata: Metadata = {
  title: {
    default: 'เทศบาล | Smart Website Platform',
    template: '%s | Smart Website Platform',
  },
  description:
    'เว็บไซต์สำหรับองค์กรปกครองส่วนท้องถิ่น พัฒนาด้วย Smart Website Platform',
  keywords: [
    'เทศบาล',
    'องค์กรปกครองส่วนท้องถิ่น',
    'อปท',
    'เว็บไซต์ราชการ',
    'Smart Website',
  ],
  authors: [{ name: 'Smart Website Platform' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: 'Smart Website Platform',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={prompt.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${prompt.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
