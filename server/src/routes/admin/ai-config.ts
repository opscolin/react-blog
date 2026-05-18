import { Router, Response } from 'express';
import { sql } from '../../db';
import { authMiddleware, AuthRequest } from '../../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (_req: AuthRequest, res: Response) => {
  const config = await sql`SELECT api_key, base_url, model, enabled FROM ai_config ORDER BY id DESC LIMIT 1`;
  if (config.length === 0) {
    res.json({ api_key: '', base_url: 'https://api.openai.com/v1', model: 'gpt-3.5-turbo', enabled: false });
    return;
  }
  res.json(config[0]);
});

router.put('/', async (req: AuthRequest, res: Response) => {
  const { api_key, base_url, model, enabled } = req.body;
  await sql`
    INSERT INTO ai_config (api_key, base_url, model, enabled)
    VALUES (${api_key || ''}, ${base_url || 'https://api.openai.com/v1'}, ${model || 'gpt-3.5-turbo'}, ${enabled || false})
    ON CONFLICT DO NOTHING
  `;
  await sql`
    UPDATE ai_config SET
      api_key = ${api_key || ''},
      base_url = ${base_url || 'https://api.openai.com/v1'},
      model = ${model || 'gpt-3.5-turbo'},
      enabled = ${enabled || false},
      updated_at = CURRENT_TIMESTAMP
    WHERE true
  `;
  res.json({ success: true });
});

export default router;