'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Test() {
  const [testType, setTestType] = useState('prelims');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [mainsAnswer, setMainsAnswer] = useState('');
  const [mainsQuestion, setMainsQuestion] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateTest = async () => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      const response = await fetch('/api/test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type: testType }),
      });
      const data = await response.json();
      if (testType === 'prelims') {
        setQuestions(data.questions || []);
      } else {
        setMainsQuestion(data.question || '');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: testType,
          questions,
          answers: testType === 'prelims' ? answers : null,
          mainsAnswer: testType === 'mains' ? { question: mainsQuestion, answer: mainsAnswer } : null,
        }),
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
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Test Engine</h1>

      <Tabs value={testType} onValueChange={setTestType}>
        <TabsList className="grid w-full max-w-full sm:max-w-md grid-cols-2 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm">
          <TabsTrigger value="prelims">Prelims MCQ</TabsTrigger>
          <TabsTrigger value="mains">Mains Answer</TabsTrigger>
        </TabsList>

        <TabsContent value="prelims">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {questions.length === 0 ? (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg md:text-xl">Generate Prelims Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <Label>Topic</Label>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Indian Polity, Geography"
                    />
                  </div>
                  <Button onClick={generateTest} disabled={loading || !topic}>
                    {loading ? 'Generating...' : 'Generate Test'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg md:text-xl break-words">Prelims Test - {topic}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {questions.map((q, idx) => (
                      <div key={idx} className="border-b pb-3 sm:pb-4">
                        <p className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base break-words">{idx + 1}. {q.question}</p>
                        <RadioGroup
                          value={answers[idx]}
                          onValueChange={(value) => setAnswers({ ...answers, [idx]: value })}
                        >
                          {q.options.map((opt: string, optIdx: number) => (
                            <div key={optIdx} className="flex items-start space-x-2 py-1">
                              <RadioGroupItem value={String.fromCharCode(65 + optIdx)} id={`q${idx}-${optIdx}`} className="mt-1" />
                              <Label htmlFor={`q${idx}-${optIdx}`} className="text-xs sm:text-sm break-words cursor-pointer flex-1">{String.fromCharCode(65 + optIdx)}. {opt}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={submitTest} disabled={loading} className="w-full sm:w-auto">
                        {loading ? 'Evaluating...' : 'Submit Test'}
                      </Button>
                      <Button variant="outline" onClick={() => setQuestions([])} className="w-full sm:w-auto">
                        New Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {result && (
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg md:text-xl">Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div>
                        <p className="text-xl sm:text-2xl font-bold">Score: {result.score}/{result.total}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Percentage: {result.percentage}%</p>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        {result.feedback?.map((fb: any, idx: number) => (
                          <div key={idx} className="border rounded p-2 sm:p-3">
                            <p className="font-medium text-xs sm:text-sm">Q{idx + 1}: {fb.correct ? '✓ Correct' : '✗ Incorrect'}</p>
                            {!fb.correct && (
                              <p className="text-xs sm:text-sm text-muted-foreground break-words">Correct answer: {fb.correctAnswer}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="mains">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {!mainsQuestion ? (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg md:text-xl">Generate Mains Question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <Label>Topic</Label>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Governance, Ethics"
                    />
                  </div>
                  <Button onClick={generateTest} disabled={loading || !topic}>
                    {loading ? 'Generating...' : 'Generate Question'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg md:text-xl">Mains Answer Writing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="bg-secondary p-3 sm:p-4 rounded">
                      <p className="font-semibold text-xs sm:text-sm break-words">{mainsQuestion}</p>
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm">Your Answer (250 words)</Label>
                      <Textarea
                        value={mainsAnswer}
                        onChange={(e) => setMainsAnswer(e.target.value)}
                        placeholder="Write your answer here..."
                        className="min-h-[200px] sm:min-h-[300px] text-sm sm:text-base mt-2"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={submitTest} disabled={loading || !mainsAnswer} className="w-full sm:w-auto">
                        {loading ? 'Evaluating...' : 'Submit Answer'}
                      </Button>
                      <Button variant="outline" onClick={() => { setMainsQuestion(''); setMainsAnswer(''); }} className="w-full sm:w-auto">
                        New Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {result && (
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg md:text-xl">Evaluation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">Structure Score: {result.structureScore}/10</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">{result.structureFeedback}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">Improvement Suggestions</h3>
                        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                          {result.improvements?.map((imp: string, idx: number) => (
                            <li key={idx} className="break-words">{imp}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">Sample Structure</h3>
                        <div className="whitespace-pre-wrap text-xs sm:text-sm bg-secondary p-2 sm:p-3 rounded break-words max-w-full overflow-x-auto">
                          {result.sampleStructure}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
