'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function ProgressTracking() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/progress');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Progress Tracking</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Study Time</CardTitle>
            <CardDescription>Weekly statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs sm:text-sm">This Week</span>
                  <span className="text-xs sm:text-sm font-semibold">{data?.weeklyHours || 0}h</span>
                </div>
                <Progress value={((data?.weeklyHours || 0) / 40) * 100} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs sm:text-sm">Last Week</span>
                  <span className="text-xs sm:text-sm font-semibold">{data?.lastWeekHours || 0}h</span>
                </div>
                <Progress value={((data?.lastWeekHours || 0) / 40) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Test Performance</CardTitle>
            <CardDescription>Recent results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Tests Completed</p>
                <p className="text-xl sm:text-2xl font-bold">{data?.testsCompleted || 0}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Average Score</p>
                <p className="text-xl sm:text-2xl font-bold">{data?.avgScore || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Revision Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs sm:text-sm">Flashcards Reviewed</span>
                  <span className="text-xs sm:text-sm font-semibold">{data?.flashcardsReviewed || 0}</span>
                </div>
                <Progress value={((data?.flashcardsReviewed || 0) / (data?.totalFlashcards || 1)) * 100} />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">Due for Revision</p>
                <p className="text-lg sm:text-xl font-bold">{data?.dueForRevision || 0} cards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Weekly Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {data?.weeklyAnalytics?.map((day: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center gap-2">
                  <span className="text-xs sm:text-sm flex-shrink-0">{day.day}</span>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">{day.hours}h</span>
                    <div className="flex-1 bg-secondary rounded-full h-2 min-w-0">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(day.hours / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentActivities?.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {data.recentActivities.map((activity: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 sm:gap-3 border-b pb-2 sm:pb-3 last:border-0">
                    <div className="bg-primary/10 rounded p-1.5 sm:p-2 mt-1 flex-shrink-0">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm break-words">{activity.description}</p>
                      <p className="text-[10px] xs:text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
