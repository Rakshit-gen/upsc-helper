'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StickyNote, Network, FileText, Copy, CheckCircle, Brain } from 'lucide-react';
import { MathRenderer } from '@/components/MathRenderer';

export default function Notes() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

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
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Notes & Mindmap Generator
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Transform your text into structured notes, mindmaps, and summaries
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:gap-8">
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-primary" />
              Input Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text to convert into notes..."
              className="min-h-[200px] sm:min-h-[250px] text-sm sm:text-base"
            />
            <Button 
              onClick={generateNotes} 
              disabled={loading || !text}
              className="w-full sm:w-auto text-sm sm:text-base"
              size="lg"
            >
              {loading ? 'Generating Notes...' : 'Generate Notes'}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Generated Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="structured">
                <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm mb-6">
                  <TabsTrigger value="structured" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Structured Notes</span>
                  </TabsTrigger>
                  <TabsTrigger value="mindmap" className="flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    <span>Mindmap</span>
                  </TabsTrigger>
                  <TabsTrigger value="summary" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Summary</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="structured" className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 border-blue-200/50 dark:border-blue-800/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Structured Notes
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.structuredNotes, 0)}
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
                        <div className="text-sm sm:text-base break-words max-w-full overflow-x-auto leading-relaxed">
                          <MathRenderer content={result.structuredNotes} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="mindmap" className="space-y-4">
                  <Card className="bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 border-purple-200/50 dark:border-purple-800/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <Network className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        Mindmap
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-primary/30 rounded-lg p-5 sm:p-6 overflow-x-auto bg-background/50">
                        {result.mindmap && renderMindmap(result.mindmap)}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="summary" className="space-y-4">
                  <Card className="bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20 border-green-200/50 dark:border-green-800/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                          Summary
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.summary, 1)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedIndex === 1 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="text-sm sm:text-base break-words leading-relaxed">
                          <MathRenderer content={result.summary} />
                        </div>
                      </div>
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

function renderMindmap(data: any) {
  return (
    <div className="pl-2 sm:pl-4 space-y-4">
      <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
        <div className="font-bold text-base sm:text-lg md:text-xl mb-2 break-words text-primary">{data.central}</div>
        <p className="text-xs text-muted-foreground">Central Topic</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.branches?.map((branch: any, idx: number) => (
          <div key={idx} className="p-4 bg-secondary/50 rounded-lg border border-primary/20">
            <div className="font-semibold text-primary text-sm sm:text-base mb-3 break-words flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              {branch.title}
            </div>
            <ul className="list-disc list-inside space-y-2 ml-2">
              {branch.points?.map((point: string, pIdx: number) => (
                <li key={pIdx} className="text-xs sm:text-sm break-words text-muted-foreground">{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
