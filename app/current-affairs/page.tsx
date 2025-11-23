'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Newspaper, FileCheck, BookOpen, Hash, List, Copy, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MathRenderer } from '@/components/MathRenderer';

export default function CurrentAffairs() {
  const [article, setArticle] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [generatedArticle, setGeneratedArticle] = useState<any>(null);

  const copyToClipboard = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const processArticle = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/current-affairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const generateRandomCurrentAffairs = async () => {
    setGenerating(true);
    setGeneratedArticle(null);
    setResult(null);
    try {
      const response = await fetch('/api/current-affairs/generate');
      const data = await response.json();
      if (data.error) {
        console.error('Error generating:', data.error);
      } else {
        setGeneratedArticle(data);
        // Auto-populate the textarea
        setArticle(data.article);
        // Auto-process the generated article
        const processResponse = await fetch('/api/current-affairs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article: data.article }),
        });
        const processData = await processResponse.json();
        setResult(processData);
      }
    } catch (error) {
      console.error('Error generating current affairs:', error);
    }
    setGenerating(false);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Current Affairs Processor
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Process news articles and extract UPSC-relevant information
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:gap-8">
        {/* Random Generator Card */}
        <Card className="w-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Random Current Affairs
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Get AI-generated recent current affairs topics relevant for UPSC
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateRandomCurrentAffairs} 
              disabled={generating}
              className="w-full text-sm sm:text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="lg"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Random Topic
                </>
              )}
            </Button>
            {generatedArticle && (
              <Card className="bg-background/80 border-primary/30">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {generatedArticle.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{generatedArticle.date}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-primary">
                    {generatedArticle.title}
                  </h3>
                  {generatedArticle.keyPoints && generatedArticle.keyPoints.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Key Points:</p>
                      <ul className="space-y-1.5">
                        {generatedArticle.keyPoints.slice(0, 5).map((point: string, idx: number) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="flex-1">{point}</span>
                          </li>
                        ))}
                      </ul>
                      {generatedArticle.keyPoints.length > 5 && (
                        <p className="text-xs text-muted-foreground italic">
                          + {generatedArticle.keyPoints.length - 5} more points...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground space-y-1">
                      {generatedArticle.article.split('\n').slice(0, 3).map((line: string, idx: number) => (
                        <p key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{line.trim()}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Manual Input Card */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              Paste Article/News
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Or paste your own article to process
            </p>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5">
            <Textarea
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              placeholder="Paste news article or current affairs content..."
              className="min-h-[200px] sm:min-h-[250px] text-sm sm:text-base"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={processArticle} 
                disabled={loading || !article}
                className="w-full sm:w-auto text-sm sm:text-base flex-1"
                size="lg"
              >
                {loading ? 'Processing Article...' : 'Process Article'}
              </Button>
              {article && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setArticle('');
                    setResult(null);
                    setGeneratedArticle(null);
                  }}
                  className="w-full sm:w-auto text-sm sm:text-base"
                  size="lg"
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Processed Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="prelims">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 text-xs sm:text-sm mb-6">
                  <TabsTrigger value="prelims" className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    <span>Prelims Facts</span>
                  </TabsTrigger>
                  <TabsTrigger value="mains" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Mains Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger value="keywords" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span>Keywords</span>
                  </TabsTrigger>
                  <TabsTrigger value="oneliners" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    <span>One-liners</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="prelims" className="space-y-3 sm:space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 border-blue-200/50 dark:border-blue-800/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Prelims Facts ({result.prelimsFacts?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.prelimsFacts?.map((fact: string, idx: number) => (
                        <div key={idx} className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg">
                          <div className="flex items-start gap-3">
                            <Badge variant="secondary" className="text-xs mt-0.5 flex-shrink-0">
                              {idx + 1}
                            </Badge>
                            <p className="text-sm sm:text-base break-words flex-1">{fact}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="mains" className="space-y-4">
                  <Card className="bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 border-purple-200/50 dark:border-purple-800/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          Mains Analysis
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.mainsAnalysis, 0)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedIndex === 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="text-sm sm:text-base break-words max-w-full overflow-x-auto leading-relaxed p-4 bg-background/50 rounded-lg border">
                          <MathRenderer content={result.mainsAnalysis} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="keywords" className="space-y-4">
                  <Card className="bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20 border-green-200/50 dark:border-green-800/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <Hash className="h-4 w-4 text-green-600 dark:text-green-400" />
                        Keywords ({result.keywords?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {result.keywords?.map((keyword: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs sm:text-sm px-3 py-1.5">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="oneliners" className="space-y-4">
                  <Card className="bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20 border-amber-200/50 dark:border-amber-800/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <List className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        One-liners ({result.oneLiners?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.oneLiners?.map((liner: string, idx: number) => (
                        <div key={idx} className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                          <div className="flex items-start gap-3">
                            <Badge variant="secondary" className="text-xs mt-0.5 flex-shrink-0">
                              {idx + 1}
                            </Badge>
                            <p className="text-sm sm:text-base break-words flex-1">{liner}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
