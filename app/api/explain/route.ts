import { NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { topic, mode } = await request.json();

    let systemPrompt = '';
    let prompt = '';

    switch (mode) {
      case 'simple':
        systemPrompt = 'You are a teacher explaining concepts to beginners in simple language.';
        prompt = `Explain "${topic}" in simple terms that anyone can understand.`;
        break;
      case 'standard':
        systemPrompt = 'You are a UPSC expert explaining concepts at exam level.';
        prompt = `Explain "${topic}" at UPSC standard level with relevant facts, examples, and context.`;
        break;
      case 'debate':
        systemPrompt = 'You are presenting multiple perspectives on a topic for debate.';
        prompt = `Present different viewpoints and perspectives on "${topic}" for a balanced debate.`;
        break;
      case 'framework':
        systemPrompt = 'You are creating analytical frameworks for UPSC answers.';
        prompt = `Create a model framework for analyzing "${topic}" in UPSC Mains answers. Include key dimensions, factors, and structure.`;
        break;
      default:
        systemPrompt = 'You are a UPSC expert.';
        prompt = `Explain "${topic}".`;
    }

    const explanation = await generateCompletion(prompt, systemPrompt);

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Explain API error:', error);
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}
