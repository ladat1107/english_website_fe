/**
 * BeeStudy - Root Layout
 * Layout gốc của ứng dụng
 */

import '@/styles/globals.css';

import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { SITE_CONFIG } from '@/lib/constants';

// Font chính của website
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadata cho SEO
export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.description}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'IELTS',
    'học tiếng Anh',
    'luyện thi IELTS',
    'IELTS online',
    'IELTS reading',
    'IELTS listening',
    'IELTS writing',
    'IELTS speaking',
    'flashcard',
    'chép chính tả',
    'BeeStudy',
  ],
  authors: [{ name: 'BeeStudy Team' }],
  creator: 'BeeStudy',
  publisher: 'BeeStudy',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: ['/images/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#D42525' },
    { media: '(prefers-color-scheme: dark)', color: '#B91C1C' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        {/* Main content */}
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
