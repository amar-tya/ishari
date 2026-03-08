'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchInput, Avatar } from '../base';
import { BellIcon, ChevronRightIcon, MenuIcon, HomeIcon } from '../base/icons';
import { useSidebar } from './SidebarContext';
import { useUser } from '@/presentation/hooks';
import { useAuth } from '@/presentation/hooks/useAuth';

interface TopBarProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export const TopBar: React.FC<TopBarProps> = ({
  title = 'Dashboard Overview',
  breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Dashboard' }],
}) => {
  const router = useRouter();
  const { isCollapsed, openMobileMenu } = useSidebar();
  const marginLeft = isCollapsed ? '80px' : 'clamp(240px, 20vw, 280px)';
  const user = useUser();
  const { logout } = useAuth();

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

  return (
    <header
      className="
        bg-[var(--color-bg-card)]
        border-b border-[var(--color-border)]
        flex items-center justify-between
        sticky top-0 z-30
        transition-all duration-300 ease-in-out
        lg:ml-[var(--sidebar-margin)]
      "
      style={{
        padding: '0.75rem clamp(1rem, 2vw, 1.5rem)',
        // @ts-expect-error - CSS variable mapping
        '--sidebar-margin': marginLeft,
      }}
    >
      {/* Left: Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={openMobileMenu}
          className="lg:hidden p-2 -ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <MenuIcon size={24} />
        </button>
        <div>
          <h1 className="text-title">{title}</h1>
          <nav className="flex items-center gap-1 mt-0.5">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-caption text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-caption text-[var(--color-text-secondary)]">
                    {item.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="text-[var(--color-text-muted)]">
                    <ChevronRightIcon size={12} />
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div
        className="flex items-center"
        style={{ gap: 'clamp(0.75rem, 1.5vw, 1.5rem)' }}
      >
        {/* Public View Link */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-hover)] transition-all group"
          title="Lihat Halaman Publik"
        >
          <HomeIcon
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="hidden xl:block text-sm font-medium">
            Public View
          </span>
        </button>

        {/* Search */}
        <SearchInput
          className="hidden md:block"
          style={{ width: 'clamp(180px, 15vw, 250px)' }}
        />

        {/* Notification Bell */}
        <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
          <BellIcon size={22} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-error)] rounded-full" />
        </button>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center hover:bg-[var(--color-bg-hover)] p-1.5 rounded-lg transition-colors"
            style={{ gap: 'clamp(0.5rem, 1vw, 0.75rem)' }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Avatar
              initials={user?.username?.substring(0, 2).toUpperCase() || 'GU'}
              size="md"
            />
            <div className="hidden sm:block text-left">
              <p className="text-body font-medium leading-tight capitalize">
                {user?.username || 'Guest User'}
              </p>
              <p className="text-caption text-[var(--color-text-secondary)]">
                {user
                  ? user.role === 'super_admin'
                    ? 'Super Admin'
                    : user.role === 'admin_content'
                      ? 'Admin Content'
                      : 'User'
                  : 'Visitor'}
              </p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800 capitalize truncate">
                  {user?.username || 'Guest User'}
                </p>
                {user?.email && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {user.email}
                  </p>
                )}
              </div>
              <div className="py-1">
                {user ? (
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
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
                    className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
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
      </div>
    </header>
  );
};

export default TopBar;
