import { Router } from 'express';
import { sql } from '../db';

const router = Router();

router.get('/', async (_, res) => {
  const articles = await sql`
    SELECT id, title, slug, excerpt, created_at
    FROM articles
    WHERE status = 'published'
    ORDER BY created_at DESC
  `;

  const archives: Record<string, Record<string, any[]>> = {};

  articles.forEach((article: any) => {
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