"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../../db");
const auth_1 = require("../../middleware/auth");
const slugify_1 = __importDefault(require("slugify"));
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
function generateSlug(name) {
    const asciiSlug = (0, slugify_1.default)(name, { lower: true, strict: true });
    if (asciiSlug)
        return asciiSlug;
    return Buffer.from(name).toString('base64url');
}
router.get('/', async (_, res) => {
    const categories = await (0, db_1.sql) `SELECT * FROM categories ORDER BY name`;
    res.json(categories);
});
router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Name required' });
        return;
    }
    const slug = generateSlug(name);
    if (!slug) {
        res.status(400).json({ error: 'Invalid name' });
        return;
    }
    const existingResult = await (0, db_1.sql) `SELECT id FROM categories WHERE slug = ${slug}`;
    if (existingResult.length > 0) {
        res.status(400).json({ error: 'Category with this name already exists' });
        return;
    }
    const insertResult = await (0, db_1.sql) `
    INSERT INTO categories (name, slug)
    VALUES (${name}, ${slug})
    RETURNING *
  `;
    res.status(201).json(insertResult[0]);
});
router.put('/:id', async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const existingResult = await (0, db_1.sql) `SELECT * FROM categories WHERE id = ${id}`;
    const existing = existingResult[0];
    if (!existing) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }
    const slug = name ? generateSlug(name) : existing.slug;
    await (0, db_1.sql) `
    UPDATE categories SET name = ${name || existing.name}, slug = ${slug}
    WHERE id = ${id}
  `;
    const updatedResult = await (0, db_1.sql) `SELECT * FROM categories WHERE id = ${id}`;
    res.json(updatedResult[0]);
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const existingResult = await (0, db_1.sql) `SELECT id FROM categories WHERE id = ${id}`;
    if (existingResult.length === 0) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }
    await (0, db_1.sql) `UPDATE articles SET category_id = NULL WHERE category_id = ${id}`;
    await (0, db_1.sql) `DELETE FROM categories WHERE id = ${id}`;
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=categories.js.map