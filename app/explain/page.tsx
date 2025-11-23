'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Explain() {
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState('simple');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Tiered Explanation Mode</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Topic & Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <Label>Topic</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Federalism in India"
              />
            </div>

            <div>
              <Label>Explanation Mode</Label>
              <RadioGroup value={mode} onValueChange={setMode}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="simple" id="simple" />
                  <Label htmlFor="simple">Simple Explanation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard UPSC Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="debate" id="debate" />
                  <Label htmlFor="debate">Debate Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="framework" id="framework" />
                  <Label htmlFor="framework">Model Framework</Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={generateExplanation} disabled={loading || !topic}>
              {loading ? 'Generating...' : 'Generate Explanation'}
            </Button>
          </CardContent>
        </Card>

        {explanation && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap prose max-w-none text-xs sm:text-sm break-words max-w-full overflow-x-auto">
                {explanation}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
