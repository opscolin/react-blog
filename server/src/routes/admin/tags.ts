import { Router, Response } from 'express';
import db from '../../db';
import { authMiddleware, AuthRequest } from '../../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', (_, res: Response) => {
  const tags = db.prepare('SELECT * FROM tags ORDER BY name').all();
  res.json(tags);
});

router.post('/', (req: AuthRequest, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }

  const existing = db.prepare('SELECT id FROM tags WHERE name = ?').get(name);
  if (existing) {
    res.status(400).json({ error: 'Tag already exists' });
    return;
  }

  const result = db.prepare('INSERT INTO tags (name) VALUES (?)').run(name);
  const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(tag);
});

router.put('/:id', (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM tags WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Tag not found' });
    return;
  }

  db.prepare('UPDATE tags SET name = ? WHERE id = ?').run(name || (existing as any).name, id);
  const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(id);
  res.json(tag);
});

router.delete('/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT id FROM tags WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Tag not found' });
    return;
  }

  db.prepare('DELETE FROM article_tags WHERE tag_id = ?').run(id);
  db.prepare('DELETE FROM tags WHERE id = ?').run(id);
  res.json({ success: true });
});

export default router;
