import { Router } from 'express';
import { sql } from '../db';
const router = Router();
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
export default router;
//# sourceMappingURL=settings.js.map