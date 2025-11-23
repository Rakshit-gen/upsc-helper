import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    const prompt = `Create an essay/ethics framework for UPSC on topic: "${topic}"

Generate JSON with:
{
  "outline": [
    {
      "heading": "Introduction",
      "points": ["Point 1", "Point 2"]
    },
    {
      "heading": "Main Body - Dimension 1",
      "points": ["Point 1", "Point 2"]
    }
  ],
  "examples": ["Example 1", "Example 2"],
  "quotes": [
    {"text": "Quote text", "author": "Author name"}
  ],
  "structure": "Overall structure guide (NOT full essay)"
}

Provide framework and structure, NOT the complete essay. Return ONLY valid JSON.`;

    const result = await generateJSON(
      prompt,
      'You are a UPSC essay expert. Provide outlines, examples, quotes, and structure guidance - NOT full essays.'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Essay API error:', error);
    return NextResponse.json({ error: 'Failed to generate framework' }, { status: 500 });
  }
}
