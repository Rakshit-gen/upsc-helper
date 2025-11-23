'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Essay & Ethics Framework Assistant</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Essay Topic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <Label>Enter Essay/Ethics Topic</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Impact of AI on Society"
              />
            </div>
            <Button onClick={generateFramework} disabled={loading || !topic}>
              {loading ? 'Generating...' : 'Generate Framework'}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Framework</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {result.outline && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Outline</h3>
                  <div className="space-y-2">
                    {result.outline.map((section: any, idx: number) => (
                      <div key={idx} className="border-l-2 border-primary pl-2 sm:pl-3">
                        <p className="font-medium text-xs sm:text-sm break-words">{section.heading}</p>
                        <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground">
                          {section.points?.map((point: string, pIdx: number) => (
                            <li key={pIdx} className="break-words">{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.examples && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Examples</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                    {result.examples.map((example: string, idx: number) => (
                      <li key={idx} className="break-words">{example}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.quotes && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Relevant Quotes</h3>
                  <div className="space-y-2">
                    {result.quotes.map((quote: any, idx: number) => (
                      <div key={idx} className="bg-secondary p-2 sm:p-3 rounded">
                        <p className="text-xs sm:text-sm italic break-words">"{quote.text}"</p>
                        <p className="text-[10px] xs:text-xs text-muted-foreground mt-1 break-words">- {quote.author}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.structure && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Structure Guide</h3>
                  <p className="text-xs sm:text-sm whitespace-pre-wrap break-words max-w-full overflow-x-auto">{result.structure}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
