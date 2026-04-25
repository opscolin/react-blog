"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../../db"));
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', (_, res) => {
    const settings = {};
    const rows = db_1.default.prepare('SELECT key, value FROM settings').all();
    rows.forEach(row => {
        try {
            settings[row.key] = JSON.parse(row.value);
        }
        catch {
            settings[row.key] = row.value;
        }
    });
    res.json(settings);
});
router.put('/', (req, res) => {
    const updates = req.body;
    const upsert = db_1.default.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    Object.entries(updates).forEach(([key, value]) => {
        const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
        upsert.run(key, valueStr);
    });
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=settings.js.map