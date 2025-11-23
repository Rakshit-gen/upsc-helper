import { NextResponse } from 'next/server';
import { generateJSON, generateCompletion } from '@/lib/groq';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { type, questions, answers, mainsAnswer } = await request.json();

    if (type === 'prelims') {
      let score = 0;
      const feedback = questions.map((q: any, idx: number) => {
        const userAnswer = answers[idx];
        const correct = userAnswer === q.correct;
        if (correct) score++;
        return {
          correct,
          correctAnswer: q.correct,
        };
      });

      const total = questions.length;
      const percentage = Math.round((score / total) * 100);

      await query(
        'INSERT INTO test_results (test_type, score, total, percentage, created_at) VALUES ($1, $2, $3, $4, NOW())',
        ['prelims', score, total, percentage]
      );

      await query(
        'INSERT INTO activities (description, created_at) VALUES ($1, NOW())',
        [`Completed Prelims test - Score: ${score}/${total}`]
      );

      return NextResponse.json({ score, total, percentage, feedback });
    } else {
      const prompt = `Evaluate this UPSC Mains answer:

Question: ${mainsAnswer.question}

Answer: ${mainsAnswer.answer}

Provide JSON with:
{
  "structureScore": 7, // out of 10
  "structureFeedback": "Feedback on answer structure",
  "improvements": ["Improvement point 1", "Improvement point 2"],
  "sampleStructure": "Sample structure outline (NOT full answer)"
}

Return ONLY valid JSON.`;

      const result = await generateJSON(
        prompt,
        'You are a UPSC Mains evaluator. Assess structure and provide improvement feedback, not full answers.'
      );

      await query(
        'INSERT INTO activities (description, created_at) VALUES ($1, NOW())',
        ['Completed Mains answer evaluation']
      );

      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Test Evaluate API error:', error);
    return NextResponse.json({ error: 'Failed to evaluate test' }, { status: 500 });
  }
}
