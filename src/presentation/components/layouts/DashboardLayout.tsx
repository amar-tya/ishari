'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { GlobalFooter } from '@/presentation/components/common/GlobalFooter';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

const DashboardContent: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  breadcrumbs,
}) => {
  const { isCollapsed } = useSidebar();
  const marginLeft = isCollapsed ? '80px' : 'clamp(240px, 20vw, 280px)';

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)]">
      <Sidebar />
      <TopBar title={title} breadcrumbs={breadcrumbs} />
      <div
        className="flex flex-col min-h-[calc(100vh-64px)] lg:ml-[var(--sidebar-margin)]"
        style={{
          // @ts-expect-error - CSS variable mapping
          '--sidebar-margin': marginLeft,
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        <main
          className="flex-grow"
          style={{
            padding: 'clamp(1rem, 2vw, 1.5rem)',
          }}
        >
          {children}
        </main>
        <GlobalFooter />
      </div>
    </div>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  return (
    <SidebarProvider>
      <DashboardContent {...props} />
    </SidebarProvider>
  );
};

export default DashboardLayout;
