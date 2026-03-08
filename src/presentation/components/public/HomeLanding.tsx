'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/presentation/hooks';

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function FeatureCard({ title, description, icon, href, color }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-white rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition-all"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </Link>
  );
}

// Quick Access Item
interface QuickAccessItemProps {
  title: string;
  subtitle: string;
  href: string;
}

function QuickAccessItem({ title, subtitle, href }: QuickAccessItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
    >
      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-slate-900 group-hover:text-emerald-600 transition-colors">{title}</h4>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
}

export function HomeLanding() {
  const user = useUser();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 text-center">
          {/* Greeting */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-medium text-emerald-700">
              {user ? `Assalamu'alaikum, ${user.username}` : "Assalamu'alaikum"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">
            Jelajahi Keindahan{' '}
            <span className="text-emerald-600">Kitab Islam</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 text-balance">
            Akses koleksi lengkap Diba, Muhud, Diwan, dan berbagai kitab lainnya 
            dengan terjemahan dan audio berkualitas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/?id=1"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-emerald-600/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Mulai Membaca
            </Link>
            {!user && (
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl transition-colors border-2 border-slate-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Masuk Akun
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Kategori Utama</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            title="Muhud"
            description="Koleksi Diwan dan Muradah dengan terjemahan lengkap"
            icon={
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            }
            href="/muhud"
            color="bg-emerald-100"
          />
          <FeatureCard
            title="Diba"
            description="Kitab-kitab Diba dengan audio dan terjemahan"
            icon={
              <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            }
            href="/diba"
            color="bg-sky-100"
          />
          <FeatureCard
            title="Kitab Lainnya"
            description="Jelajahi berbagai koleksi kitab Islam lainnya"
            icon={
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            }
            href="/kitab"
            color="bg-amber-100"
          />
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="max-w-4xl mx-auto px-6 py-8 pb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Akses Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <QuickAccessItem
            title="Lanjutkan Membaca"
            subtitle="Kembali ke bacaan terakhir"
            href="/?id=1"
          />
          <QuickAccessItem
            title="Pilihan Populer"
            subtitle="Kitab yang sering dibaca"
            href="/kitab"
          />
          <QuickAccessItem
            title="Audio Terbaru"
            subtitle="Dengarkan lantunan terbaru"
            href="/diba"
          />
          <QuickAccessItem
            title="Pencarian"
            subtitle="Cari ayat atau kitab"
            href="/kitab"
          />
        </div>
      </section>
    </div>
  );
}
