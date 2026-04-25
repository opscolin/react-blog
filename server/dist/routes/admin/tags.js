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
    const tags = db_1.default.prepare('SELECT * FROM tags ORDER BY name').all();
    res.json(tags);
});
router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Name required' });
        return;
    }
    const existing = db_1.default.prepare('SELECT id FROM tags WHERE name = ?').get(name);
    if (existing) {
        res.status(400).json({ error: 'Tag already exists' });
        return;
    }
    const result = db_1.default.prepare('INSERT INTO tags (name) VALUES (?)').run(name);
    const tag = db_1.default.prepare('SELECT * FROM tags WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(tag);
});
router.put('/:id', (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const existing = db_1.default.prepare('SELECT * FROM tags WHERE id = ?').get(id);
    if (!existing) {
        res.status(404).json({ error: 'Tag not found' });
        return;
    }
    db_1.default.prepare('UPDATE tags SET name = ? WHERE id = ?').run(name || existing.name, id);
    const tag = db_1.default.prepare('SELECT * FROM tags WHERE id = ?').get(id);
    res.json(tag);
});
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const existing = db_1.default.prepare('SELECT id FROM tags WHERE id = ?').get(id);
    if (!existing) {
        res.status(404).json({ error: 'Tag not found' });
        return;
    }
    db_1.default.prepare('DELETE FROM article_tags WHERE tag_id = ?').run(id);
    db_1.default.prepare('DELETE FROM tags WHERE id = ?').run(id);
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=tags.js.map