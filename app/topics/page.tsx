'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Save, FileText, Brain, HelpCircle, Copy, CheckCircle, BookOpen, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Topics() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [topic, setTopic] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

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

  const toggleCard = (idx: number) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(idx)) {
      newFlipped.delete(idx);
    } else {
      newFlipped.add(idx);
    }
    setFlippedCards(newFlipped);
  };

  const copyToClipboard = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
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
              <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Generated Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="notes">
                <TabsList className="grid w-full grid-cols-3 text-[10px] xs:text-xs sm:text-sm mb-4 sm:mb-6">
                  <TabsTrigger value="notes" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3 flex items-center gap-1 sm:gap-2">
                    <FileText className="h-3 w-3" />
                    <span>Notes</span>
                  </TabsTrigger>
                  <TabsTrigger value="flashcards" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3 flex items-center gap-1 sm:gap-2">
                    <Brain className="h-3 w-3" />
                    <span>Flashcards</span>
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="text-[10px] xs:text-xs sm:text-sm px-1 sm:px-3 flex items-center gap-1 sm:gap-2">
                    <HelpCircle className="h-3 w-3" />
                    <span>Quiz</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="space-y-3 sm:space-y-4">
                  {result.notes && (
                    <Card className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 border-blue-200/50 dark:border-blue-800/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            Structured Notes
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.notes, -1)}
                            className="h-7 w-7 p-0"
                          >
                            {copiedIndex === -1 ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none w-full">
                          <div className="whitespace-pre-wrap text-xs sm:text-sm break-words max-w-full overflow-x-auto leading-relaxed">
                            {result.notes}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="flashcards" className="space-y-4 sm:space-y-6">
                  {result.flashcards && result.flashcards.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold">
                            {result.flashcards.length} Flashcard{result.flashcards.length !== 1 ? 's' : ''} Generated
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Click cards to flip • Save to use in Revision System
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={saveFlashcards}
                        disabled={saving || saved}
                        className="text-xs sm:text-sm w-full sm:w-auto"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {result.flashcards?.map((card: any, idx: number) => {
                      const isFlipped = flippedCards.has(idx);
                      return (
                        <div
                          key={idx}
                          className="relative group cursor-pointer"
                          onClick={() => toggleCard(idx)}
                        >
                          <div 
                            className="relative h-[200px] sm:h-[220px]"
                            style={{ perspective: '1000px' }}
                          >
                            <div
                              className={`relative w-full h-full transition-transform duration-500`}
                              style={{
                                transformStyle: 'preserve-3d',
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                              }}
                            >
                              {/* Front of card */}
                              <div
                                className="absolute inset-0 rounded-xl border-2 p-4 sm:p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 flex flex-col justify-center items-center text-center"
                                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                              >
                                <div className="absolute top-3 right-3">
                                  <Badge variant="secondary" className="text-xs">
                                    {idx + 1}
                                  </Badge>
                                </div>
                                <div className="flex-1 flex items-center justify-center">
                                  <div>
                                    <HelpCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 mx-auto mb-3" />
                                    <p className="text-sm sm:text-base font-semibold text-foreground break-words px-2">
                                      {card.question}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Click to reveal answer</p>
                              </div>
                              
                              {/* Back of card */}
                              <div
                                className="absolute inset-0 rounded-xl border-2 p-4 sm:p-5 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border-green-300/50 dark:border-green-700/50 flex flex-col"
                                style={{ 
                                  backfaceVisibility: 'hidden', 
                                  WebkitBackfaceVisibility: 'hidden',
                                  transform: 'rotateY(180deg)',
                                }}
                              >
                                <div className="absolute top-3 right-3">
                                  <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900">
                                    {idx + 1}
                                  </Badge>
                                </div>
                                <div className="flex-1">
                                  <div className="mb-3">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Question:</p>
                                    <p className="text-xs sm:text-sm text-foreground/70 break-words">{card.question}</p>
                                  </div>
                                  <div className="border-t pt-3">
                                    <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">Answer:</p>
                                    <p className="text-sm sm:text-base font-medium text-foreground break-words">
                                      {card.answer}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 text-center">Click to flip back</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="quiz" className="space-y-4 sm:space-y-5">
                  {result.quiz?.map((q: any, idx: number) => {
                    const correctIndex = q.correct.charCodeAt(0) - 65;
                    return (
                      <Card key={idx} className="w-full border-2 hover:border-primary/30 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">{idx + 1}</span>
                              </div>
                              <CardTitle className="text-sm sm:text-base flex-1 break-words pt-1">
                                {q.question}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 sm:space-y-3">
                          <div className="space-y-2">
                            {q.options.map((opt: string, optIdx: number) => {
                              const isCorrect = optIdx === correctIndex;
                              const optionLetter = String.fromCharCode(65 + optIdx);
                              return (
                                <div
                                  key={optIdx}
                                  className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                                    isCorrect
                                      ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700'
                                      : 'bg-muted/30 border-border hover:border-primary/30'
                                  }`}
                                >
                                  <div
                                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      isCorrect
                                        ? 'bg-green-500 text-white'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                                  >
                                    {optionLetter}
                                  </div>
                                  <div className="flex-1 flex items-center justify-between">
                                    <p className="text-xs sm:text-sm break-words flex-1">{opt}</p>
                                    {isCorrect && (
                                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 ml-2" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-3 pt-3 border-t flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-primary flex-shrink-0" />
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Correct answer: <span className="font-semibold text-primary">{q.correct}</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
