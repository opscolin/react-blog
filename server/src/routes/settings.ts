import { Router } from 'express';
import db from '../db';

const router = Router();

router.get('/', (_, res) => {
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

export default router;
