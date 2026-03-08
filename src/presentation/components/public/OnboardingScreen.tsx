'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Selamat Datang di ISHARI',
    description:
      'Aplikasi digital untuk mempelajari dan menghafal kitab-kitab Islam dengan mudah dan terstruktur.',
    icon: (
      <svg
        className="w-16 h-16 text-emerald-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Koleksi Kitab Lengkap',
    description:
      'Akses berbagai kitab seperti Diba, Muhud, Diwan, Muradah, dan masih banyak lagi dengan terjemahan yang akurat.',
    icon: (
      <svg
        className="w-16 h-16 text-emerald-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Audio & Terjemahan',
    description:
      'Dengarkan lantunan ayat dengan audio berkualitas dan pahami maknanya melalui terjemahan bahasa Indonesia.',
    icon: (
      <svg
        className="w-16 h-16 text-emerald-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
        />
      </svg>
    ),
  },
];

export function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Navigate to homepage
      localStorage.setItem('ishari_onboarding_complete', 'true');
      router.push('/');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('ishari_onboarding_complete', 'true');
    router.push('/');
  };

  const handleGetStarted = () => {
    localStorage.setItem('ishari_onboarding_complete', 'true');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-4 md:p-6">
        <button
          onClick={handleSkip}
          className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors px-4 py-2"
        >
          Lewati
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Icon Container */}
        <div className="mb-8 p-6 bg-emerald-100/50 rounded-3xl">
          {slides[currentSlide].icon}
        </div>

        {/* Text Content */}
        <div className="text-center max-w-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-balance">
            {slides[currentSlide].title}
          </h1>
          <p className="text-slate-600 leading-relaxed text-balance">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-8 md:pb-12">
        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-emerald-600'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="max-w-sm mx-auto space-y-3">
          {currentSlide === slides.length - 1 ? (
            <button
              onClick={handleGetStarted}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-emerald-600/20"
            >
              Mulai Sekarang
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-emerald-600/20"
            >
              Lanjutkan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
