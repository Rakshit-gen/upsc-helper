'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Save } from 'lucide-react';

export default function Topics() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [topic, setTopic] = useState('');

  const processContent = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const saveFlashcards = async () => {
    if (!result?.flashcards || result.flashcards.length === 0) {
      return;
    }

    setSaving(true);
    setSaved(false);
    try {
      const response = await fetch('/api/flashcards/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flashcards: result.flashcards,
          topic: topic || 'general',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Topic Breakdown</h1>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Input Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <Label className="text-xs sm:text-sm mb-2 block">Topic/Category (optional)</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Polity, History, Geography"
                className="text-sm sm:text-base"
              />
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste NCERT content or any topic text..."
              className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base"
            />
            <Button onClick={processContent} disabled={loading || !content} className="w-full sm:w-auto">
              {loading ? 'Processing...' : 'Generate Breakdown'}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="notes">
                <TabsList className="grid w-full grid-cols-3 text-[10px] xs:text-xs sm:text-sm">
                  <TabsTrigger value="notes" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3">Notes</TabsTrigger>
                  <TabsTrigger value="flashcards" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3">Flashcards</TabsTrigger>
                  <TabsTrigger value="quiz" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3">Quiz</TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="space-y-3 sm:space-y-4">
                  {result.notes && (
                    <div className="prose max-w-none w-full max-w-full">
                      <div className="whitespace-pre-wrap text-xs sm:text-sm break-words max-w-full overflow-x-auto">{result.notes}</div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="flashcards" className="space-y-3 sm:space-y-4">
                  {result.flashcards && result.flashcards.length > 0 && (
                    <div className="flex items-center justify-between mb-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div>
                        <p className="text-xs sm:text-sm font-medium">
                          {result.flashcards.length} flashcard{result.flashcards.length !== 1 ? 's' : ''} generated
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Save them to use in Revision System
                        </p>
                      </div>
                      <Button
                        onClick={saveFlashcards}
                        disabled={saving || saved}
                        className="text-xs sm:text-sm"
                        size="sm"
                      >
                        {saved ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {saving ? 'Saving...' : 'Save to Revision'}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  {result.flashcards?.map((card: any, idx: number) => (
                    <div key={idx} className="border rounded p-3 sm:p-4 hover:border-primary/50 transition-colors">
                      <p className="font-semibold mb-2 text-xs sm:text-sm break-words">Q: {card.question}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">A: {card.answer}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="quiz" className="space-y-3 sm:space-y-4">
                  {result.quiz?.map((q: any, idx: number) => (
                    <div key={idx} className="border rounded p-3 sm:p-4">
                      <p className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm break-words">{idx + 1}. {q.question}</p>
                      <div className="space-y-1 sm:space-y-2">
                        {q.options.map((opt: string, optIdx: number) => (
                          <div key={optIdx} className="text-xs sm:text-sm break-words">
                            {String.fromCharCode(65 + optIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-primary mt-2 sm:mt-3 break-words">Correct: {q.correct}</p>
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
