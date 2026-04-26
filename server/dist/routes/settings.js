"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
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
exports.default = router;
//# sourceMappingURL=settings.js.map