import { Router } from 'express';
import db from '../db';

const router = Router();

router.get('/', (_, res) => {
  const articles = db.prepare(`
    SELECT id, title, slug, excerpt, created_at
    FROM articles
    WHERE status = 'published'
    ORDER BY created_at DESC
  `).all() as any[];

  const archives: Record<string, Record<string, any[]>> = {};

  articles.forEach(article => {
    const date = new Date(article.created_at);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    if (!archives[year]) {
      archives[year] = {};
    }
    if (!archives[year][month]) {
      archives[year][month] = [];
    }
    archives[year][month].push(article);
  });

  res.json(archives);
});

export default router;
