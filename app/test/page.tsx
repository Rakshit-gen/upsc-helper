'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, PenTool, CheckCircle2, XCircle, Trophy, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Test Engine
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Practice with MCQ tests and mains answer writing
        </p>
      </div>

      <Tabs value={testType} onValueChange={setTestType}>
        <TabsList className="grid w-full max-w-full sm:max-w-md grid-cols-2 mb-5 sm:mb-6 md:mb-8 text-xs sm:text-sm">
          <TabsTrigger value="prelims" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Prelims MCQ</span>
          </TabsTrigger>
          <TabsTrigger value="mains" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            <span>Mains Answer</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prelims">
          <div className="space-y-5 sm:space-y-6 md:space-y-8">
            {questions.length === 0 ? (
              <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Generate Prelims Test
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Enter Topic</Label>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Indian Polity, Geography"
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <Button 
                    onClick={generateTest} 
                    disabled={loading || !topic}
                    className="w-full text-sm sm:text-base"
                    size="lg"
                  >
                    {loading ? 'Generating Test...' : 'Generate Test'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="w-full border-primary/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base sm:text-lg md:text-xl break-words flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Prelims Test - {topic}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 sm:space-y-8">
                    {questions.map((q, idx) => (
                      <Card key={idx} className="border-2 hover:border-primary/30 transition-colors">
                        <CardContent className="p-5 sm:p-6">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{idx + 1}</span>
                            </div>
                            <p className="font-semibold text-sm sm:text-base break-words flex-1 pt-1">{q.question}</p>
                          </div>
                          <RadioGroup
                            value={answers[idx]}
                            onValueChange={(value) => setAnswers({ ...answers, [idx]: value })}
                            className="space-y-2 ml-11"
                          >
                            {q.options.map((opt: string, optIdx: number) => {
                              const optionLetter = String.fromCharCode(65 + optIdx);
                              return (
                                <div key={optIdx} className="flex items-start space-x-3 p-3 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                                  <RadioGroupItem value={optionLetter} id={`q${idx}-${optIdx}`} className="mt-0.5" />
                                  <Label htmlFor={`q${idx}-${optIdx}`} className="text-sm sm:text-base break-words cursor-pointer flex-1 pt-0.5">
                                    <span className="font-semibold mr-2">{optionLetter}.</span>
                                    {opt}
                                  </Label>
                                </div>
                              );
                            })}
                          </RadioGroup>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button onClick={submitTest} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base" size="lg">
                        {loading ? 'Evaluating...' : 'Submit Test'}
                      </Button>
                      <Button variant="outline" onClick={() => setQuestions([])} className="w-full sm:w-auto text-sm sm:text-base" size="lg">
                        New Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {result && (
                  <Card className="w-full bg-gradient-to-br from-green-50/50 to-blue-50/30 dark:from-green-950/20 dark:to-blue-950/20 border-green-200/50 dark:border-green-800/30">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Test Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="p-5 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 text-center">
                        <p className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          {result.score}/{result.total}
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground">Score</p>
                        <p className="text-lg sm:text-xl font-semibold text-primary mt-2">{result.percentage}%</p>
                      </div>
                      <div className="space-y-3">
                        {result.feedback?.map((fb: any, idx: number) => (
                          <Card key={idx} className={`border-2 ${fb.correct ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20' : 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20'}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                {fb.correct ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold text-sm sm:text-base mb-1">
                                    Question {idx + 1}: {fb.correct ? 'Correct' : 'Incorrect'}
                                  </p>
                                  {!fb.correct && (
                                    <p className="text-xs sm:text-sm text-muted-foreground break-words">
                                      Correct answer: <span className="font-semibold text-primary">{fb.correctAnswer}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
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
          <div className="space-y-5 sm:space-y-6 md:space-y-8">
            {!mainsQuestion ? (
              <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-primary" />
                    Generate Mains Question
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Enter Topic</Label>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Governance, Ethics"
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <Button 
                    onClick={generateTest} 
                    disabled={loading || !topic}
                    className="w-full text-sm sm:text-base"
                    size="lg"
                  >
                    {loading ? 'Generating Question...' : 'Generate Question'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="w-full border-primary/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                      <PenTool className="h-5 w-5 text-primary" />
                      Mains Answer Writing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 sm:space-y-6">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Question</p>
                            <p className="text-sm sm:text-base font-semibold break-words">{mainsQuestion}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Your Answer (250 words)</Label>
                      <Textarea
                        value={mainsAnswer}
                        onChange={(e) => setMainsAnswer(e.target.value)}
                        placeholder="Write your answer here..."
                        className="min-h-[250px] sm:min-h-[350px] text-sm sm:text-base"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={submitTest} 
                        disabled={loading || !mainsAnswer} 
                        className="w-full sm:w-auto text-sm sm:text-base"
                        size="lg"
                      >
                        {loading ? 'Evaluating...' : 'Submit Answer'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => { setMainsQuestion(''); setMainsAnswer(''); }} 
                        className="w-full sm:w-auto text-sm sm:text-base"
                        size="lg"
                      >
                        New Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {result && (
                  <Card className="w-full bg-gradient-to-br from-purple-50/50 to-blue-50/30 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200/50 dark:border-purple-800/30">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Evaluation Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                        <CardContent className="p-5 text-center">
                          <p className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Structure Score: {result.structureScore}/10
                          </p>
                          <p className="text-sm sm:text-base text-muted-foreground break-words">{result.structureFeedback}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Improvement Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                            {result.improvements?.map((imp: string, idx: number) => (
                              <li key={idx} className="break-words pl-2">{imp}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="border-primary/20 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            Sample Structure
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="whitespace-pre-wrap text-sm sm:text-base break-words max-w-full overflow-x-auto leading-relaxed p-4 bg-background/50 rounded-lg border">
                              {result.sampleStructure}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
