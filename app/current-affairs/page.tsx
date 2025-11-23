'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CurrentAffairs() {
  const [article, setArticle] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Current Affairs Processor</h1>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Paste Article/News</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <Textarea
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              placeholder="Paste news article or current affairs content..."
              className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base"
            />
            <Button onClick={processArticle} disabled={loading || !article}>
              {loading ? 'Processing...' : 'Process Article'}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Processed Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="prelims">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 text-[10px] xs:text-xs sm:text-sm">
                  <TabsTrigger value="prelims" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3">Prelims Facts</TabsTrigger>
                  <TabsTrigger value="mains" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3">Mains Analysis</TabsTrigger>
                  <TabsTrigger value="keywords" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3">Keywords</TabsTrigger>
                  <TabsTrigger value="oneliners" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3">One-liners</TabsTrigger>
                </TabsList>

                <TabsContent value="prelims" className="space-y-2 sm:space-y-3">
                  {result.prelimsFacts?.map((fact: string, idx: number) => (
                    <div key={idx} className="border-l-2 border-primary pl-2 sm:pl-3 py-2">
                      <p className="text-xs sm:text-sm break-words">{fact}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="mains" className="space-y-3 sm:space-y-4">
                  <div className="whitespace-pre-wrap text-xs sm:text-sm break-words max-w-full overflow-x-auto">{result.mainsAnalysis}</div>
                </TabsContent>

                <TabsContent value="keywords" className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {result.keywords?.map((keyword: string, idx: number) => (
                      <span key={idx} className="bg-secondary px-2 sm:px-3 py-1 rounded text-xs sm:text-sm break-words">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="oneliners" className="space-y-2">
                  {result.oneLiners?.map((liner: string, idx: number) => (
                    <div key={idx} className="bg-secondary p-2 sm:p-3 rounded text-xs sm:text-sm break-words">
                      {liner}
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
