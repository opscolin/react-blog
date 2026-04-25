import { Router, Response } from 'express';
import db from '../../db';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import slugify from 'slugify';

const router = Router();
router.use(authMiddleware);

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category_id: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

router.get('/', (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const total = (db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number }).count;

  const articles = db.prepare(`
    SELECT a.*, c.name as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    ORDER BY a.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as any[];

  const articlesWithTags = articles.map(article => {
    const tags = db.prepare(`
      SELECT t.* FROM tags t
      JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = ?
    `).all(article.id);
    return {
      ...article,
      category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null,
      tags
    };
  });

  res.json({
    articles: articlesWithTags,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const article = db.prepare(`
    SELECT a.*, c.name as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.id = ?
  `).get(id) as any;

  if (!article) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  const tags = db.prepare(`
    SELECT t.* FROM tags t
    JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = ?
  `).all(id);

  res.json({
    ...article,
    category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null,
    tags
  });
});

router.post('/', (req: AuthRequest, res: Response) => {
  const { title, content, excerpt, categoryId, tags, status, createdAt } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: 'Title and content required' });
    return;
  }

  let slug = slugify(title, { lower: true, strict: true });
  const existing = db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug);
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const result = db.prepare(`
    INSERT INTO articles (title, slug, content, excerpt, category_id, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, slug, content, excerpt || null, categoryId || null, status || 'draft', createdAt || new Date().toISOString());

  const articleId = result.lastInsertRowid;

  if (tags && tags.length > 0) {
    const insertTag = db.prepare('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)');
    tags.forEach((tagId: number) => {
      insertTag.run(articleId, tagId);
    });
  }

  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId);
  res.status(201).json(article);
});

router.put('/:id', (req: AuthRequest, res: Response) => {
  const { title, content, excerpt, categoryId, tags, status, createdAt } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  let slug = (existing as Article).slug;
  if (title && title !== (existing as Article).title) {
    slug = slugify(title, { lower: true, strict: true });
    const conflict = db.prepare('SELECT id FROM articles WHERE slug = ? AND id != ?').get(slug, id);
    if (conflict) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const updatedCreatedAt = createdAt || (existing as Article).created_at;

  db.prepare(`
    UPDATE articles
    SET title = ?, slug = ?, content = ?, excerpt = ?, category_id = ?, status = ?, created_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title || (existing as Article).title, slug, content || (existing as Article).content, excerpt || null, categoryId || null, status || (existing as Article).status, updatedCreatedAt, id);

  if (tags !== undefined) {
    db.prepare('DELETE FROM article_tags WHERE article_id = ?').run(id);
    if (tags && tags.length > 0) {
      const insertTag = db.prepare('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)');
      tags.forEach((tagId: number) => {
        insertTag.run(id, tagId);
      });
    }
  }

  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  res.json(article);
});

router.delete('/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT id FROM articles WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  db.prepare('DELETE FROM articles WHERE id = ?').run(id);
  res.json({ success: true });
});

export default router;
