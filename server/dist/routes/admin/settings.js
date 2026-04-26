import { Router } from 'express';
import { sql } from '../../db';
import { authMiddleware } from '../../middleware/auth';
const router = Router();
router.use(authMiddleware);
router.get('/', async (_, res) => {
    const settings = {};
    const rows = await sql `SELECT key, value FROM settings`;
    for (const row of rows) {
        try {
            settings[row.key] = JSON.parse(row.value);
        }
        catch {
            settings[row.key] = row.value;
        }
    }
    res.json(settings);
});
router.put('/', async (req, res) => {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
        const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
        await sql `
      INSERT INTO settings (key, value)
      VALUES (${key}, ${valueStr})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
    }
    res.json({ success: true });
});
export default router;
//# sourceMappingURL=settings.js.map