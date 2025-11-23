import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const weeklyHoursResult = await query(`
      SELECT COALESCE(SUM(hours), 0) as total 
      FROM study_sessions 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `);
    const weeklyHours = parseFloat(weeklyHoursResult.rows[0]?.total || 0);

    const lastWeekHoursResult = await query(`
      SELECT COALESCE(SUM(hours), 0) as total 
      FROM study_sessions 
      WHERE created_at >= NOW() - INTERVAL '14 days' 
        AND created_at < NOW() - INTERVAL '7 days'
    `);
    const lastWeekHours = parseFloat(lastWeekHoursResult.rows[0]?.total || 0);

    const testsResult = await query(`
      SELECT COUNT(*) as count, AVG(percentage) as avg 
      FROM test_results 
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);
    const testsCompleted = parseInt(testsResult.rows[0]?.count || 0);
    const avgScore = Math.round(parseFloat(testsResult.rows[0]?.avg || 0));

    const flashcardsResult = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN times_reviewed > 0 THEN 1 ELSE 0 END) as reviewed,
        SUM(CASE WHEN next_review <= NOW() THEN 1 ELSE 0 END) as due
      FROM flashcards
    `);
    const totalFlashcards = parseInt(flashcardsResult.rows[0]?.total || 0);
    const flashcardsReviewed = parseInt(flashcardsResult.rows[0]?.reviewed || 0);
    const dueForRevision = parseInt(flashcardsResult.rows[0]?.due || 0);

    const activitiesResult = await query(`
      SELECT * FROM activities 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    const recentActivities = activitiesResult.rows;

    const weeklyAnalyticsResult = await query(`
      SELECT 
        TO_CHAR(created_at, 'Day') as day,
        COALESCE(SUM(hours), 0) as hours
      FROM study_sessions
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
      ORDER BY EXTRACT(DOW FROM created_at)
    `);
    const weeklyAnalytics = weeklyAnalyticsResult.rows.map((row: any) => ({
      day: row.day.trim(),
      hours: parseFloat(row.hours),
    }));

    return NextResponse.json({
      weeklyHours,
      lastWeekHours,
      testsCompleted,
      avgScore,
      totalFlashcards,
      flashcardsReviewed,
      dueForRevision,
      recentActivities,
      weeklyAnalytics,
    });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json({
      weeklyHours: 0,
      lastWeekHours: 0,
      testsCompleted: 0,
      avgScore: 0,
      totalFlashcards: 0,
      flashcardsReviewed: 0,
      dueForRevision: 0,
      recentActivities: [],
      weeklyAnalytics: [],
    });
  }
}
