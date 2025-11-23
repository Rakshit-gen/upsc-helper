'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function PYQ() {
  const [filter, setFilter] = useState('all');
  const [questions, setQuestions] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [filter]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pyq?filter=${filter}`);
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const analyzeTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pyq/analyze', {
        method: 'POST',
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">PYQ Trend Analyzer</h1>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Filter Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[200px] text-xs sm:text-sm">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  <SelectItem value="polity">Polity</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="science">Science & Tech</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={analyzeTopics} disabled={loading} className="w-full sm:w-auto">
                Analyze Trends
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {analysis.topTopics && (
                <div>
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">High Frequency Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topTopics.map((topic: any, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs sm:text-sm">
                        {topic.name} ({topic.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {analysis.likelyTopics && (
                <div>
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Likely Topics for Next Exam</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.likelyTopics.map((topic: string, idx: number) => (
                      <li key={idx} className="text-xs sm:text-sm break-words">{topic}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Previous Year Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-xs sm:text-sm">Loading...</p>
            ) : questions.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {questions.map((q, idx) => (
                  <div key={idx} className="border-b pb-3 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                      <p className="font-medium flex-1 text-xs sm:text-sm break-words">{q.question}</p>
                      <Badge className="self-start sm:self-auto text-xs">{q.year}</Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">Topic: {q.topic}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground">No questions found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
