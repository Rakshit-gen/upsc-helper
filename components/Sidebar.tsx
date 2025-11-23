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
  Sparkles,
  GraduationCap,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { 
        href: '/', 
        label: 'Dashboard', 
        icon: BarChart3,
        description: 'Your study overview'
      },
      { 
        href: '/progress', 
        label: 'Progress Tracking', 
        icon: TrendingUp,
        description: 'Track your journey'
      },
    ],
  },
  {
    title: 'Study Tools',
    items: [
      { 
        href: '/planner', 
        label: 'Study Planner', 
        icon: Calendar,
        description: 'Plan your schedule'
      },
      { 
        href: '/topics', 
        label: 'Topic Breakdown', 
        icon: BookOpen,
        description: 'Break down topics'
      },
      { 
        href: '/notes', 
        label: 'Notes & Mindmap', 
        icon: StickyNote,
        description: 'Create notes'
      },
      { 
        href: '/explain', 
        label: 'Explain Mode', 
        icon: Lightbulb,
        description: 'Get explanations'
      },
    ],
  },
  {
    title: 'Practice & Test',
    items: [
      { 
        href: '/test', 
        label: 'Test Engine', 
        icon: FileText,
        description: 'Practice tests',
        badge: 'New'
      },
      { 
        href: '/pyq', 
        label: 'PYQ Analyzer', 
        icon: History,
        description: 'Previous year questions'
      },
      { 
        href: '/revision', 
        label: 'Revision System', 
        icon: Brain,
        description: 'Spaced repetition'
      },
    ],
  },
  {
    title: 'Resources',
    items: [
      { 
        href: '/current-affairs', 
        label: 'Current Affairs', 
        icon: Newspaper,
        description: 'Stay updated'
      },
      { 
        href: '/essay', 
        label: 'Essay & Ethics', 
        icon: PenTool,
        description: 'Writing frameworks'
      },
      { 
        href: '/motivation', 
        label: 'Motivation', 
        icon: Sparkles,
        description: 'Stay motivated'
      },
    ],
  },
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'w-72 bg-gradient-to-b from-card via-card to-card/95 border-r border-border/50 h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-all duration-300 ease-in-out shadow-2xl',
          'lg:translate-x-0 lg:relative lg:flex-shrink-0',
          isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full',
          'scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent'
        )}
        aria-label="Navigation sidebar"
        style={{
          backgroundImage: 'linear-gradient(to bottom, hsl(var(--card)), hsl(var(--card) / 0.98))',
        }}
      >
        {/* Header Section */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-card/95 via-card/90 to-card/80 backdrop-blur-xl border-b border-border/50 shadow-lg">
          <div className="p-5 lg:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-lg"></div>
                
              </div>
            </div>
            {onClose && isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden h-9 w-9 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Content */}
        <nav className="px-3 sm:px-4 pb-8 pt-4 space-y-6">
          {navGroups.map((group, groupIdx) => (
            <div key={group.title} className="space-y-2">
              <div className="px-3 mb-2">
                <h2 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  <span>{group.title}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
                </h2>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
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
                        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                        'hover:translate-x-1',
                        isActive
                          ? 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary shadow-lg shadow-primary/10 border border-primary/20'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary via-primary/80 to-primary rounded-r-full shadow-lg shadow-primary/50"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl"></div>
                        </>
                      )}
                      
                      {/* Icon */}
                      <div className={cn(
                        "relative z-10 flex-shrink-0 transition-all duration-200",
                        isActive 
                          ? "scale-110" 
                          : "group-hover:scale-110"
                      )}>
                        <div className={cn(
                          "p-1.5 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-primary/10"
                            : "bg-muted/50 group-hover:bg-primary/5"
                        )}>
                          <Icon className={cn(
                            "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                          )} />
                        </div>
                      </div>
                      
                      {/* Label and Description */}
                      <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-semibold text-sm sm:text-base truncate transition-colors",
                            isActive ? "text-primary" : "text-foreground"
                          )}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className="text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className={cn(
                            "text-[10px] sm:text-xs mt-0.5 truncate transition-colors",
                            isActive ? "text-primary/70" : "text-muted-foreground/70"
                          )}>
                            {item.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Hover effect glow */}
                      {!isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="sticky bottom-0 mt-auto px-4 pb-4 pt-4 bg-gradient-to-t from-card via-card/95 to-transparent border-t border-border/50">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-3 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Quick Tip</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Use spaced repetition for better retention
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
