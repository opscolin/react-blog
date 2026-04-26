"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get('/', async (_, res) => {
    const articles = await (0, db_1.sql) `
    SELECT id, title, slug, excerpt, created_at
    FROM articles
    WHERE status = 'published'
    ORDER BY created_at DESC
  `;
    const archives = {};
    articles.forEach((article) => {
        const date = new Date(article.created_at);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        if (!archives[year]) {
            archives[year] = {};
        }
        if (!archives[year][month]) {
            archives[year][month] = [];
        }
        archives[year][month].push(article);
    });
    res.json(archives);
});
exports.default = router;
//# sourceMappingURL=archives.js.map