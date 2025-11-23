import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/groq';

export async function GET(request: Request) {
  try {
    const prompt = `Generate a recent current affairs topic that is highly relevant for UPSC 2024-2025 preparation. 

Focus on:
1. Recent developments (last 3-6 months) in India and globally
2. Topics that are important for both Prelims and Mains
3. Government schemes, policies, international relations, science & technology, environment, economy

Return JSON with:
{
  "title": "Title of the current affairs topic",
  "date": "Approximate date or time period (e.g., 'November 2024', 'Recent months')",
  "category": "Category (e.g., 'Polity', 'Economy', 'Environment', 'Science & Technology', 'International Relations')",
  "article": "A comprehensive current affairs article in POINT-WISE format covering:
    - Background/Context (3-4 points)
    - Key Developments (5-7 points)
    - Significance/Impact (3-4 points)
    - UPSC Relevance (2-3 points)
    Format each section with clear bullet points. Total 15-20 key points.",
  "keyPoints": [
    "Point 1: Brief description",
    "Point 2: Brief description",
    "Point 3: Brief description"
  ]
}

Return ONLY valid JSON. Make sure the article is in clear point-wise format with bullet points.`;

    const result = await generateJSON(
      prompt,
      'You are a UPSC current affairs expert. Generate realistic, recent, and highly relevant current affairs content for UPSC preparation. Focus on topics that are likely to appear in upcoming exams.'
    );

    return NextResponse.json({
      article: result.article || '',
      title: result.title || 'Recent Current Affairs',
      date: result.date || 'Recent',
      category: result.category || 'General',
      keyPoints: result.keyPoints || [],
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

