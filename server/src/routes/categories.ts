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

export default router;