'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Study Planner</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Your Details</CardTitle>
            <CardDescription>Tell us about your preparation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <Label>Hours Available Per Day</Label>
              <Input
                type="number"
                value={formData.hoursPerDay}
                onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })}
                placeholder="e.g., 6"
              />
            </div>

            <div>
              <Label>Stage of Preparation</Label>
              <Select
                value={formData.prepStage}
                onValueChange={(value) => setFormData({ ...formData, prepStage: value })}
              >
                <SelectTrigger>
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

            <div>
              <Label>Syllabus Progress (%)</Label>
              <Input
                type="number"
                value={formData.syllabusProgress}
                onChange={(e) => setFormData({ ...formData, syllabusProgress: e.target.value })}
                placeholder="e.g., 40"
              />
            </div>

            <Button onClick={generatePlan} disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Generate Plan'}
            </Button>
          </CardContent>
        </Card>

        {plan && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Your Personalized Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {plan.dailyPlan && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Daily Schedule</h3>
                    <div className="space-y-2">
                      {plan.dailyPlan.map((item: any, idx: number) => (
                        <div key={idx} className="border-l-2 border-primary pl-2 sm:pl-3">
                          <p className="font-medium text-xs sm:text-sm">{item.time}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground break-words">{item.activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {plan.weeklyPlan && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Weekly Focus</h3>
                    <div className="space-y-2">
                      {plan.weeklyPlan.map((item: any, idx: number) => (
                        <div key={idx} className="bg-secondary p-2 sm:p-3 rounded">
                          <p className="font-medium text-xs sm:text-sm">{item.day}</p>
                          <p className="text-xs sm:text-sm break-words">{item.focus}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {plan.tips && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Tips</h3>
                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-muted-foreground">
                      {plan.tips.map((tip: string, idx: number) => (
                        <li key={idx} className="break-words">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
