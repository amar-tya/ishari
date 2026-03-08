import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Masuk - ISHARI',
  description: 'Masuk ke akun ISHARI Anda',
};

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* Header */}
      <header className="p-4 md:p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Kembali</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-4 md:p-6 text-center">
        <p className="text-xs text-slate-400">
          &copy; 2024 ISHARI. Semua hak dilindungi.
        </p>
      </footer>
    </div>
  );
}
