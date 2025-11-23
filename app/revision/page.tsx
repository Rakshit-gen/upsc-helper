'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Spaced Revision System</h1>

      {loading ? (
        <Card>
          <CardContent className="p-8">
            <p className="text-center">Loading flashcards...</p>
          </CardContent>
        </Card>
      ) : flashcards.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <p className="text-center text-muted-foreground">
              No flashcards available for revision. Create some from Topic Breakdown or Current Affairs!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 w-full px-2 sm:px-0">
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              <span>Card {currentIndex + 1} of {flashcards.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} />
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Flashcard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="min-h-[150px] sm:min-h-[200px] flex items-center justify-center border rounded p-4 sm:p-6">
                {!showAnswer ? (
                  <div className="text-center w-full">
                    <p className="text-base sm:text-lg md:text-xl font-medium mb-3 sm:mb-4 break-words px-2">{currentCard.question}</p>
                    <Button onClick={() => setShowAnswer(true)} className="text-xs sm:text-sm">Show Answer</Button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4 w-full">
                    <div>
                      <p className="font-semibold mb-2 text-sm sm:text-base">Question:</p>
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">{currentCard.question}</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2 text-sm sm:text-base">Answer:</p>
                      <p className="text-xs sm:text-sm break-words">{currentCard.answer}</p>
                    </div>
                  </div>
                )}
              </div>

              {showAnswer && (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">How well did you know this?</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button onClick={() => markPerformance('hard')} variant="outline" className="flex-1 text-xs sm:text-sm">
                      Hard
                    </Button>
                    <Button onClick={() => markPerformance('medium')} variant="outline" className="flex-1 text-xs sm:text-sm">
                      Medium
                    </Button>
                    <Button onClick={() => markPerformance('easy')} className="flex-1 text-xs sm:text-sm">
                      Easy
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
