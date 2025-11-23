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
  "article": "A FULL comprehensive current affairs article (500-800 words) written as a complete news article text. The article should be in point-wise format with sections:
    • Background/Context (3-4 points)
    • Key Developments (5-7 points)  
    • Significance/Impact (3-4 points)
    • UPSC Relevance (2-3 points)
    Write it as a complete article text with bullet points (•) or numbered points. This should be a full article that can be pasted and processed.",
  "keyPoints": [
    "Point 1: Brief description",
    "Point 2: Brief description",
    "Point 3: Brief description"
  ]
}

IMPORTANT: The "article" field must be a FULL article text (not just an array), written as a complete news article in point-wise format. Return ONLY valid JSON.`;

    const result = await generateJSON(
      prompt,
      'You are a UPSC current affairs expert. Generate realistic, recent, and highly relevant current affairs content for UPSC preparation. Focus on topics that are likely to appear in upcoming exams.'
    );

    // Ensure article is always a string
    let articleText = '';
    if (typeof result.article === 'string' && result.article.trim()) {
      articleText = result.article;
    } else if (result.article) {
      articleText = String(result.article);
    }
    
    // If article is empty but we have keyPoints, create article from keyPoints
    if (!articleText || !articleText.trim()) {
      const keyPoints = Array.isArray(result.keyPoints) ? result.keyPoints : [];
      if (keyPoints.length > 0) {
        articleText = keyPoints.map((point: string, idx: number) => {
          return `• ${point}`;
        }).join('\n\n');
      }
    }

    return NextResponse.json({
      article: articleText,
      title: result.title || 'Recent Current Affairs',
      date: result.date || 'Recent',
      category: result.category || 'General',
      keyPoints: Array.isArray(result.keyPoints) ? result.keyPoints : [],
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

