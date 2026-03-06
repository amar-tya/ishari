'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { useLayoutViewModel } from '@/presentation/view-models';
import {
  MasterDataIcon,
  DashboardIcon,
  BookmarkIcon,
  BookIcon,
  ChaptersIcon,
  RefreshIcon,
  SearchHistoryIcon,
  TranslationsIcon,
  UsersIcon,
  UserIcon,
  VersesIcon,
  VerseMediaIcon,
  LogoutIcon,
  ChevronLeftIcon,
} from '../base/icons';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
    ],
  },
  {
    title: 'MASTER TABLES',
    items: [
      { label: 'Bookmarks', href: '/bookmarks', icon: <BookmarkIcon /> },
      { label: 'Books', href: '/books', icon: <BookIcon /> },
      { label: 'Chapters', href: '/chapters', icon: <ChaptersIcon /> },
      {
        label: 'Refresh Tokens',
        href: '/refresh-tokens',
        icon: <RefreshIcon />,
      },
      {
        label: 'Search History',
        href: '/search-history',
        icon: <SearchHistoryIcon />,
      },
      {
        label: 'Translations',
        href: '/translations',
        icon: <TranslationsIcon />,
      },
      { label: 'Users', href: '/users', icon: <UsersIcon /> },
      { label: 'Verses', href: '/verses', icon: <VersesIcon /> },
      { label: 'Hadi', href: '/hadi', icon: <UserIcon /> },
      { label: 'Verse Media', href: '/verse-media', icon: <VerseMediaIcon /> },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileMenuOpen, closeMobileMenu } =
    useSidebar();
  const { isLoggingOut, handleLogout } = useLayoutViewModel();

  // Adjusted clamp logic:
  // Collapsed: fixed 80px (icons centered)
  // Expanded: clamp(240px, 20vw, 280px) -> slightly wider min, constrained max
  const sidebarWidth = isCollapsed ? '80px' : 'clamp(240px, 20vw, 280px)';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-[100dvh]
          bg-[var(--color-bg-sidebar)]
          border-r border-[var(--color-border)]
          flex flex-col
          z-50
          shadow-[var(--shadow-lg)]
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:flex
        `}
        style={{ width: sidebarWidth }}
      >
        {/* Logo */}
        <div
          className={`
          flex items-center gap-3 border-b border-[var(--color-border-light)]
          ${isCollapsed ? 'justify-center' : ''}
        `}
          style={{
            height: '80px',
            padding: isCollapsed ? '0' : 'clamp(1rem, 2vw, 1.5rem)',
            transition: 'padding 0.3s',
          }}
        >
          <div className="flex-shrink-0">
            <MasterDataIcon size={isCollapsed ? 32 : 36} />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-subtitle font-bold text-[var(--color-text-primary)]">
                Master Data
              </h1>
              <p className="text-caption text-[var(--color-text-muted)]">
                ISHARI Admin v2.0
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar py-6">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-6">
              {!isCollapsed && (
                <h3
                  className="text-caption uppercase tracking-wider font-semibold mb-2 text-[var(--color-text-muted)] opacity-80"
                  style={{ paddingLeft: 'clamp(1.5rem, 2vw, 2rem)' }}
                >
                  {group.title}
                </h3>
              )}
              {isCollapsed && group.title === 'MASTER TABLES' && (
                <div className="h-px w-8 mx-auto bg-[var(--color-border-light)] mb-4" />
              )}

              <ul className="space-y-1 px-3">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={isCollapsed ? item.label : ''}
                        className={`
                        flex items-center gap-3 rounded-lg transition-all duration-200
                        ${isCollapsed ? 'justify-center p-3' : 'px-4 py-2'}
                        ${
                          isActive
                            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-main)] hover:text-[var(--color-text-primary)]'
                        }
                      `}
                      >
                        <span
                          className={`flex-shrink-0 ${isActive ? 'text-[var(--color-primary)]' : ''}`}
                        >
                          {/* Clone element to force size if needed, or rely on css */}
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <span className="text-menu font-medium whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-[var(--color-border-light)] bg-[var(--color-bg-sidebar)]">
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="
            w-full flex items-center justify-center p-4
            text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
            hover:bg-[var(--color-bg-main)] transition-colors
            border-b border-[var(--color-border-light)]
          "
          >
            <div
              className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            >
              <ChevronLeftIcon />
            </div>
          </button>

          {/* Logout */}
          <div
            style={{
              padding: isCollapsed ? '1rem' : 'clamp(0.75rem, 1.5vw, 1rem)',
            }}
          >
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`
              flex items-center gap-3 w-full rounded-lg
              bg-red-50 text-red-600
              transition-all duration-200
              hover:bg-red-100 hover:shadow-sm
              font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3'}
            `}
              title={isCollapsed ? 'Logout' : ''}
            >
              <LogoutIcon />
              {!isCollapsed && (
                <span className="text-menu">
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
