"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../../db"));
const auth_1 = require("../../middleware/auth");
const slugify_1 = __importDefault(require("slugify"));
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', (_, res) => {
    const categories = db_1.default.prepare('SELECT * FROM categories ORDER BY name').all();
    res.json(categories);
});
router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Name required' });
        return;
    }
    const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
    const existing = db_1.default.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
    if (existing) {
        res.status(400).json({ error: 'Category with this name already exists' });
        return;
    }
    const result = db_1.default.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)').run(name, slug);
    const category = db_1.default.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(category);
});
router.put('/:id', (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const existing = db_1.default.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!existing) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }
    const slug = name ? (0, slugify_1.default)(name, { lower: true, strict: true }) : existing.slug;
    db_1.default.prepare('UPDATE categories SET name = ?, slug = ? WHERE id = ?').run(name || existing.name, slug, id);
    const category = db_1.default.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.json(category);
});
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const existing = db_1.default.prepare('SELECT id FROM categories WHERE id = ?').get(id);
    if (!existing) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }
    db_1.default.prepare('UPDATE articles SET category_id = NULL WHERE category_id = ?').run(id);
    db_1.default.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=categories.js.map