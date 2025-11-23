'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/progress')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Welcome back! Here's your study overview.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 md:mb-10">
        <Card className="w-full group relative overflow-hidden border-primary/20 dark:border-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="pb-2 sm:pb-3 relative z-10">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              Study Hours
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">This week</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {stats?.weeklyHours || 0}h
            </p>
          </CardContent>
        </Card>

        <Card className="w-full group relative overflow-hidden border-primary/20 dark:border-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="pb-2 sm:pb-3 relative z-10">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              Tests Completed
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Total</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {stats?.testsCompleted || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full sm:col-span-2 lg:col-span-1 group relative overflow-hidden border-primary/20 dark:border-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="pb-2 sm:pb-3 relative z-10">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              Avg Score
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Last 10 tests</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {stats?.avgScore || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        <Card className="w-full">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <span className="text-primary">⚡</span>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 sm:space-y-3">
            <Link href="/planner" className="block">
              <Button className="w-full text-sm sm:text-base group" variant="outline">
                <span className="group-hover:translate-x-1 transition-transform inline-block">📅</span>
                <span className="ml-2">Generate Study Plan</span>
              </Button>
            </Link>
            <Link href="/test" className="block">
              <Button className="w-full text-sm sm:text-base group" variant="outline">
                <span className="group-hover:translate-x-1 transition-transform inline-block">📝</span>
                <span className="ml-2">Take Practice Test</span>
              </Button>
            </Link>
            <Link href="/current-affairs" className="block">
              <Button className="w-full text-sm sm:text-base group" variant="outline">
                <span className="group-hover:translate-x-1 transition-transform inline-block">📰</span>
                <span className="ml-2">Process Current Affairs</span>
              </Button>
            </Link>
            <Link href="/revision" className="block">
              <Button className="w-full text-sm sm:text-base group" variant="outline">
                <span className="group-hover:translate-x-1 transition-transform inline-block">🔄</span>
                <span className="ml-2">Review Flashcards</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <span className="text-primary">📊</span>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentActivities?.length > 0 ? (
              <ul className="space-y-3">
                {stats.recentActivities.slice(0, 5).map((activity: any, idx: number) => (
                  <li key={idx} className="text-xs sm:text-sm text-muted-foreground break-words flex items-start gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform"></span>
                    <span className="flex-1">
                      {activity.description} 
                      <span className="text-muted-foreground/70 ml-1">- {new Date(activity.created_at).toLocaleDateString()}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs sm:text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
