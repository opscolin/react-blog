import { Router, Response } from 'express';
import { sql } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string;
  const tag = req.query.tag as string;
  const type = req.query.type as string;
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM diaries WHERE 1=1`;
  let countQuery = `SELECT COUNT(*) as count FROM diaries WHERE 1=1`;
  const params: any[] = [];
  let paramIndex = 1;

  if (type) {
    query += ` AND type = $${paramIndex}`;
    countQuery += ` AND type = $${paramIndex}`;
    params.push(type);
    paramIndex++;
  }

  if (search) {
    query += ` AND (title LIKE $${paramIndex} OR content LIKE $${paramIndex} OR (type = 'ai' AND ai_summary LIKE $${paramIndex}))`;
    countQuery += ` AND (title LIKE $${paramIndex} OR content LIKE $${paramIndex} OR (type = 'ai' AND ai_summary LIKE $${paramIndex}))`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (tag) {
    query += ` AND $${paramIndex} = ANY(tags)`;
    countQuery += ` AND $${paramIndex} = ANY(tags)`;
    params.push(tag);
    paramIndex++;
  }

  const countResult = await sql.unsafe(countQuery, params);
  const total = countResult[0]?.count || 0;

  query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(limit, offset);

  const diaries = await sql.unsafe(query, params);

  res.json({
    diaries,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

router.get('/stats', async (_req, res) => {
  const totalResult = await sql`SELECT COUNT(*) as count FROM diaries WHERE type = 'diary'`;
  const last30DaysResult = await sql`SELECT COUNT(*) as count FROM diaries WHERE type = 'diary' AND created_at > NOW() - INTERVAL '30 days'`;
  const firstEntry = await sql`SELECT created_at FROM diaries WHERE type = 'diary' ORDER BY created_at ASC LIMIT 1`;
  const aiEntriesCount = await sql`SELECT COUNT(*) as count FROM diaries WHERE type = 'ai'`;

  const total = totalResult[0]?.count || 0;
  const last30Days = last30DaysResult[0]?.count || 0;
  const daysJoined = firstEntry.length > 0
    ? Math.max(1, Math.floor((Date.now() - new Date(firstEntry[0].created_at).getTime()) / (1000 * 60 * 60 * 24)) + 1)
    : 1;

  const tagStats = await sql`
    SELECT tag, COUNT(*) as count FROM diaries, unnest(tags) as tag
    WHERE type = 'diary'
    GROUP BY tag ORDER BY count DESC LIMIT 10
  `;

  const monthlyStats = await sql`
    SELECT TO_CHAR(created_at, 'YYYY-MM') as month, COUNT(*) as count
    FROM diaries WHERE type = 'diary'
    GROUP BY month ORDER BY month DESC LIMIT 12
  `;

  res.json({
    totalEntries: total,
    last30DaysEntries: last30Days,
    daysJoined,
    aiEntriesCount: aiEntriesCount[0]?.count || 0,
    tagStats,
    monthlyStats
  });
});

router.get('/timeline', async (req, res) => {
  const search = req.query.search as string;

  let entries;
  if (search) {
    entries = await sql`
      SELECT id, title, content, tags, type, ai_summary, ai_growth_tips, ai_sentiment, created_at, updated_at
      FROM diaries
      WHERE title LIKE ${'%' + search + '%'} OR content LIKE ${'%' + search + '%'} OR (type = 'ai' AND ai_summary LIKE ${'%' + search + '%'})
      ORDER BY created_at DESC
    `;
  } else {
    entries = await sql`
      SELECT id, title, content, tags, type, ai_summary, ai_growth_tips, ai_sentiment, created_at, updated_at
      FROM diaries
      ORDER BY created_at DESC
    `;
  }

  const timeline: Record<string, Record<string, any[]>> = {};
  for (const entry of entries) {
    const date = new Date(entry.created_at);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    if (!timeline[year]) timeline[year] = {};
    if (!timeline[year][month]) timeline[year][month] = [];
    timeline[year][month].push(entry);
  }

  res.json(timeline);
});

router.get('/:id', async (req, res) => {
  const result = await sql`SELECT * FROM diaries WHERE id = ${req.params.id}`;
  if (result.length === 0) {
    res.status(404).json({ error: 'Diary not found' });
    return;
  }
  res.json(result[0]);
});

export default router;