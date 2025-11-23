import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { flashcards, topic } = await request.json();

    if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
      return NextResponse.json({ error: 'No flashcards provided' }, { status: 400 });
    }

    const savedFlashcards = [];
    
    for (const card of flashcards) {
      if (!card.question || !card.answer) {
        continue; // Skip invalid flashcards
      }

      const result = await query(
        `INSERT INTO flashcards (question, answer, topic, next_review, created_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         RETURNING id, question, answer, topic`,
        [card.question, card.answer, topic || 'general']
      );

      savedFlashcards.push(result.rows[0]);
    }

    // Log activity
    if (savedFlashcards.length > 0) {
      await query(
        `INSERT INTO activities (description, created_at)
         VALUES ($1, NOW())`,
        [`Saved ${savedFlashcards.length} flashcard(s) to revision system`]
      );
    }

    return NextResponse.json({ 
      success: true, 
      count: savedFlashcards.length,
      flashcards: savedFlashcards 
    });
  } catch (error) {
    console.error('Save Flashcards API error:', error);
    return NextResponse.json({ 
      error: 'Failed to save flashcards',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

