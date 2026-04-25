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
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const total = db_1.default.prepare('SELECT COUNT(*) as count FROM articles').get().count;
    const articles = db_1.default.prepare(`
    SELECT a.*, c.name as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    ORDER BY a.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);
    const articlesWithTags = articles.map(article => {
        const tags = db_1.default.prepare(`
      SELECT t.* FROM tags t
      JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = ?
    `).all(article.id);
        return {
            ...article,
            category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null,
            tags
        };
    });
    res.json({
        articles: articlesWithTags,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
});
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const article = db_1.default.prepare(`
    SELECT a.*, c.name as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.id = ?
  `).get(id);
    if (!article) {
        res.status(404).json({ error: 'Article not found' });
        return;
    }
    const tags = db_1.default.prepare(`
    SELECT t.* FROM tags t
    JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = ?
  `).all(id);
    res.json({
        ...article,
        category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null,
        tags
    });
});
router.post('/', (req, res) => {
    const { title, content, excerpt, categoryId, tags, status, createdAt } = req.body;
    if (!title || !content) {
        res.status(400).json({ error: 'Title and content required' });
        return;
    }
    let slug = (0, slugify_1.default)(title, { lower: true, strict: true });
    const existing = db_1.default.prepare('SELECT id FROM articles WHERE slug = ?').get(slug);
    if (existing) {
        slug = `${slug}-${Date.now()}`;
    }
    const result = db_1.default.prepare(`
    INSERT INTO articles (title, slug, content, excerpt, category_id, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, slug, content, excerpt || null, categoryId || null, status || 'draft', createdAt || new Date().toISOString());
    const articleId = result.lastInsertRowid;
    if (tags && tags.length > 0) {
        const insertTag = db_1.default.prepare('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)');
        tags.forEach((tagId) => {
            insertTag.run(articleId, tagId);
        });
    }
    const article = db_1.default.prepare('SELECT * FROM articles WHERE id = ?').get(articleId);
    res.status(201).json(article);
});
router.put('/:id', (req, res) => {
    const { title, content, excerpt, categoryId, tags, status, createdAt } = req.body;
    const { id } = req.params;
    const existing = db_1.default.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    if (!existing) {
        res.status(404).json({ error: 'Article not found' });
        return;
    }
    let slug = existing.slug;
    if (title && title !== existing.title) {
        slug = (0, slugify_1.default)(title, { lower: true, strict: true });
        const conflict = db_1.default.prepare('SELECT id FROM articles WHERE slug = ? AND id != ?').get(slug, id);
        if (conflict) {
            slug = `${slug}-${Date.now()}`;
        }
    }
    const updatedCreatedAt = createdAt || existing.created_at;
    db_1.default.prepare(`
    UPDATE articles
    SET title = ?, slug = ?, content = ?, excerpt = ?, category_id = ?, status = ?, created_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title || existing.title, slug, content || existing.content, excerpt || null, categoryId || null, status || existing.status, updatedCreatedAt, id);
    if (tags !== undefined) {
        db_1.default.prepare('DELETE FROM article_tags WHERE article_id = ?').run(id);
        if (tags && tags.length > 0) {
            const insertTag = db_1.default.prepare('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)');
            tags.forEach((tagId) => {
                insertTag.run(id, tagId);
            });
        }
    }
    const article = db_1.default.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    res.json(article);
});
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const existing = db_1.default.prepare('SELECT id FROM articles WHERE id = ?').get(id);
    if (!existing) {
        res.status(404).json({ error: 'Article not found' });
        return;
    }
    db_1.default.prepare('DELETE FROM articles WHERE id = ?').run(id);
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=articles.js.map