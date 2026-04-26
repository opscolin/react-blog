"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../../db");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', async (_, res) => {
    const settings = {};
    const rows = await (0, db_1.sql) `SELECT key, value FROM settings`;
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
        await (0, db_1.sql) `
      INSERT INTO settings (key, value)
      VALUES (${key}, ${valueStr})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
    }
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=settings.js.map