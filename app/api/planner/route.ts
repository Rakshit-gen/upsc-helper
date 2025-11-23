import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { hoursPerDay, prepStage, syllabusProgress } = await request.json();

    const prompt = `Create a personalized UPSC study plan with these details:
- Hours available per day: ${hoursPerDay}
- Preparation stage: ${prepStage}
- Syllabus progress: ${syllabusProgress}%

Generate a JSON response with:
1. dailyPlan: Array of {time, activity} for daily schedule
2. weeklyPlan: Array of {day, focus} for weekly focus areas
3. tips: Array of study tips

Return ONLY valid JSON.`;

    const result = await generateJSON(
      prompt,
      'You are a UPSC preparation expert. Generate structured study plans based on user inputs.'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Planner API error:', error);
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}
