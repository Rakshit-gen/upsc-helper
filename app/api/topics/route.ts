import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    const prompt = `Convert this content into UPSC study material:

${content}

Generate JSON with:
1. notes: Structured notes in text format
2. flashcards: Array of {question, answer}
3. quiz: Array of {question, options: [4 options], correct: "A/B/C/D"}

Return ONLY valid JSON.`;

    const result = await generateJSON(
      prompt,
      'You are a UPSC content expert. Convert content into notes, flashcards, and quiz questions.'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Topics API error:', error);
    return NextResponse.json({ error: 'Failed to process content' }, { status: 500 });
  }
}
