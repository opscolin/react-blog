"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get('/', async (_, res) => {
    const categories = await (0, db_1.sql) `
    SELECT c.*, COUNT(a.id) as article_count
    FROM categories c
    LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
    GROUP BY c.id
    ORDER BY c.name
  `;
    res.json(categories);
});
router.get('/banner', async (_, res) => {
    const categories = await (0, db_1.sql) `
    SELECT c.id, c.name, c.slug, c.cover
    FROM categories c
    WHERE c.is_banner = true
      AND c.cover IS NOT NULL
      AND c.cover != ''
  `;
    const banners = await Promise.all(categories.map(async (category) => {
        const [article] = await (0, db_1.sql) `
        SELECT a.id, a.title, a.slug, a.excerpt
        FROM articles a
        WHERE a.category_id = ${category.id}
          AND a.status = 'published'
        ORDER BY a.created_at DESC
        LIMIT 1
      `;
        return {
            ...category,
            article: article || null,
        };
    }));
    res.json({ data: banners });
});
exports.default = router;
//# sourceMappingURL=categories.js.map