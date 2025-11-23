'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Notes() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
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
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Notes & Mindmap Generator</h1>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Input Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text to convert into notes..."
              className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base"
            />
            <Button onClick={generateNotes} disabled={loading || !text}>
              {loading ? 'Generating...' : 'Generate Notes'}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="structured">
                <TabsList className="grid w-full grid-cols-3 text-[10px] xs:text-xs sm:text-sm">
                  <TabsTrigger value="structured" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3">Structured Notes</TabsTrigger>
                  <TabsTrigger value="mindmap" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3">Mindmap</TabsTrigger>
                  <TabsTrigger value="summary" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="structured" className="space-y-3 sm:space-y-4">
                  <div className="whitespace-pre-wrap text-xs sm:text-sm break-words max-w-full overflow-x-auto">{result.structuredNotes}</div>
                </TabsContent>

                <TabsContent value="mindmap" className="space-y-3 sm:space-y-4">
                  <div className="border rounded p-3 sm:p-4 overflow-x-auto">
                    {result.mindmap && renderMindmap(result.mindmap)}
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="space-y-3 sm:space-y-4">
                  <div className="prose max-w-none text-xs sm:text-sm">
                    <p className="break-words">{result.summary}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function renderMindmap(data: any) {
  return (
    <div className="pl-2 sm:pl-4">
      <div className="font-bold text-sm sm:text-base md:text-lg mb-2 break-words">{data.central}</div>
      {data.branches?.map((branch: any, idx: number) => (
        <div key={idx} className="ml-3 sm:ml-6 mt-2 sm:mt-3">
          <div className="font-semibold text-primary text-xs sm:text-sm break-words">{branch.title}</div>
          <ul className="list-disc list-inside ml-2 sm:ml-4 mt-1 space-y-1">
            {branch.points?.map((point: string, pIdx: number) => (
              <li key={pIdx} className="text-xs sm:text-sm break-words">{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
