import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/groq';

export async function GET(request: Request) {
  try {
    const prompt = `Generate a recent current affairs article/topic that is highly relevant for UPSC 2024-2025 preparation. 

Focus on:
1. Recent developments (last 3-6 months) in India and globally
2. Topics that are important for both Prelims and Mains
3. Government schemes, policies, international relations, science & technology, environment, economy
4. Make it comprehensive and detailed as if it's a real news article

Return JSON with:
{
  "article": "A comprehensive current affairs article (500-800 words) covering recent developments, background, significance, and UPSC relevance",
  "title": "Title of the current affairs topic",
  "date": "Approximate date or time period (e.g., 'November 2024', 'Recent months')",
  "category": "Category (e.g., 'Polity', 'Economy', 'Environment', 'Science & Technology', 'International Relations')"
}

Return ONLY valid JSON.`;

    const result = await generateJSON(
      prompt,
      'You are a UPSC current affairs expert. Generate realistic, recent, and highly relevant current affairs content for UPSC preparation. Focus on topics that are likely to appear in upcoming exams.'
    );

    return NextResponse.json({
      article: result.article || '',
      title: result.title || 'Recent Current Affairs',
      date: result.date || 'Recent',
      category: result.category || 'General',
    });
  } catch (error) {
    console.error('Current Affairs Generate API error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate current affairs',
      article: '',
      title: '',
      date: '',
      category: ''
    }, { status: 500 });
  }
}

