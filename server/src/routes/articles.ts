import { Router, Response } from 'express';
import { sql } from '../db';

function getClientIP(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || '127.0.0.1';
}

const router = Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const category = req.query.category as string;
  const tag = req.query.tag as string;
  const search = req.query.search as string;
  const offset = (page - 1) * limit;

  let query = `
    SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug, a.view_count
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.status = 'published'
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (category) {
    query += ` AND c.slug = $${paramIndex++}`;
    params.push(category);
  }

  if (tag) {
    query += ` AND EXISTS (
      SELECT 1 FROM article_tags at
      JOIN tags t ON at.tag_id = t.id
      WHERE at.article_id = a.id AND t.name = $${paramIndex++}
    )`;
    params.push(tag);
  }

  if (search) {
    query += ` AND (a.title LIKE $${paramIndex} OR a.content LIKE $${paramIndex + 1} OR a.excerpt LIKE $${paramIndex + 2})`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
    paramIndex += 3;
  }

  const countQuery = query.replace('SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug, a.view_count', 'SELECT COUNT(DISTINCT a.id) as count');
  const countResult = await sql.unsafe(countQuery, params);
  const total = countResult[0]?.count || 0;

  query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(limit, offset);

  const articles = await sql.unsafe(query, params);

  const articlesWithTags = await Promise.all(articles.map(async (article: any) => {
    const tags = await sql`
      SELECT t.* FROM tags t
      JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = ${article.id}
    `;

    return {
      ...article,
      category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null,
      tags
    };
  }));

  res.json({
    articles: articlesWithTags,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

router.get('/:slug', async (req, res) => {
  const articleResult = await sql`
    SELECT a.*, c.name as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.slug = ${req.params.slug} AND a.status = 'published'
  `;

  const article = articleResult[0];

  if (!article) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  const clientIP = getClientIP(req);

  const recentView = await sql`
    SELECT id FROM article_views
    WHERE article_id = ${article.id}
      AND ip = ${clientIP}
      AND created_at > NOW() - INTERVAL '5 minutes'
  `;

  if (recentView.length === 0) {
    await sql`
      INSERT INTO article_views (article_id, ip) VALUES (${article.id}, ${clientIP})
    `;
    await sql`
      UPDATE articles SET view_count = view_count + 1 WHERE id = ${article.id}
    `;
    article.view_count = (article.view_count || 0) + 1;
  }

  const tags = await sql`
    SELECT t.* FROM tags t
    JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = ${article.id}
  `;

  res.json({
    ...article,
    category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null,
    tags
  });
});

export default router;