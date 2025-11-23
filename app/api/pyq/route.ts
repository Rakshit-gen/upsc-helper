import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/groq';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('filter') || 'all';

    // If no specific topic, generate questions on important UPSC topics
    const topicToGenerate = topic && topic !== 'all' && topic.trim() !== '' 
      ? topic.trim() 
      : 'UPSC General Studies covering Polity, History, Geography, Economy, Environment, and Science & Technology';

    const prompt = `Generate 15 UPSC Previous Year Questions (PYQ) style questions based on historical trends and patterns for the topic: "${topicToGenerate}"

Analyze previous UPSC question patterns and create questions that:
1. Follow the exact style and difficulty level of actual UPSC questions
2. Cover important subtopics that frequently appear in exams
3. Include questions from different years (2018-2024) to show trends
4. Focus on topics that are likely to be asked based on current affairs and static syllabus

Return JSON with:
{
  "questions": [
    {
      "question": "Full question text in UPSC style",
      "year": 2023, // or 2022, 2021, etc. (random years between 2018-2024)
      "topic": "Specific topic name (e.g., 'Polity', 'History', 'Geography')",
      "answer": "Brief answer or explanation (optional)"
    }
  ]
}

Return ONLY valid JSON. Make sure questions are realistic and follow actual UPSC question patterns.`;

    const result = await generateJSON(
      prompt,
      'You are a UPSC exam expert with deep knowledge of previous year question patterns. Generate realistic PYQ-style questions based on historical trends and current syllabus patterns.'
    );

    // Ensure we have questions array
    const questions = result.questions || [];
    
    // Add some metadata
    const questionsWithMetadata = questions.map((q: any, idx: number) => ({
      ...q,
      id: idx + 1,
      year: q.year || (2024 - Math.floor(Math.random() * 7)), // Random year between 2018-2024
      topic: q.topic || topicToGenerate
    }));

    return NextResponse.json({ 
      questions: questionsWithMetadata,
      generated: true,
      topic: topicToGenerate
    });
  } catch (error: any) {
    console.error('PYQ API error:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack
    });
    
    return NextResponse.json({ 
      error: error?.message || 'Failed to generate questions',
      questions: []
    }, { status: 500 });
  }
}
