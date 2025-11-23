import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { cardId, performance } = await request.json();

    let interval = 1;
    switch (performance) {
      case 'easy':
        interval = 7;
        break;
      case 'medium':
        interval = 3;
        break;
      case 'hard':
        interval = 1;
        break;
    }

    await query(
      `UPDATE flashcards 
       SET next_review = NOW() + INTERVAL '${interval} days',
           times_reviewed = times_reviewed + 1
       WHERE id = $1`,
      [cardId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Revision Update API error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
