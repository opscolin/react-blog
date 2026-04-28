import { Router, Response } from 'express';
import { sql } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const category = req.query.category as string;
  const tag = req.query.tag as string;
  const search = req.query.search as string;
  const offset = (page - 1) * limit;

  let query = `
    SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug
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

  const countQuery = query.replace('SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug', 'SELECT COUNT(DISTINCT a.id) as count');
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