import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const prompt = `Convert this text into structured study materials:

${text}

Generate JSON with:
1. structuredNotes: Well-organized notes with headings and bullet points (string)
2. mindmap: {
     central: "Central topic",
     branches: [{title: "Branch", points: ["Point 1", "Point 2"]}]
   }
3. summary: 250-word summary for mains (string)

Return ONLY valid JSON.`;

    const result = await generateJSON(
      prompt,
      'You are a UPSC note-making expert. Create structured notes, mindmaps, and summaries.'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Notes API error:', error);
    return NextResponse.json({ error: 'Failed to generate notes' }, { status: 500 });
  }
}
