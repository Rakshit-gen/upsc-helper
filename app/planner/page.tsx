'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Planner() {
  const [formData, setFormData] = useState({
    hoursPerDay: '',
    prepStage: '',
    syllabusProgress: '',
  });
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Study Planner
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Get a personalized study plan based on your schedule and goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Your Details
            </CardTitle>
            <CardDescription className="mt-2">Tell us about your preparation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Hours Available Per Day
              </Label>
              <Input
                type="number"
                value={formData.hoursPerDay}
                onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })}
                placeholder="e.g., 6"
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Stage of Preparation
              </Label>
              <Select
                value={formData.prepStage}
                onValueChange={(value) => setFormData({ ...formData, prepStage: value })}
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="revision">Revision Phase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Syllabus Progress (%)
              </Label>
              <Input
                type="number"
                value={formData.syllabusProgress}
                onChange={(e) => setFormData({ ...formData, syllabusProgress: e.target.value })}
                placeholder="e.g., 40"
                className="text-sm sm:text-base"
              />
            </div>

            <Button 
              onClick={generatePlan} 
              disabled={loading} 
              className="w-full text-sm sm:text-base"
              size="lg"
            >
              {loading ? 'Generating Plan...' : 'Generate Plan'}
            </Button>
          </CardContent>
        </Card>

        {plan && (
          <div className="space-y-5 sm:space-y-6">
            {plan.dailyPlan && (
              <Card className="w-full border-primary/20 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Daily Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.dailyPlan.map((item: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.time}
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base break-words mt-2">{item.activity}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {plan.weeklyPlan && (
              <Card className="w-full border-primary/20 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Weekly Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.weeklyPlan.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs font-semibold">
                          {item.day}
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base break-words">{item.focus}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {plan.tips && (
              <Card className="w-full border-primary/20 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Study Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-3">
                    {plan.tips.map((tip: string, idx: number) => (
                      <li key={idx} className="text-sm sm:text-base break-words pl-2">{tip}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
