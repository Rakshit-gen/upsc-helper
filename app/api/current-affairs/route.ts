import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { article } = await request.json();

    const prompt = `Process this current affairs article for UPSC preparation:

${article}

Generate JSON with:
1. prelimsFacts: Array of important facts for prelims (strings)
2. mainsAnalysis: Detailed analysis for mains answer writing (string)
3. keywords: Array of important keywords/terms
4. oneLiners: Array of one-liner revision points

Return ONLY valid JSON.`;

    const result = await generateJSON(
      prompt,
      'You are a UPSC current affairs expert. Extract and organize information for prelims and mains.'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Current Affairs API error:', error);
    return NextResponse.json({ error: 'Failed to process article' }, { status: 500 });
  }
}
