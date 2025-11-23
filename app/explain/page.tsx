'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Lightbulb, Sparkles, BookOpen, MessageSquare, FileText, Copy, CheckCircle } from 'lucide-react';
import { MathRenderer } from '@/components/MathRenderer';

export default function Explain() {
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState('simple');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!explanation) return;
    try {
      await navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const generateExplanation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, mode }),
      });
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const modeIcons = {
    simple: Sparkles,
    standard: BookOpen,
    debate: MessageSquare,
    framework: FileText,
  };

  const modeDescriptions = {
    simple: 'Easy to understand explanation for beginners',
    standard: 'UPSC-level detailed explanation',
    debate: 'Multiple perspectives and arguments',
    framework: 'Structured answer framework for mains',
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Tiered Explanation Mode
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Get explanations tailored to your learning level
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Topic & Mode Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Enter Topic</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Federalism in India"
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Explanation Mode</Label>
              <RadioGroup value={mode} onValueChange={setMode} className="space-y-3">
                {(['simple', 'standard', 'debate', 'framework'] as const).map((modeValue) => {
                  const Icon = modeIcons[modeValue];
                  const isSelected = mode === modeValue;
                  return (
                    <div
                      key={modeValue}
                      className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setMode(modeValue)}
                    >
                      <RadioGroupItem value={modeValue} id={modeValue} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <Label htmlFor={modeValue} className="text-sm font-medium cursor-pointer">
                            {modeValue === 'simple' && 'Simple Explanation'}
                            {modeValue === 'standard' && 'Standard UPSC Level'}
                            {modeValue === 'debate' && 'Debate Mode'}
                            {modeValue === 'framework' && 'Model Framework'}
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">
                          {modeDescriptions[modeValue]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            <Button 
              onClick={generateExplanation} 
              disabled={loading || !topic}
              className="w-full text-sm sm:text-base"
              size="lg"
            >
              {loading ? 'Generating Explanation...' : 'Generate Explanation'}
            </Button>
          </CardContent>
        </Card>

        {explanation && (
          <Card className="w-full bg-gradient-to-br from-blue-50/50 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/50 dark:border-blue-800/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Explanation
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-8 w-8 p-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="text-sm sm:text-base break-words max-w-full overflow-x-auto leading-relaxed p-4 bg-background/50 rounded-lg border">
                  <MathRenderer content={explanation} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
