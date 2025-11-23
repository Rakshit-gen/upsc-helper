import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const result = await query(`
      SELECT * FROM flashcards 
      WHERE next_review <= NOW() 
      ORDER BY next_review ASC 
      LIMIT 20
    `);

    return NextResponse.json({ flashcards: result.rows });
  } catch (error) {
    console.error('Revision API error:', error);
    return NextResponse.json({ flashcards: [] });
  }
}
