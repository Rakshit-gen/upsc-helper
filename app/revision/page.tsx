'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle2, XCircle, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Revision() {
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/revision');
      const data = await response.json();
      setFlashcards(data.flashcards || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const markPerformance = async (performance: 'easy' | 'medium' | 'hard') => {
    if (!flashcards[currentIndex]) return;

    try {
      await fetch('/api/revision/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: flashcards[currentIndex].id,
          performance,
        }),
      });

      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        loadFlashcards();
        setCurrentIndex(0);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Spaced Revision System
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Review your flashcards with spaced repetition for better retention
        </p>
      </div>

      {loading ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <p className="text-sm sm:text-base text-muted-foreground">Loading flashcards...</p>
          </CardContent>
        </Card>
      ) : flashcards.length === 0 ? (
        <Card className="max-w-2xl mx-auto border-primary/20">
          <CardContent className="p-12 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm sm:text-base text-muted-foreground mb-2">
              No flashcards available for revision.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Create some from Topic Breakdown or Current Affairs!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 w-full px-2 sm:px-0">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-5 sm:p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs sm:text-sm">
                      Card {currentIndex + 1} of {flashcards.length}
                    </Badge>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {Math.round(progress)}% Complete
                    </span>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full border-2 border-primary/20 min-h-[400px] sm:min-h-[450px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Flashcard Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 sm:space-y-8">
              <div className="min-h-[250px] sm:min-h-[300px] flex items-center justify-center border-2 border-dashed border-primary/30 rounded-xl p-6 sm:p-8 bg-gradient-to-br from-primary/5 to-transparent">
                {!showAnswer ? (
                  <div className="text-center w-full space-y-6">
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Brain className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-lg sm:text-xl md:text-2xl font-semibold break-words px-4">
                        {currentCard.question}
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowAnswer(true)} 
                      className="text-sm sm:text-base"
                      size="lg"
                    >
                      Show Answer
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5 w-full text-left">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Question</p>
                      <p className="text-sm sm:text-base break-words">{currentCard.question}</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2 uppercase tracking-wide">Answer</p>
                      <p className="text-sm sm:text-base break-words">{currentCard.answer}</p>
                    </div>
                  </div>
                )}
              </div>

              {showAnswer && (
                <div className="space-y-4">
                  <p className="text-sm sm:text-base font-medium text-center">How well did you know this?</p>
                  <div className="grid grid-cols-3 gap-3">
                    <Button 
                      onClick={() => markPerformance('hard')} 
                      variant="outline" 
                      className="flex flex-col items-center gap-2 h-auto py-4 text-xs sm:text-sm border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span>Hard</span>
                    </Button>
                    <Button 
                      onClick={() => markPerformance('medium')} 
                      variant="outline" 
                      className="flex flex-col items-center gap-2 h-auto py-4 text-xs sm:text-sm border-yellow-300 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
                    >
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <span>Medium</span>
                    </Button>
                    <Button 
                      onClick={() => markPerformance('easy')} 
                      className="flex flex-col items-center gap-2 h-auto py-4 text-xs sm:text-sm bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Easy</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
