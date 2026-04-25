import { Router, Response } from 'express';
import db from '../../db';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import slugify from 'slugify';

const router = Router();
router.use(authMiddleware);

router.get('/', (_, res: Response) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
  res.json(categories);
});

router.post('/', (req: AuthRequest, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }

  const slug = slugify(name, { lower: true, strict: true });
  const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);

  if (existing) {
    res.status(400).json({ error: 'Category with this name already exists' });
    return;
  }

  const result = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)').run(name, slug);
  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(category);
});

router.put('/:id', (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  const slug = name ? slugify(name, { lower: true, strict: true }) : (existing as any).slug;

  db.prepare('UPDATE categories SET name = ?, slug = ? WHERE id = ?').run(name || (existing as any).name, slug, id);
  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  res.json(category);
});

router.delete('/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
  if (!existing) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  db.prepare('UPDATE articles SET category_id = NULL WHERE category_id = ?').run(id);
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  res.json({ success: true });
});

export default router;
