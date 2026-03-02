'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,
} from '@/presentation/components/base/icons';

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { label: 'Muhud', href: '/muhud' },
    { label: 'Diba', href: '/diba' },
    { label: 'Kitab', href: '/kitab' },
    { label: 'Hadi', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 bg-[#51c878]/20 text-[#51c878] rounded-xl flex items-center justify-center">
              <BookIcon size={20} />
            </div>
            <h2 className="text-[#1e293b] text-xl font-bold tracking-tight">
              ISHARI
            </h2>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[#1e293b] font-semibold border-b-2 border-[#51c878] pb-0.5'
                    : 'text-[#475569] hover:text-[#51c878]'
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          {/* Search Bar - Hidden on small mobile, visible on desktop/large tablet */}
          <div className="hidden lg:flex items-center bg-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] rounded-full px-4 h-10 w-64 border border-slate-100">
            <SearchIcon className="text-[#51c878]/60" size={20} />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full text-[#1e293b] placeholder-slate-400 outline-none ml-2"
              placeholder="Search surah or verse..."
              type="text"
            />
          </div>

          <button className="lg:hidden p-2 text-slate-500 hover:text-[#51c878]">
            <SearchIcon size={20} />
          </button>

          {/* User Profile */}
          <div
            className="size-10 rounded-full bg-cover bg-center border-2 border-white shadow-[4px_4px_10px_rgba(81,200,120,0.1),-4px_-4px_10px_rgba(255,255,255,0.8)]"
            aria-label="User profile picture showing a smiling man"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD750I6TzeMoUpV0UOPq4UIDukr5QG9nZxC_4xLQ1BQQsIAywI6NNogVQbXXYLqv5iZcVGtX-Ard4szx4r1FIdkDJAZ6B5CgLrOr_4oqi2oZ0jcV1wayEE6lCzNFNjf8_X_yq8fJkdGTALqR8CSm4_aYPIoXe7J2M9jw4-JbVGan2hpUGdUg96SCDNLQVjpi5qF9aYCMvE3R-NKIl_0EqEOMxO2PTonn5USFZY6xtETbcE_z6SNlA8bvRFW-Jon_d_B2Z6Ygj8qJlE')",
            }}
          ></div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-500 hover:text-[#51c878] transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                className={`text-lg font-medium transition-colors ${
                  pathname === link.href ? 'text-[#51c878]' : 'text-slate-600'
                }`}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
