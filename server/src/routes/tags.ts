import { Router } from 'express';
import db from '../db';

const router = Router();

router.get('/', (_, res) => {
  const tags = db.prepare(`
    SELECT t.*, COUNT(at.article_id) as article_count
    FROM tags t
    LEFT JOIN article_tags at ON t.id = at.tag_id
    LEFT JOIN articles a ON at.article_id = a.id AND a.status = 'published'
    GROUP BY t.id
    ORDER BY t.name
  `).all();

  res.json(tags);
});

export default router;
