import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateJSON } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const result = await query(`
      SELECT topic, COUNT(*) as count 
      FROM pyq_questions 
      GROUP BY topic 
      ORDER BY count DESC 
      LIMIT 10
    `);

    const topTopics = result.rows.map((row: any) => ({
      name: row.topic,
      count: parseInt(row.count),
    }));

    const recentQuestions = await query(`
      SELECT * FROM pyq_questions 
      ORDER BY year DESC 
      LIMIT 20
    `);

    const questionsText = recentQuestions.rows
      .map((q: any) => `${q.year}: ${q.question} (Topic: ${q.topic})`)
      .join('\n');

    const prompt = `Based on these recent UPSC PYQ questions, predict likely topics for the next exam:

${questionsText}

Return JSON with:
{
  "likelyTopics": ["Topic 1 with reason", "Topic 2 with reason", "Topic 3 with reason"]
}

Return ONLY valid JSON.`;

    const aiResult = await generateJSON(
      prompt,
      'You are a UPSC trend analysis expert. Identify patterns and predict likely topics.'
    );

    return NextResponse.json({
      topTopics,
      likelyTopics: aiResult.likelyTopics,
    });
  } catch (error) {
    console.error('PYQ Analyze API error:', error);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}
