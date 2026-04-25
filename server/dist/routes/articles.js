"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const tag = req.query.tag;
    const search = req.query.search;
    const offset = (page - 1) * limit;
    let query = `
    SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.status = 'published'
  `;
    const params = [];
    if (category) {
        query += ' AND c.slug = ?';
        params.push(category);
    }
    if (tag) {
        query += ` AND EXISTS (
      SELECT 1 FROM article_tags at
      JOIN tags t ON at.tag_id = t.id
      WHERE at.article_id = a.id AND t.name = ?
    )`;
        params.push(tag);
    }
    if (search) {
        query += ' AND (a.title LIKE ? OR a.content LIKE ? OR a.excerpt LIKE ?)';
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
    }
    const countQuery = query.replace('SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug', 'SELECT COUNT(DISTINCT a.id) as count');
    const total = db_1.default.prepare(countQuery).get(...params).count;
    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const articles = db_1.default.prepare(query).all(...params);
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
router.get('/:slug', (req, res) => {
    const article = db_1.default.prepare(`
    SELECT a.*, c.name as category_name, c.slug as category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.slug = ? AND a.status = 'published'
  `).get(req.params.slug);
    if (!article) {
        res.status(404).json({ error: 'Article not found' });
        return;
    }
    const tags = db_1.default.prepare(`
    SELECT t.* FROM tags t
    JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = ?
  `).all(article.id);
    res.json({
        ...article,
        category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null,
        tags
    });
});
exports.default = router;
//# sourceMappingURL=articles.js.map