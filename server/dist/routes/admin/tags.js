"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../../db");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', async (_, res) => {
    const tags = await (0, db_1.sql) `SELECT * FROM tags ORDER BY name`;
    res.json(tags);
});
router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Name required' });
        return;
    }
    const existingResult = await (0, db_1.sql) `SELECT id FROM tags WHERE name = ${name}`;
    if (existingResult.length > 0) {
        res.status(400).json({ error: 'Tag already exists' });
        return;
    }
    const insertResult = await (0, db_1.sql) `
    INSERT INTO tags (name) VALUES (${name}) RETURNING *
  `;
    res.status(201).json(insertResult[0]);
});
router.put('/:id', async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const existingResult = await (0, db_1.sql) `SELECT * FROM tags WHERE id = ${id}`;
    const existing = existingResult[0];
    if (!existing) {
        res.status(404).json({ error: 'Tag not found' });
        return;
    }
    await (0, db_1.sql) `UPDATE tags SET name = ${name || existing.name} WHERE id = ${id}`;
    const updatedResult = await (0, db_1.sql) `SELECT * FROM tags WHERE id = ${id}`;
    res.json(updatedResult[0]);
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const existingResult = await (0, db_1.sql) `SELECT id FROM tags WHERE id = ${id}`;
    if (existingResult.length === 0) {
        res.status(404).json({ error: 'Tag not found' });
        return;
    }
    await (0, db_1.sql) `DELETE FROM article_tags WHERE tag_id = ${id}`;
    await (0, db_1.sql) `DELETE FROM tags WHERE id = ${id}`;
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=tags.js.map