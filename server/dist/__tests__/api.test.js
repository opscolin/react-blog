"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = 'test-secret';
function createTestApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const dbPath = path.join(__dirname, '../data/test.db');
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    const db = new better_sqlite3_1.default(dbPath);
    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      category_id INTEGER REFERENCES categories(id),
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS article_tags (
      article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
      tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (article_id, tag_id)
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    INSERT OR IGNORE INTO settings (key, value) VALUES ('blogTitle', '"Test Blog"');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('menuVisibility', '{"categories":true,"tags":true,"archives":true,"about":true}');
  `);
    const authMiddleware = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.substring(7);
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.userId = decoded.userId;
            next();
        }
        catch {
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
    const generateToken = (userId) => jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    // Auth routes
    app.post('/api/auth/login', (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        if (!user || !bcrypt_1.default.compareSync(password, user.password_hash)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ token: generateToken(user.id), user: { id: user.id, username: user.username } });
    });
    app.get('/api/auth/me', authMiddleware, (req, res) => {
        const user = db.prepare('SELECT id, username, created_at FROM users WHERE id = ?').get(req.userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    });
    // Public routes
    app.get('/api/articles', (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const offset = (page - 1) * limit;
        let query = `
      SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug
      FROM articles a LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.status = 'published'
    `;
        const params = [];
        if (search) {
            query += ' AND (a.title LIKE ? OR a.content LIKE ? OR a.excerpt LIKE ?)';
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }
        const countQuery = query.replace('SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug', 'SELECT COUNT(DISTINCT a.id) as count');
        const total = db.prepare(countQuery).get(...params).count;
        query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        const articles = db.prepare(query).all(...params);
        const result = articles.map(a => {
            const tags = db.prepare('SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?').all(a.id);
            return { ...a, category: a.category_id ? { id: a.category_id, name: a.category_name, slug: a.category_slug } : null, tags };
        });
        res.json({ articles: result, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    });
    app.get('/api/articles/:slug', (req, res) => {
        const article = db.prepare(`
      SELECT a.*, c.name as category_name, c.slug as category_slug
      FROM articles a LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.slug = ? AND a.status = 'published'
    `).get(req.params.slug);
        if (!article)
            return res.status(404).json({ error: 'Article not found' });
        const tags = db.prepare('SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?').all(article.id);
        res.json({ ...article, category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null, tags });
    });
    app.get('/api/categories', (_, res) => {
        const categories = db.prepare(`
      SELECT c.*, COUNT(a.id) as article_count FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
      GROUP BY c.id ORDER BY c.name
    `).all();
        res.json(categories);
    });
    app.get('/api/tags', (_, res) => {
        const tags = db.prepare(`
      SELECT t.*, COUNT(at.article_id) as article_count FROM tags t
      LEFT JOIN article_tags at ON t.id = at.tag_id LEFT JOIN articles a ON at.article_id = a.id AND a.status = 'published'
      GROUP BY t.id ORDER BY t.name
    `).all();
        res.json(tags);
    });
    app.get('/api/archives', (_, res) => {
        const articles = db.prepare("SELECT id, title, slug, excerpt, created_at FROM articles WHERE status = 'published' ORDER BY created_at DESC").all();
        const archives = {};
        articles.forEach(a => {
            const d = new Date(a.created_at);
            const y = d.getFullYear().toString();
            const m = (d.getMonth() + 1).toString().padStart(2, '0');
            if (!archives[y])
                archives[y] = {};
            if (!archives[y][m])
                archives[y][m] = [];
            archives[y][m].push(a);
        });
        res.json(archives);
    });
    app.get('/api/settings', (_, res) => {
        const rows = db.prepare('SELECT key, value FROM settings').all();
        const settings = {};
        rows.forEach(r => { try {
            settings[r.key] = JSON.parse(r.value);
        }
        catch {
            settings[r.key] = r.value;
        } });
        res.json(settings);
    });
    // Admin routes
    app.get('/api/admin/articles', authMiddleware, (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const total = db.prepare('SELECT COUNT(*) as count FROM articles').get().count;
        const articles = db.prepare(`
      SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id ORDER BY a.created_at DESC LIMIT ? OFFSET ?
    `).all(limit, offset);
        const result = articles.map(a => {
            const tags = db.prepare('SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?').all(a.id);
            return { ...a, category: a.category_id ? { id: a.category_id, name: a.category_name, slug: a.category_slug } : null, tags };
        });
        res.json({ articles: result, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    });
    app.get('/api/admin/articles/:id', authMiddleware, (req, res) => {
        const article = db.prepare(`
      SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id WHERE a.id = ?
    `).get(req.params.id);
        if (!article)
            return res.status(404).json({ error: 'Article not found' });
        const tags = db.prepare('SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?').all(article.id);
        res.json({ ...article, category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null, tags });
    });
    app.post('/api/admin/articles', authMiddleware, (req, res) => {
        const { title, content, excerpt, categoryId, tags, status } = req.body;
        if (!title || !content)
            return res.status(400).json({ error: 'Title and content required' });
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
        const result = db.prepare('INSERT INTO articles (title, slug, content, excerpt, category_id, status) VALUES (?, ?, ?, ?, ?, ?)').run(title, slug, content, excerpt || null, categoryId || null, status || 'draft');
        const articleId = result.lastInsertRowid;
        if (tags?.length) {
            const insertTag = db.prepare('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)');
            tags.forEach((tagId) => insertTag.run(articleId, tagId));
        }
        res.status(201).json(db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId));
    });
    app.put('/api/admin/articles/:id', authMiddleware, (req, res) => {
        const { title, content, excerpt, categoryId, tags, status } = req.body;
        const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
        if (!existing)
            return res.status(404).json({ error: 'Article not found' });
        db.prepare('UPDATE articles SET title = ?, content = ?, excerpt = ?, category_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(title || existing.title, content || existing.content, excerpt ?? existing.excerpt, categoryId ?? existing.category_id, status || existing.status, req.params.id);
        if (tags !== undefined) {
            db.prepare('DELETE FROM article_tags WHERE article_id = ?').run(req.params.id);
            if (tags?.length) {
                const insertTag = db.prepare('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)');
                tags.forEach((tagId) => insertTag.run(req.params.id, tagId));
            }
        }
        res.json(db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id));
    });
    app.delete('/api/admin/articles/:id', authMiddleware, (req, res) => {
        const existing = db.prepare('SELECT id FROM articles WHERE id = ?').get(req.params.id);
        if (!existing)
            return res.status(404).json({ error: 'Article not found' });
        db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    });
    app.get('/api/admin/categories', authMiddleware, (_, res) => res.json(db.prepare('SELECT * FROM categories ORDER BY name').all()));
    app.post('/api/admin/categories', authMiddleware, (req, res) => {
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ error: 'Name required' });
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const result = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)').run(name, slug);
        res.status(201).json(db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid));
    });
    app.put('/api/admin/categories/:id', authMiddleware, (req, res) => {
        const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
        if (!existing)
            return res.status(404).json({ error: 'Category not found' });
        const { name } = req.body;
        const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : existing.slug;
        db.prepare('UPDATE categories SET name = ?, slug = ? WHERE id = ?').run(name || existing.name, slug, req.params.id);
        res.json(db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id));
    });
    app.delete('/api/admin/categories/:id', authMiddleware, (req, res) => {
        const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(req.params.id);
        if (!existing)
            return res.status(404).json({ error: 'Category not found' });
        db.prepare('UPDATE articles SET category_id = NULL WHERE category_id = ?').run(req.params.id);
        db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    });
    app.get('/api/admin/tags', authMiddleware, (_, res) => res.json(db.prepare('SELECT * FROM tags ORDER BY name').all()));
    app.post('/api/admin/tags', authMiddleware, (req, res) => {
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ error: 'Name required' });
        const existing = db.prepare('SELECT id FROM tags WHERE name = ?').get(name);
        if (existing)
            return res.status(400).json({ error: 'Tag already exists' });
        const result = db.prepare('INSERT INTO tags (name) VALUES (?)').run(name);
        res.status(201).json(db.prepare('SELECT * FROM tags WHERE id = ?').get(result.lastInsertRowid));
    });
    app.put('/api/admin/tags/:id', authMiddleware, (req, res) => {
        const existing = db.prepare('SELECT * FROM tags WHERE id = ?').get(req.params.id);
        if (!existing)
            return res.status(404).json({ error: 'Tag not found' });
        db.prepare('UPDATE tags SET name = ? WHERE id = ?').run(req.body.name || existing.name, req.params.id);
        res.json(db.prepare('SELECT * FROM tags WHERE id = ?').get(req.params.id));
    });
    app.delete('/api/admin/tags/:id', authMiddleware, (req, res) => {
        const existing = db.prepare('SELECT id FROM tags WHERE id = ?').get(req.params.id);
        if (!existing)
            return res.status(404).json({ error: 'Tag not found' });
        db.prepare('DELETE FROM article_tags WHERE tag_id = ?').run(req.params.id);
        db.prepare('DELETE FROM tags WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    });
    app.get('/api/admin/settings', authMiddleware, (_, res) => {
        const rows = db.prepare('SELECT key, value FROM settings').all();
        const settings = {};
        rows.forEach(r => { try {
            settings[r.key] = JSON.parse(r.value);
        }
        catch {
            settings[r.key] = r.value;
        } });
        res.json(settings);
    });
    app.put('/api/admin/settings', authMiddleware, (req, res) => {
        const updates = req.body;
        const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
        Object.entries(updates).forEach(([k, v]) => upsert.run(k, typeof v === 'string' ? v : JSON.stringify(v)));
        res.json({ success: true });
    });
    app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
    return { app, db };
}
describe('Blog API', () => {
    let app;
    let db;
    let token;
    let categoryId;
    let tagId;
    let articleId;
    beforeAll(() => {
        const result = createTestApp();
        app = result.app;
        db = result.db;
        const hash = bcrypt_1.default.hashSync('password123', 10);
        db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('testuser', hash);
        const user = db.prepare('SELECT id FROM users WHERE username = ?').get('testuser');
        token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        const catResult = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)').run('Tech', 'tech');
        categoryId = catResult.lastInsertRowid;
        const tagResult = db.prepare('INSERT INTO tags (name) VALUES (?)').run('JavaScript');
        tagId = tagResult.lastInsertRowid;
        const artResult = db.prepare('INSERT INTO articles (title, slug, content, excerpt, category_id, status) VALUES (?, ?, ?, ?, ?, ?)').run('Test Article', 'test-article', '# Hello\n\nContent here', 'Test excerpt', categoryId, 'published');
        articleId = artResult.lastInsertRowid;
        db.prepare('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)').run(articleId, tagId);
    });
    afterAll(() => {
        db.close();
        const dbPath = path.join(__dirname, '../data/test.db');
        if (fs.existsSync(dbPath))
            fs.unlinkSync(dbPath);
    });
    describe('Health', () => {
        it('GET /api/health returns ok', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/health');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ status: 'ok' });
        });
    });
    describe('Auth', () => {
        it('POST /api/auth/login returns token with valid credentials', async () => {
            const res = await (0, supertest_1.default)(app).post('/api/auth/login').send({ username: 'testuser', password: 'password123' });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.username).toBe('testuser');
        });
        it('POST /api/auth/login returns 401 with invalid password', async () => {
            const res = await (0, supertest_1.default)(app).post('/api/auth/login').send({ username: 'testuser', password: 'wrong' });
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Invalid credentials');
        });
        it('POST /api/auth/login returns 400 without credentials', async () => {
            const res = await (0, supertest_1.default)(app).post('/api/auth/login').send({});
            expect(res.status).toBe(400);
        });
        it('GET /api/auth/me returns user info with valid token', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.username).toBe('testuser');
        });
        it('GET /api/auth/me returns 401 without token', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/auth/me');
            expect(res.status).toBe(401);
        });
    });
    describe('Public Articles', () => {
        it('GET /api/articles returns published articles', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/articles');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('articles');
            expect(res.body).toHaveProperty('pagination');
            expect(res.body.articles.length).toBeGreaterThan(0);
        });
        it('GET /api/articles with pagination', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/articles?page=1&limit=5');
            expect(res.status).toBe(200);
            expect(res.body.pagination.page).toBe(1);
            expect(res.body.pagination.limit).toBe(5);
        });
        it('GET /api/articles with search query', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/articles?search=Content');
            expect(res.status).toBe(200);
            expect(res.body.articles.length).toBeGreaterThan(0);
        });
        it('GET /api/articles with search query returns empty for no match', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/articles?search=nonexistent12345');
            expect(res.status).toBe(200);
            expect(res.body.articles.length).toBe(0);
        });
        it('GET /api/articles/:slug returns article by slug', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/articles/test-article');
            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Test Article');
            expect(res.body.category.slug).toBe('tech');
        });
        it('GET /api/articles/:slug returns 404 for non-existent', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/articles/non-existent');
            expect(res.status).toBe(404);
        });
    });
    describe('Public Categories & Tags', () => {
        it('GET /api/categories returns categories with counts', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/categories');
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('article_count');
        });
        it('GET /api/tags returns tags with counts', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/tags');
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });
    describe('Archives', () => {
        it('GET /api/archives returns articles grouped by year/month', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/archives');
            expect(res.status).toBe(200);
            const years = Object.keys(res.body);
            expect(years.length).toBeGreaterThan(0);
        });
    });
    describe('Settings', () => {
        it('GET /api/settings returns settings', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/settings');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('blogTitle');
        });
    });
    describe('Admin Articles', () => {
        it('GET /api/admin/articles requires auth', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/admin/articles');
            expect(res.status).toBe(401);
        });
        it('GET /api/admin/articles returns all articles', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/admin/articles').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.articles.length).toBeGreaterThan(0);
        });
        it('GET /api/admin/articles/:id returns single article', async () => {
            const res = await (0, supertest_1.default)(app).get(`/api/admin/articles/${articleId}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(articleId);
        });
        it('POST /api/admin/articles creates article', async () => {
            const res = await (0, supertest_1.default)(app).post('/api/admin/articles').set('Authorization', `Bearer ${token}`).send({
                title: 'New Article',
                content: '# New Content',
                excerpt: 'New excerpt',
                status: 'draft'
            });
            expect(res.status).toBe(201);
            expect(res.body.title).toBe('New Article');
        });
        it('POST /api/admin/articles returns 400 without title', async () => {
            const res = await (0, supertest_1.default)(app).post('/api/admin/articles').set('Authorization', `Bearer ${token}`).send({
                content: 'Content only'
            });
            expect(res.status).toBe(400);
        });
        it('PUT /api/admin/articles/:id updates article', async () => {
            const res = await (0, supertest_1.default)(app).put(`/api/admin/articles/${articleId}`).set('Authorization', `Bearer ${token}`).send({
                title: 'Updated Title'
            });
            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Updated Title');
        });
        it('DELETE /api/admin/articles/:id deletes article', async () => {
            const createRes = await (0, supertest_1.default)(app).post('/api/admin/articles').set('Authorization', `Bearer ${token}`).send({
                title: 'To Delete', content: 'Content', status: 'draft'
            });
            const id = createRes.body.id;
            const res = await (0, supertest_1.default)(app).delete(`/api/admin/articles/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
    describe('Admin Categories', () => {
        it('GET /api/admin/categories requires auth', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/admin/categories');
            expect(res.status).toBe(401);
        });
        it('GET /api/admin/categories returns all categories', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/admin/categories').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
        it('POST /api/admin/categories creates category', async () => {
            const res = await (0, supertest_1.default)(app).post('/api/admin/categories').set('Authorization', `Bearer ${token}`).send({ name: 'New Category' });
            expect(res.status).toBe(201);
            expect(res.body.name).toBe('New Category');
        });
        it('PUT /api/admin/categories/:id updates category', async () => {
            const res = await (0, supertest_1.default)(app).put(`/api/admin/categories/${categoryId}`).set('Authorization', `Bearer ${token}`).send({ name: 'Updated Tech' });
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Updated Tech');
        });
        it('DELETE /api/admin/categories/:id deletes category', async () => {
            const createRes = await (0, supertest_1.default)(app).post('/api/admin/categories').set('Authorization', `Bearer ${token}`).send({ name: 'To Delete Category' });
            const id = createRes.body.id;
            const res = await (0, supertest_1.default)(app).delete(`/api/admin/categories/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });
    describe('Admin Tags', () => {
        it('GET /api/admin/tags requires auth', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/admin/tags');
            expect(res.status).toBe(401);
        });
        it('GET /api/admin/tags returns all tags', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/admin/tags').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
        it('POST /api/admin/tags creates tag', async () => {
            const res = await (0, supertest_1.default)(app).post('/api/admin/tags').set('Authorization', `Bearer ${token}`).send({ name: 'New Tag' });
            expect(res.status).toBe(201);
        });
        it('PUT /api/admin/tags/:id updates tag', async () => {
            const res = await (0, supertest_1.default)(app).put(`/api/admin/tags/${tagId}`).set('Authorization', `Bearer ${token}`).send({ name: 'Updated Tag' });
            expect(res.status).toBe(200);
        });
        it('DELETE /api/admin/tags/:id deletes tag', async () => {
            const createRes = await (0, supertest_1.default)(app).post('/api/admin/tags').set('Authorization', `Bearer ${token}`).send({ name: 'To Delete Tag' });
            const id = createRes.body.id;
            const res = await (0, supertest_1.default)(app).delete(`/api/admin/tags/${id}`).set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
        });
    });
    describe('Admin Settings', () => {
        it('GET /api/admin/settings requires auth', async () => {
            const res = await (0, supertest_1.default)(app).get('/api/admin/settings');
            expect(res.status).toBe(401);
        });
        it('PUT /api/admin/settings updates settings', async () => {
            const res = await (0, supertest_1.default)(app).put('/api/admin/settings').set('Authorization', `Bearer ${token}`).send({
                blogTitle: 'My Updated Blog',
                menuVisibility: { categories: false, tags: true, archives: true, about: false }
            });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});
//# sourceMappingURL=api.test.js.map