'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen bg-background w-full max-w-full overflow-x-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />
      <main className="flex-1 w-full transition-all duration-300 min-w-0 max-w-full overflow-x-hidden lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border/50 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between shadow-md w-full max-w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 hover:bg-primary/10"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent truncate mx-2 flex-1 min-w-0">
            UPSC Assistant
          </h1>
          <ThemeToggle />
        </div>
        
        {/* Desktop header */}
        <div className="hidden lg:flex sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border/50 px-6 lg:px-8 py-3 lg:py-4 items-center justify-end shadow-md w-full max-w-full">
          <ThemeToggle />
        </div>
        
        {/* Content */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-full overflow-x-hidden box-border">
          <div className="w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
