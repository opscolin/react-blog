import { Router, Response } from 'express';
import { sql } from '../../db';
import { authMiddleware, AuthRequest } from '../../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (_req: AuthRequest, res: Response) => {
  const diaries = await sql`SELECT * FROM diaries ORDER BY created_at DESC`;
  res.json(diaries);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { title, content, tags, type } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }
  const result = await sql`
    INSERT INTO diaries (title, content, tags, type)
    VALUES (${title}, ${content}, ${tags || []}, ${type || 'diary'})
    RETURNING *
  `;
  res.json(result[0]);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { title, content, tags, type } = req.body;
  const result = await sql`
    UPDATE diaries SET
      title = ${title},
      content = ${content},
      tags = ${tags || []},
      type = ${type || 'diary'},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${req.params.id}
    RETURNING *
  `;
  if (result.length === 0) {
    res.status(404).json({ error: 'Diary not found' });
    return;
  }
  res.json(result[0]);
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const result = await sql`DELETE FROM diaries WHERE id = ${req.params.id} RETURNING id`;
  if (result.length === 0) {
    res.status(404).json({ error: 'Diary not found' });
    return;
  }
  res.json({ success: true });
});

export default router;