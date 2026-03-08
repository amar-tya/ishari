import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'ISHARI - Aplikasi Kitab Islam Digital',
    template: '%s | ISHARI',
  },
  description: 'Jelajahi koleksi kitab Islam digital dengan terjemahan dan audio berkualitas. Akses Diba, Muhud, Diwan, dan berbagai kitab lainnya.',
  keywords: ['Islam', 'Kitab', 'Diba', 'Muhud', 'Diwan', 'Digital', 'Indonesia'],
  authors: [{ name: 'ISHARI Team' }],
  creator: 'ISHARI',
  publisher: 'ISHARI',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'ISHARI - Aplikasi Kitab Islam Digital',
    description: 'Jelajahi koleksi kitab Islam digital dengan terjemahan dan audio berkualitas.',
    siteName: 'ISHARI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISHARI - Aplikasi Kitab Islam Digital',
    description: 'Jelajahi koleksi kitab Islam digital dengan terjemahan dan audio berkualitas.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
