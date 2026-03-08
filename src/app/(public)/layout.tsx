import React from 'react';
import { PublicNavbar } from '@/presentation/components/public/PublicNavbar';
import { GlobalFooter } from '@/presentation/components/common/GlobalFooter';

export const metadata = {
  title: 'ISHARI - Aplikasi Kitab Islam Digital',
  description: 'Jelajahi koleksi kitab Islam digital dengan terjemahan dan audio berkualitas',
};

export default function PublicLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="bg-white font-sans text-slate-900 antialiased min-h-screen flex flex-col overflow-x-hidden">
      <PublicNavbar />
      <main className="flex-grow flex flex-col">{children}</main>
      <GlobalFooter />
    </div>
  );
}
