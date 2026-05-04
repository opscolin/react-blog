import { Router } from 'express';
import { sql } from '../db';

const router = Router();

router.get('/', async (_, res) => {
  const categories = await sql`
    SELECT c.*, COUNT(a.id) as article_count
    FROM categories c
    LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
    GROUP BY c.id
    ORDER BY c.name
  `;

  res.json(categories);
});

router.get('/banner', async (_, res) => {
  const categories = await sql`
    SELECT c.id, c.name, c.slug, c.cover
    FROM categories c
    WHERE c.is_banner = true
      AND c.cover IS NOT NULL
      AND c.cover != ''
  `;

  const banners = await Promise.all(
    categories.map(async (category) => {
      const [article] = await sql`
        SELECT a.id, a.title, a.slug, a.excerpt
        FROM articles a
        WHERE a.category_id = ${category.id}
          AND a.status = 'published'
        ORDER BY a.created_at DESC
        LIMIT 1
      `;
      return {
        ...category,
        article: article || null,
      };
    })
  );

  res.json({ data: banners });
});

export default router;