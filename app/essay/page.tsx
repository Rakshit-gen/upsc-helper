'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool, FileText, Quote, List, BookOpen, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Essay() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateFramework = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Essay & Ethics Framework Assistant
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Generate comprehensive frameworks for essay and ethics answers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
              <PenTool className="h-5 w-5 text-primary" />
              Essay Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Enter Essay/Ethics Topic</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Impact of AI on Society"
                className="text-sm sm:text-base"
              />
            </div>
            <Button 
              onClick={generateFramework} 
              disabled={loading || !topic}
              className="w-full text-sm sm:text-base"
              size="lg"
            >
              {loading ? 'Generating Framework...' : 'Generate Framework'}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-5 sm:space-y-6">
            {result.outline && (
              <Card className="w-full border-primary/20 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                    <List className="h-5 w-5 text-primary" />
                    Essay Outline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.outline.map((section: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Section {idx + 1}
                        </Badge>
                        <p className="font-semibold text-sm sm:text-base break-words">{section.heading}</p>
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 ml-2">
                        {section.points?.map((point: string, pIdx: number) => (
                          <li key={pIdx} className="text-xs sm:text-sm text-muted-foreground break-words">{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {result.examples && (
              <Card className="w-full border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Examples & Case Studies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-3">
                    {result.examples.map((example: string, idx: number) => (
                      <li key={idx} className="text-sm break-words pl-2">{example}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.quotes && (
              <Card className="w-full border-primary/20 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                    <Quote className="h-5 w-5 text-primary" />
                    Relevant Quotes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.quotes.map((quote: any, idx: number) => (
                    <div key={idx} className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                      <p className="text-sm sm:text-base italic text-foreground break-words mb-2">"{quote.text}"</p>
                      <p className="text-xs text-muted-foreground break-words">— {quote.author}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {result.structure && (
              <Card className="w-full border-primary/20 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Structure Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm sm:text-base break-words max-w-full overflow-x-auto leading-relaxed p-4 bg-background/50 rounded-lg border">
                      {result.structure}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
