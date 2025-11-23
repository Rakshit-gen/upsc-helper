import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    let sql = 'SELECT * FROM pyq_questions';
    const params: any[] = [];

    if (filter !== 'all') {
      sql += ' WHERE topic = $1';
      params.push(filter);
    }

    sql += ' ORDER BY year DESC LIMIT 50';

    const result = await query(sql, params.length > 0 ? params : undefined);

    return NextResponse.json({ questions: result.rows });
  } catch (error) {
    console.error('PYQ API error:', error);
    return NextResponse.json({ questions: [] });
  }
}
