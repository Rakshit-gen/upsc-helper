'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Target, TrendingUp, Clock, Award, BookOpen } from 'lucide-react';

const motivationalQuotes = [
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown"
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown"
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown"
  }
];

const tips = [
  {
    icon: Target,
    title: "Set Clear Goals",
    description: "Define what you want to achieve and break it down into smaller, manageable tasks."
  },
  {
    icon: Clock,
    title: "Consistency is Key",
    description: "Study a little every day rather than cramming. Regular practice builds strong foundations."
  },
  {
    icon: BookOpen,
    title: "Active Learning",
    description: "Don't just read - take notes, create flashcards, and test yourself regularly."
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your improvement over time. Celebrate small wins to stay motivated."
  },
  {
    icon: Award,
    title: "Stay Positive",
    description: "Maintain a growth mindset. Every mistake is a learning opportunity."
  },
  {
    icon: Sparkles,
    title: "Take Breaks",
    description: "Rest is essential for retention. Take regular breaks to recharge your mind."
  }
];

export default function Motivation() {
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setTimeOfDay('Morning');
    } else if (hour < 17) {
      setTimeOfDay('Afternoon');
    } else {
      setTimeOfDay('Evening');
    }

    // Set random quote on load
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  const getNewQuote = () => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Motivation & Tips
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Stay inspired and keep pushing forward on your UPSC journey
        </p>
      </div>

      {/* Daily Quote */}
      <Card className="w-full mb-4 sm:mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Good {timeOfDay}! Here's your daily inspiration:</p>
              <blockquote className="text-base sm:text-lg md:text-xl font-medium italic text-foreground mb-3">
                "{quote.text}"
              </blockquote>
              <p className="text-xs sm:text-sm text-muted-foreground">— {quote.author}</p>
            </div>
            <Button 
              onClick={getNewQuote} 
              variant="outline" 
              size="sm"
              className="mt-4"
            >
              Get New Quote
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Study Tips */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
          <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Study Tips & Strategies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <Card key={idx} className="w-full group hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm sm:text-base">{tip.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Motivation Stats */}
      <Card className="w-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Remember
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-primary">Your Journey</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown. Keep going.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-primary">Stay Focused</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                The difference between ordinary and extraordinary is that little extra. Push yourself because no one else is going to do it for you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

