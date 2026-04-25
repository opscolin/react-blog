import { Router, Response } from 'express';
import db from '../../db';
import { authMiddleware, AuthRequest } from '../../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', (_, res: Response) => {
  const settings: Record<string, any> = {};

  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];

  rows.forEach(row => {
    try {
      settings[row.key] = JSON.parse(row.value);
    } catch {
      settings[row.key] = row.value;
    }
  });

  res.json(settings);
});

router.put('/', (req: AuthRequest, res: Response) => {
  const updates = req.body;

  const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

  Object.entries(updates).forEach(([key, value]) => {
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    upsert.run(key, valueStr);
  });

  res.json({ success: true });
});

export default router;
