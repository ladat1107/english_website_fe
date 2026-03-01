/**
 * Khailingo - Root Layout
 * Layout gốc của ứng dụng - Server Component
 * Chỉ có ClientProviders là client component để tối ưu SEO
 */

import '@/styles/globals.css';

import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { SITE_CONFIG } from '@/utils/constants';
import { ClientProviders } from '@/components/providers';
import envConfig from '@/utils/env-config';

// Font chính của website
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadata cho SEO
export const metadata: Metadata = {
  metadataBase: new URL(envConfig.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"),
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
    'Khailingo',
  ],
  authors: [{ name: 'Khailingo Team' }],
  creator: 'Khailingo',
  publisher: 'Khailingo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        url: `${SITE_CONFIG.url}/image/og-image.png`,
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
    images: [`${SITE_CONFIG.url}/image/og-image.png`]
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  //manifest: '/site.webmanifest',
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#D42525' },
    { media: '(prefers-color-scheme: dark)', color: '#B91C1C' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root Layout - Server Component thuần
 * ClientProviders wrap children để cung cấp auth context
 */
const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
};

export default RootLayout;
