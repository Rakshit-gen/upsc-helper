'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Calendar,
  BookOpen,
  Newspaper,
  FileText,
  History,
  StickyNote,
  Lightbulb,
  Brain,
  PenTool,
  BarChart3,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/planner', label: 'Study Planner', icon: Calendar },
  { href: '/topics', label: 'Topic Breakdown', icon: BookOpen },
  { href: '/current-affairs', label: 'Current Affairs', icon: Newspaper },
  { href: '/test', label: 'Test Engine', icon: FileText },
  { href: '/pyq', label: 'PYQ Analyzer', icon: History },
  { href: '/notes', label: 'Notes & Mindmap', icon: StickyNote },
  { href: '/explain', label: 'Explain Mode', icon: Lightbulb },
  { href: '/revision', label: 'Revision System', icon: Brain },
  { href: '/essay', label: 'Essay & Ethics', icon: PenTool },
  { href: '/progress', label: 'Progress Tracking', icon: BarChart3 },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ isOpen = false, onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'w-64 bg-card border-r border-border h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:relative lg:flex-shrink-0',
          isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Navigation sidebar"
      >
        <div className="p-4 lg:p-6 flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-sm z-10 border-b border-border/50 lg:border-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent truncate">
            UPSC Assistant
          </h1>
          {onClose && isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden h-8 w-8 flex-shrink-0"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <nav className="px-2 sm:px-3 pb-6 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile && onClose) {
                    onClose();
                  }
                }}
                className={cn(
                  'flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 rounded-lg mb-1.5 transition-all duration-200 text-sm sm:text-base',
                  'truncate group relative',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1'
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="font-medium truncate">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
