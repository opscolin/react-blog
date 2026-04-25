import { Router } from 'express';
import db from '../db';

const router = Router();

router.get('/', (_, res) => {
  const categories = db.prepare(`
    SELECT c.*, COUNT(a.id) as article_count
    FROM categories c
    LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
    GROUP BY c.id
    ORDER BY c.name
  `).all();

  res.json(categories);
});

export default router;
