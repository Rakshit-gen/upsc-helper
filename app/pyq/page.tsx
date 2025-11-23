'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, FileText, Target, Calendar, Search } from 'lucide-react';

export default function PYQ() {
  const [topicFilter, setTopicFilter] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const filter = topicFilter.trim() || 'all';
      const response = await fetch(`/api/pyq?filter=${encodeURIComponent(filter)}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setQuestions([]);
      } else {
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Failed to generate questions. Please try again.');
      setQuestions([]);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    loadQuestions();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const analyzeTopics = async (topic?: string) => {
    setAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/pyq/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic || topicFilter.trim() || 'UPSC General Studies' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze trends');
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setAnalysis(null);
      } else {
        setAnalysis(data);
      }
    } catch (error) {
      console.error('Error analyzing trends:', error);
      setError('Failed to analyze trends. Please try again.');
      setAnalysis(null);
    }
    setAnalyzing(false);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          AI-Powered PYQ Generator
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Generate UPSC-style questions based on previous year trends and patterns
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:gap-8">
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Generate & Analyze Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Generate Questions by Topic</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={topicFilter}
                      onChange={(e) => setTopicFilter(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="e.g., Polity, History, Geography, Economy (leave empty for general questions)"
                      className="pl-10 text-sm sm:text-base"
                    />
                  </div>
                  <Button 
                    onClick={handleSearch} 
                    disabled={loading} 
                    className="w-full sm:w-auto text-sm sm:text-base"
                    size="lg"
                  >
                    {loading ? 'Generating...' : 'Generate Questions'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  AI will generate UPSC-style questions based on previous year trends for your topic
                </p>
              </div>
              
              <div className="pt-3 border-t">
                <Button 
                  onClick={() => {
                    const topic = topicFilter.trim() || 'UPSC General Studies';
                    analyzeTopics(topic);
                  }} 
                  disabled={analyzing} 
                  className="w-full text-sm sm:text-base"
                  size="lg"
                  variant="outline"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {analyzing ? 'Analyzing Trends...' : 'Analyze Trends'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Get AI-powered trend analysis and predictions for your topic
                </p>
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {analysis && (
          <Card className="w-full bg-gradient-to-br from-purple-50/50 to-blue-50/30 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200/50 dark:border-purple-800/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {analysis.topTopics && analysis.topTopics.length > 0 ? (
                <div>
                  <h3 className="font-semibold mb-3 text-sm sm:text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    High Frequency Topics
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {analysis.topTopics.map((topic: any, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs sm:text-sm px-3 py-1.5">
                        {topic.name} <span className="ml-1 font-bold text-primary">({topic.count})</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground text-center">
                    No topic data available. Add more PYQ questions to see trends.
                  </p>
                </div>
              )}

              {analysis.likelyTopics && analysis.likelyTopics.length > 0 ? (
                <div>
                  <h3 className="font-semibold mb-3 text-sm sm:text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Likely Topics for Next Exam
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    {analysis.likelyTopics.map((topic: string, idx: number) => (
                      <li key={idx} className="text-sm sm:text-base break-words pl-2">{topic}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground text-center">
                    Unable to generate predictions. Please try again or add more questions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Generated PYQ-Style Questions ({questions.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              AI-generated questions based on previous year patterns and trends
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm sm:text-base text-center py-8 text-muted-foreground">Generating questions with AI...</p>
            ) : questions.length > 0 ? (
              <div className="space-y-4 sm:space-y-5">
                {questions.map((q, idx) => (
                  <Card key={idx} className="border-2 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {q.year}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{q.topic}</Badge>
                      </div>
                      <p className="text-sm sm:text-base break-words leading-relaxed">{q.question}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-center py-8 text-muted-foreground">No questions found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
