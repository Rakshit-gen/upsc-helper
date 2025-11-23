import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json().catch(() => ({}));
    const topicToAnalyze = topic || 'UPSC General Studies';

    const prompt = `Analyze UPSC Previous Year Questions trends and patterns for: "${topicToAnalyze}"

Based on historical UPSC question patterns from 2018-2024, provide:

1. High Frequency Topics: Topics that appear most frequently in UPSC exams
2. Likely Topics: Topics that are likely to appear in upcoming exams based on:
   - Recent trends and patterns
   - Current affairs relevance
   - Syllabus coverage
   - Government policies and initiatives

Return JSON with:
{
  "topTopics": [
    {
      "name": "Topic name",
      "count": 15, // Estimated frequency count
      "reason": "Why this topic is important"
    }
  ],
  "likelyTopics": [
    "Topic 1 with detailed reason based on trends",
    "Topic 2 with detailed reason based on trends",
    "Topic 3 with detailed reason based on trends"
  ]
}

Return ONLY valid JSON.`;

    const result = await generateJSON(
      prompt,
      'You are a UPSC trend analysis expert with deep knowledge of exam patterns from 2018-2024. Analyze question frequency, predict likely topics, and provide insights based on historical trends and current relevance.'
    );

    // Ensure we have proper structure
    const topTopics = result.topTopics || [];
    const likelyTopics = result.likelyTopics || [];

    // If AI didn't return proper format, provide fallback
    if (topTopics.length === 0 && likelyTopics.length === 0) {
      return NextResponse.json({
        topTopics: [
          { name: 'Polity & Governance', count: 25, reason: 'Consistently high frequency in all UPSC exams' },
          { name: 'History (Modern & Ancient)', count: 20, reason: 'Regular appearance in both Prelims and Mains' },
          { name: 'Geography (Physical & Human)', count: 18, reason: 'Important for both Prelims and Mains' },
          { name: 'Economy', count: 22, reason: 'High relevance with current affairs' },
          { name: 'Environment & Ecology', count: 15, reason: 'Growing importance in recent years' },
          { name: 'Science & Technology', count: 12, reason: 'Current affairs integration' }
        ],
        likelyTopics: [
          'Current affairs integrated with static subjects - Focus on recent government policies, schemes, and their implementation',
          'Environmental issues and climate change - Given global focus on climate action and India\'s commitments',
          'Governance and policy implementation - Analysis of effectiveness of various government programs',
          'Digital India and technology governance - Emerging trends in digital economy and cybersecurity',
          'Social justice and inclusive development - SC/ST/OBC welfare, gender issues, and marginalized communities'
        ]
      });
    }

    return NextResponse.json({
      topTopics: topTopics.map((topic: any) => ({
        name: topic.name || 'Unknown',
        count: topic.count || 0,
        reason: topic.reason || ''
      })),
      likelyTopics: Array.isArray(likelyTopics) ? likelyTopics : []
    });
  } catch (error: any) {
    console.error('PYQ Analyze API error:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze trends',
      topTopics: [],
      likelyTopics: []
    }, { status: 500 });
  }
}
