import { Router, Response } from 'express';
import { sql } from '../../db';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import slugify from 'slugify';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const countResult = await sql`SELECT COUNT(*) as count FROM articles`;
  const total = countResult[0]?.count || 0;

  const articles = await sql`
    SELECT a.*, c.name as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    ORDER BY a.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

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

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const articleResult = await sql`
    SELECT a.*, c.name as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.id = ${id}
  `;
  const article = articleResult[0];

  if (!article) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  const tags = await sql`
    SELECT t.* FROM tags t
    JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = ${id}
  `;

  res.json({
    ...article,
    category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null,
    tags
  });
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { title, content, excerpt, categoryId, tags, status, createdAt } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: 'Title and content required' });
    return;
  }

  let slug = slugify(title, { lower: true, strict: true });
  const existingSlug = await sql`SELECT id FROM articles WHERE slug = ${slug}`;
  if (existingSlug.length > 0) {
    slug = `${slug}-${Date.now()}`;
  }

  const insertResult = await sql`
    INSERT INTO articles (title, slug, content, excerpt, category_id, status, created_at)
    VALUES (${title}, ${slug}, ${content}, ${excerpt || null}, ${categoryId || null}, ${status || 'draft'}, ${createdAt || new Date().toISOString()})
    RETURNING *
  `;

  const article = insertResult[0];

  if (tags && tags.length > 0) {
    for (const tagId of tags) {
      await sql`INSERT INTO article_tags (article_id, tag_id) VALUES (${article.id}, ${tagId})`;
    }
  }

  res.status(201).json(article);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { title, content, excerpt, categoryId, tags, status, createdAt } = req.body;
  const { id } = req.params;

  const existingResult = await sql`SELECT * FROM articles WHERE id = ${id}`;
  const existing = existingResult[0];
  if (!existing) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  let slug = existing.slug;
  if (title && title !== existing.title) {
    slug = slugify(title, { lower: true, strict: true });
    const conflictResult = await sql`SELECT id FROM articles WHERE slug = ${slug} AND id != ${id}`;
    if (conflictResult.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const updatedCreatedAt = createdAt || existing.created_at;

  await sql`
    UPDATE articles
    SET title = ${title || existing.title},
        slug = ${slug},
        content = ${content || existing.content},
        excerpt = ${excerpt || null},
        category_id = ${categoryId || null},
        status = ${status || existing.status},
        created_at = ${updatedCreatedAt},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `;

  if (tags !== undefined) {
    await sql`DELETE FROM article_tags WHERE article_id = ${id}`;
    if (tags && tags.length > 0) {
      for (const tagId of tags) {
        await sql`INSERT INTO article_tags (article_id, tag_id) VALUES (${id}, ${tagId})`;
      }
    }
  }

  const articleResult = await sql`SELECT * FROM articles WHERE id = ${id}`;
  res.json(articleResult[0]);
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existingResult = await sql`SELECT id FROM articles WHERE id = ${id}`;
  if (existingResult.length === 0) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  await sql`DELETE FROM articles WHERE id = ${id}`;
  res.json({ success: true });
});

export default router;