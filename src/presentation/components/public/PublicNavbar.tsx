'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/presentation/hooks';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Avatar } from '@/presentation/components/base';
import {
  BookIcon,
  // SearchIcon,
  MenuIcon,
  CloseIcon,
} from '@/presentation/components/base/icons';

export function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
  const { logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          {/* <div className="hidden lg:flex items-center bg-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] rounded-full px-4 h-10 w-64 border border-slate-100">
            <SearchIcon className="text-[#51c878]/60" size={20} />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full text-[#1e293b] placeholder-slate-400 outline-none ml-2"
              placeholder="Search surah or verse..."
              type="text"
            />
          </div> */}

          {/* <button className="lg:hidden p-2 text-slate-500 hover:text-[#51c878]">
            <SearchIcon size={20} />
          </button> */}

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center justify-center size-10 rounded-full border-2 border-white shadow-[4px_4px_10px_rgba(81,200,120,0.1),-4px_-4px_10px_rgba(255,255,255,0.8)] transition-transform hover:scale-105"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="User profile menu"
            >
              <Avatar
                initials={user?.username?.substring(0, 2).toUpperCase() || 'GU'}
                size="sm"
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-slate-100 py-1 z-50 flex flex-col overflow-hidden">
                <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800 capitalize truncate">
                    {user?.username || 'Guest User'}
                  </p>
                  {user?.email && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  )}
                  {!user && (
                    <p className="text-xs text-slate-500 mt-0.5">Visitor</p>
                  )}
                </div>
                <div className="py-1">
                  {user ? (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                      Keluar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push('/login');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#51c878] hover:bg-[#51c878]/10 transition-colors flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H9"
                        />
                      </svg>
                      Masuk
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

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
