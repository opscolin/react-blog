import { Router, Response } from 'express';
import { sql } from '../../db';
import { authMiddleware, AuthRequest } from '../../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (_: AuthRequest, res: Response) => {
  const tags = await sql`SELECT * FROM tags ORDER BY name`;
  res.json(tags);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Name required' });
    return;
  }

  const existingResult = await sql`SELECT id FROM tags WHERE name = ${name}`;
  if (existingResult.length > 0) {
    res.status(400).json({ error: 'Tag already exists' });
    return;
  }

  const insertResult = await sql`
    INSERT INTO tags (name) VALUES (${name}) RETURNING *
  `;
  res.status(201).json(insertResult[0]);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const { id } = req.params;

  const existingResult = await sql`SELECT * FROM tags WHERE id = ${id}`;
  const existing = existingResult[0];
  if (!existing) {
    res.status(404).json({ error: 'Tag not found' });
    return;
  }

  await sql`UPDATE tags SET name = ${name || existing.name} WHERE id = ${id}`;
  const updatedResult = await sql`SELECT * FROM tags WHERE id = ${id}`;
  res.json(updatedResult[0]);
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existingResult = await sql`SELECT id FROM tags WHERE id = ${id}`;
  if (existingResult.length === 0) {
    res.status(404).json({ error: 'Tag not found' });
    return;
  }

  await sql`DELETE FROM article_tags WHERE tag_id = ${id}`;
  await sql`DELETE FROM tags WHERE id = ${id}`;
  res.json({ success: true });
});

export default router;