import { NextResponse } from 'next/server';
import { generateJSON, generateCompletion } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { topic, type } = await request.json();

    if (type === 'prelims') {
      const prompt = `Generate 10 UPSC Prelims MCQs on topic: ${topic}

Return JSON with:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": "A" // or B, C, D
    }
  ]
}

Return ONLY valid JSON.`;

      const result = await generateJSON(
        prompt,
        'You are a UPSC Prelims expert. Generate high-quality MCQs.'
      );

      return NextResponse.json(result);
    } else {
      const prompt = `Generate 1 UPSC Mains question (250 words) on topic: ${topic}

Return JSON with:
{
  "question": "Mains question text"
}

Return ONLY valid JSON.`;

      const result = await generateJSON(
        prompt,
        'You are a UPSC Mains expert. Generate analytical questions.'
      );

      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Test Generate API error:', error);
    return NextResponse.json({ error: 'Failed to generate test' }, { status: 500 });
  }
}
