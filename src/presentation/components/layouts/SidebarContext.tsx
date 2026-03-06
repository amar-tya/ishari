'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  expandSidebar: () => void;
  collapseSidebar: () => void;
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Start with false to ensure consistent SSR/client initial render
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hasMounted = useRef(false);

  // Only run client-specific logic after hydration is complete
  useEffect(() => {
    // Skip if already mounted (prevents double-run in StrictMode)
    if (hasMounted.current) return;
    hasMounted.current = true;

    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 1024; // Align with lg: breakpoint
      const savedState = localStorage.getItem('sidebar-collapsed');

      if (isMobile) {
        setIsCollapsed(true);
      } else if (savedState) {
        setIsCollapsed(savedState === 'true');
      }
    };

    // Initial check after mount
    checkScreenSize();

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  const expandSidebar = () => {
    setIsCollapsed(false);
    localStorage.setItem('sidebar-collapsed', 'false');
  };

  const collapseSidebar = () => {
    setIsCollapsed(true);
    localStorage.setItem('sidebar-collapsed', 'true');
  };

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        expandSidebar,
        collapseSidebar,
        isMobileMenuOpen,
        openMobileMenu,
        closeMobileMenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
