"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/', (_, res) => {
    const articles = db_1.default.prepare(`
    SELECT id, title, slug, excerpt, created_at
    FROM articles
    WHERE status = 'published'
    ORDER BY created_at DESC
  `).all();
    const archives = {};
    articles.forEach(article => {
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