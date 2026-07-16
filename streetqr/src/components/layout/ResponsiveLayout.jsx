import React, { useState, useEffect } from 'react';
import '../../styles/layout/ResponsiveLayout.css';

/**
 * ResponsiveLayout - Main application layout wrapper
 * 
 * Features:
 * - Responsive breakpoints (mobile, tablet, desktop)
 * - Sidebar support (desktop)
 * - Top navigation bar
 * - Mobile bottom navigation
 * - Safe area padding
 * - Dynamic layout based on screen size
 * 
 * @example
 * <ResponsiveLayout
 *   sidebar={<Sidebar />}
 *   topBar={<TopBar />}
 *   bottomNav={<BottomNav />}
 *   mainContent={<MainContent />}
 * />
 */

const ResponsiveLayout = ({
  sidebar,
  topBar,
  bottomNav,
  children,
  mainClassName = '',
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="responsive-layout">
      {/* TOP BAR */}
      {topBar && (
        <header className="responsive-layout__top-bar">
          {topBar}
        </header>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="responsive-layout__content-wrapper">
        {/* SIDEBAR - Desktop Only */}
        {sidebar && !isMobile && (
          <aside className={`responsive-layout__sidebar ${sidebarOpen ? 'responsive-layout__sidebar--open' : ''}`}>
            {sidebar}
          </aside>
        )}

        {/* MOBILE SIDEBAR OVERLAY */}
        {sidebar && isMobile && sidebarOpen && (
          <>
            <div
              className="responsive-layout__backdrop"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="responsive-layout__sidebar responsive-layout__sidebar--mobile responsive-layout__sidebar--open">
              {sidebar}
            </aside>
          </>
        )}

        {/* MAIN CONTENT */}
        <main className={`responsive-layout__main ${mainClassName}`}>
          {children}
        </main>
      </div>

      {/* BOTTOM NAVIGATION - Mobile Only */}
      {bottomNav && isMobile && (
        <nav className="responsive-layout__bottom-nav">
          {bottomNav}
        </nav>
      )}
    </div>
  );
};

export default ResponsiveLayout;
