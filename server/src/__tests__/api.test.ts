import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'test-secret';

const testConnectionString = process.env.TEST_DATABASE_URL || 'postgresql://localhost:5432/blog_test';

async function createTestApp() {
  const app = express();
  app.use(express.json());

  const sql = postgres(testConnectionString, { ssl: 'require', max: 1 });

  await sql.unsafe(`
    DROP TABLE IF EXISTS article_tags;
    DROP TABLE IF EXISTS articles;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS settings;
    DROP TABLE IF EXISTS users;
  `);

  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tags (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      category_id INTEGER REFERENCES categories(id),
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    INSERT INTO settings (key, value) VALUES ('blogTitle', '"Test Blog"') ON CONFLICT DO NOTHING;
    INSERT INTO settings (key, value) VALUES ('menuVisibility', '{"categories":true,"tags":true,"archives":true,"about":true}') ON CONFLICT DO NOTHING;
  `);

  const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      req.userId = decoded.userId;
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  const generateToken = (userId: number) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

  const wrapQuery = async (query: string, params: any[] = []) => {
    return await sql.unsafe(query, params);
  };

  const getOne = async (query: string, params: any[] = []) => {
    const result = await sql.unsafe(query, params);
    return result[0] || null;
  };

  const getAll = async (query: string, params: any[] = []) => {
    return await sql.unsafe(query, params);
  };

  const run = async (query: string, params: any[] = []) => {
    return await sql.unsafe(query, params);
  };

  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const users = await sql`SELECT * FROM users WHERE username = ${username}`;
    const user = users[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ token: generateToken(user.id), user: { id: user.id, username: user.username } });
  });

  app.get('/api/auth/me', authMiddleware, async (req: any, res: any) => {
    const users = await sql`SELECT id, username, created_at FROM users WHERE id = ${req.userId}`;
    const user = users[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });

  app.get('/api/articles', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;
    let query = `
      SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug
      FROM articles a LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.status = 'published'
    `;
    const params: any[] = [];
    if (search) {
      query += ' AND (a.title ILIKE $1 OR a.content ILIKE $2 OR a.excerpt ILIKE $3)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    const countQuery = query.replace('SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug', 'SELECT COUNT(DISTINCT a.id) as count');
    const countResult = await sql.unsafe(countQuery, params);
    const total = countResult[0]?.count || 0;
    query += ` ORDER BY a.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    const articles = await sql.unsafe(query, params);
    const result = await Promise.all(articles.map(async (a: any) => {
      const tagsResult = await sql`SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ${a.id}`;
      return { ...a, category: a.category_id ? { id: a.category_id, name: a.category_name, slug: a.category_slug } : null, tags: tagsResult };
    }));
    res.json({ articles: result, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  });

  app.get('/api/articles/:slug', async (req, res) => {
    const articles = await sql`
      SELECT a.*, c.name as category_name, c.slug as category_slug
      FROM articles a LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.slug = ${req.params.slug} AND a.status = 'published'
    `;
    const article = articles[0];
    if (!article) return res.status(404).json({ error: 'Article not found' });
    const tagsResult = await sql`SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ${article.id}`;
    res.json({ ...article, category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null, tags: tagsResult });
  });

  app.get('/api/categories', async (_, res) => {
    const categories = await sql`
      SELECT c.*, COUNT(a.id) as article_count FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
      GROUP BY c.id ORDER BY c.name
    `;
    res.json(categories);
  });

  app.get('/api/tags', async (_, res) => {
    const tags = await sql`
      SELECT t.*, COUNT(at.article_id) as article_count FROM tags t
      LEFT JOIN article_tags at ON t.id = at.tag_id LEFT JOIN articles a ON at.article_id = a.id AND a.status = 'published'
      GROUP BY t.id ORDER BY t.name
    `;
    res.json(tags);
  });

  app.get('/api/archives', async (_, res) => {
    const articles = await sql`SELECT id, title, slug, excerpt, created_at FROM articles WHERE status = 'published' ORDER BY created_at DESC`;
    const archives: Record<string, Record<string, any[]>> = {};
    (articles as any[]).forEach(a => {
      const d = new Date(a.created_at);
      const y = d.getFullYear().toString();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      if (!archives[y]) archives[y] = {};
      if (!archives[y][m]) archives[y][m] = [];
      archives[y][m].push(a);
    });
    res.json(archives);
  });

  app.get('/api/settings', async (_, res) => {
    const rows = await sql`SELECT key, value FROM settings`;
    const settings: Record<string, any> = {};
    (rows as { key: string; value: string }[]).forEach(r => { try { settings[r.key] = JSON.parse(r.value); } catch { settings[r.key] = r.value; } });
    res.json(settings);
  });

  app.get('/api/admin/articles', authMiddleware, async (req: any, res: any) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const countResult = await sql`SELECT COUNT(*) as count FROM articles`;
    const total = countResult[0]?.count || 0;
    const articles = await sql`
      SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id ORDER BY a.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
    const result = await Promise.all((articles as any[]).map(async (a: any) => {
      const tagsResult = await sql`SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ${a.id}`;
      return { ...a, category: a.category_id ? { id: a.category_id, name: a.category_name, slug: a.category_slug } : null, tags: tagsResult };
    }));
    res.json({ articles: result, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  });

  app.get('/api/admin/articles/:id', authMiddleware, async (req: any, res: any) => {
    const articles = await sql`
      SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id WHERE a.id = ${req.params.id}
    `;
    const article = articles[0];
    if (!article) return res.status(404).json({ error: 'Article not found' });
    const tagsResult = await sql`SELECT t.* FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ${article.id}`;
    res.json({ ...article, category: article.category_id ? { id: article.category_id, name: article.category_name, slug: article.category_slug } : null, tags: tagsResult });
  });

  app.post('/api/admin/articles', authMiddleware, async (req: any, res: any) => {
    const { title, content, excerpt, categoryId, tags, status } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    const result = await sql`
      INSERT INTO articles (title, slug, content, excerpt, category_id, status)
      VALUES (${title}, ${slug}, ${content}, ${excerpt || null}, ${categoryId || null}, ${status || 'draft'})
      RETURNING *
    `;
    const article = result[0];
    if (tags?.length) {
      for (const tagId of tags) {
        await sql`INSERT INTO article_tags (article_id, tag_id) VALUES (${article.id}, ${tagId})`;
      }
    }
    res.status(201).json(article);
  });

  app.put('/api/admin/articles/:id', authMiddleware, async (req: any, res: any) => {
    const { title, content, excerpt, categoryId, tags, status } = req.body;
    const existingResult = await sql`SELECT * FROM articles WHERE id = ${req.params.id}`;
    const existing = existingResult[0];
    if (!existing) return res.status(404).json({ error: 'Article not found' });
    await sql`
      UPDATE articles SET title = ${title || existing.title}, content = ${content || existing.content},
      excerpt = ${excerpt ?? existing.excerpt}, category_id = ${categoryId ?? existing.category_id},
      status = ${status || existing.status}, updated_at = CURRENT_TIMESTAMP WHERE id = ${req.params.id}
    `;
    if (tags !== undefined) {
      await sql`DELETE FROM article_tags WHERE article_id = ${req.params.id}`;
      if (tags?.length) {
        for (const tagId of tags) {
          await sql`INSERT INTO article_tags (article_id, tag_id) VALUES (${req.params.id}, ${tagId})`;
        }
      }
    }
    const articles = await sql`SELECT * FROM articles WHERE id = ${req.params.id}`;
    res.json(articles[0]);
  });

  app.delete('/api/admin/articles/:id', authMiddleware, async (req: any, res: any) => {
    const existing = await sql`SELECT id FROM articles WHERE id = ${req.params.id}`;
    if (!existing[0]) return res.status(404).json({ error: 'Article not found' });
    await sql`DELETE FROM articles WHERE id = ${req.params.id}`;
    res.json({ success: true });
  });

  app.get('/api/admin/categories', authMiddleware, async (_, res) => {
    const categories = await sql`SELECT * FROM categories ORDER BY name`;
    res.json(categories);
  });

  app.post('/api/admin/categories', authMiddleware, async (req: any, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const result = await sql`INSERT INTO categories (name, slug) VALUES (${name}, ${slug}) RETURNING *`;
    res.status(201).json(result[0]);
  });

  app.put('/api/admin/categories/:id', authMiddleware, async (req: any, res) => {
    const existingResult = await sql`SELECT * FROM categories WHERE id = ${req.params.id}`;
    const existing = existingResult[0];
    if (!existing) return res.status(404).json({ error: 'Category not found' });
    const { name } = req.body;
    const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : existing.slug;
    await sql`UPDATE categories SET name = ${name || existing.name}, slug = ${slug} WHERE id = ${req.params.id}`;
    const categories = await sql`SELECT * FROM categories WHERE id = ${req.params.id}`;
    res.json(categories[0]);
  });

  app.delete('/api/admin/categories/:id', authMiddleware, async (req: any, res) => {
    const existing = await sql`SELECT id FROM categories WHERE id = ${req.params.id}`;
    if (!existing[0]) return res.status(404).json({ error: 'Category not found' });
    await sql`UPDATE articles SET category_id = NULL WHERE category_id = ${req.params.id}`;
    await sql`DELETE FROM categories WHERE id = ${req.params.id}`;
    res.json({ success: true });
  });

  app.get('/api/admin/tags', authMiddleware, async (_, res) => {
    const tags = await sql`SELECT * FROM tags ORDER BY name`;
    res.json(tags);
  });

  app.post('/api/admin/tags', authMiddleware, async (req: any, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const existing = await sql`SELECT id FROM tags WHERE name = ${name}`;
    if (existing[0]) return res.status(400).json({ error: 'Tag already exists' });
    const result = await sql`INSERT INTO tags (name) VALUES (${name}) RETURNING *`;
    res.status(201).json(result[0]);
  });

  app.put('/api/admin/tags/:id', authMiddleware, async (req: any, res) => {
    const existingResult = await sql`SELECT * FROM tags WHERE id = ${req.params.id}`;
    const existing = existingResult[0];
    if (!existing) return res.status(404).json({ error: 'Tag not found' });
    await sql`UPDATE tags SET name = ${req.body.name || existing.name} WHERE id = ${req.params.id}`;
    const tags = await sql`SELECT * FROM tags WHERE id = ${req.params.id}`;
    res.json(tags[0]);
  });

  app.delete('/api/admin/tags/:id', authMiddleware, async (req: any, res) => {
    const existing = await sql`SELECT id FROM tags WHERE id = ${req.params.id}`;
    if (!existing[0]) return res.status(404).json({ error: 'Tag not found' });
    await sql`DELETE FROM article_tags WHERE tag_id = ${req.params.id}`;
    await sql`DELETE FROM tags WHERE id = ${req.params.id}`;
    res.json({ success: true });
  });

  app.get('/api/admin/settings', authMiddleware, async (_, res) => {
    const rows = await sql`SELECT key, value FROM settings`;
    const settings: Record<string, any> = {};
    (rows as { key: string; value: string }[]).forEach(r => { try { settings[r.key] = JSON.parse(r.value); } catch { settings[r.key] = r.value; } });
    res.json(settings);
  });

  app.put('/api/admin/settings', authMiddleware, async (req: any, res) => {
    const updates = req.body;
    for (const [k, v] of Object.entries(updates)) {
      const valueStr = typeof v === 'string' ? v : JSON.stringify(v);
      await sql`INSERT INTO settings (key, value) VALUES (${k}, ${valueStr}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
    }
    res.json({ success: true });
  });

  app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

  return { app, sql };
}

describe('Blog API', () => {
  let app: express.Application;
  let sql: postgres.Sql;
  let token: string;
  let categoryId: number;
  let tagId: number;
  let articleId: number;

  beforeAll(async () => {
    const result = await createTestApp();
    app = result.app;
    sql = result.sql;

    const hash = bcrypt.hashSync('password123', 10);
    await sql`INSERT INTO users (username, password_hash) VALUES (${'testuser'}, ${hash})`;
    const users = await sql`SELECT id FROM users WHERE username = ${'testuser'}`;
    const user = users[0];
    token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const catResult = await sql`INSERT INTO categories (name, slug) VALUES (${'Tech'}, ${'tech'}) RETURNING *`;
    categoryId = catResult[0].id;
    const tagResult = await sql`INSERT INTO tags (name) VALUES (${'JavaScript'}) RETURNING *`;
    tagId = tagResult[0].id;
    const artResult = await sql`
      INSERT INTO articles (title, slug, content, excerpt, category_id, status)
      VALUES (${'Test Article'}, ${'test-article'}, ${'# Hello\n\nContent here'}, ${'Test excerpt'}, ${categoryId}, ${'published'})
      RETURNING *
    `;
    articleId = artResult[0].id;
    await sql`INSERT INTO article_tags (article_id, tag_id) VALUES (${articleId}, ${tagId})`;
  });

  afterAll(async () => {
    await sql.end();
  });

  describe('Health', () => {
    it('GET /api/health returns ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('Auth', () => {
    it('POST /api/auth/login returns token with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'password123' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.username).toBe('testuser');
    });

    it('POST /api/auth/login returns 401 with invalid password', async () => {
      const res = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'wrong' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('POST /api/auth/login returns 400 without credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.status).toBe(400);
    });

    it('GET /api/auth/me returns user info with valid token', async () => {
      const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('testuser');
    });

    it('GET /api/auth/me returns 401 without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('Public Articles', () => {
    it('GET /api/articles returns published articles', async () => {
      const res = await request(app).get('/api/articles');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('articles');
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.articles.length).toBeGreaterThan(0);
    });

    it('GET /api/articles with pagination', async () => {
      const res = await request(app).get('/api/articles?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(5);
    });

    it('GET /api/articles with search query', async () => {
      const res = await request(app).get('/api/articles?search=Content');
      expect(res.status).toBe(200);
      expect(res.body.articles.length).toBeGreaterThan(0);
    });

    it('GET /api/articles with search query returns empty for no match', async () => {
      const res = await request(app).get('/api/articles?search=nonexistent12345');
      expect(res.status).toBe(200);
      expect(res.body.articles.length).toBe(0);
    });

    it('GET /api/articles/:slug returns article by slug', async () => {
      const res = await request(app).get('/api/articles/test-article');
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Article');
      expect(res.body.category.slug).toBe('tech');
    });

    it('GET /api/articles/:slug returns 404 for non-existent', async () => {
      const res = await request(app).get('/api/articles/non-existent');
      expect(res.status).toBe(404);
    });
  });

  describe('Public Categories & Tags', () => {
    it('GET /api/categories returns categories with counts', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('article_count');
    });

    it('GET /api/tags returns tags with counts', async () => {
      const res = await request(app).get('/api/tags');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('Archives', () => {
    it('GET /api/archives returns articles grouped by year/month', async () => {
      const res = await request(app).get('/api/archives');
      expect(res.status).toBe(200);
      const years = Object.keys(res.body);
      expect(years.length).toBeGreaterThan(0);
    });
  });

  describe('Settings', () => {
    it('GET /api/settings returns settings', async () => {
      const res = await request(app).get('/api/settings');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('blogTitle');
    });
  });

  describe('Admin Articles', () => {
    it('GET /api/admin/articles requires auth', async () => {
      const res = await request(app).get('/api/admin/articles');
      expect(res.status).toBe(401);
    });

    it('GET /api/admin/articles returns all articles', async () => {
      const res = await request(app).get('/api/admin/articles').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.articles.length).toBeGreaterThan(0);
    });

    it('GET /api/admin/articles/:id returns single article', async () => {
      const res = await request(app).get(`/api/admin/articles/${articleId}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(articleId);
    });

    it('POST /api/admin/articles creates article', async () => {
      const res = await request(app).post('/api/admin/articles').set('Authorization', `Bearer ${token}`).send({
        title: 'New Article',
        content: '# New Content',
        excerpt: 'New excerpt',
        status: 'draft'
      });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Article');
    });

    it('POST /api/admin/articles returns 400 without title', async () => {
      const res = await request(app).post('/api/admin/articles').set('Authorization', `Bearer ${token}`).send({
        content: 'Content only'
      });
      expect(res.status).toBe(400);
    });

    it('PUT /api/admin/articles/:id updates article', async () => {
      const res = await request(app).put(`/api/admin/articles/${articleId}`).set('Authorization', `Bearer ${token}`).send({
        title: 'Updated Title'
      });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
    });

    it('DELETE /api/admin/articles/:id deletes article', async () => {
      const createRes = await request(app).post('/api/admin/articles').set('Authorization', `Bearer ${token}`).send({
        title: 'To Delete', content: 'Content', status: 'draft'
      });
      const id = createRes.body.id;
      const res = await request(app).delete(`/api/admin/articles/${id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Admin Categories', () => {
    it('GET /api/admin/categories requires auth', async () => {
      const res = await request(app).get('/api/admin/categories');
      expect(res.status).toBe(401);
    });

    it('GET /api/admin/categories returns all categories', async () => {
      const res = await request(app).get('/api/admin/categories').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('POST /api/admin/categories creates category', async () => {
      const res = await request(app).post('/api/admin/categories').set('Authorization', `Bearer ${token}`).send({ name: 'New Category' });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('New Category');
    });

    it('PUT /api/admin/categories/:id updates category', async () => {
      const res = await request(app).put(`/api/admin/categories/${categoryId}`).set('Authorization', `Bearer ${token}`).send({ name: 'Updated Tech' });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Tech');
    });

    it('DELETE /api/admin/categories/:id deletes category', async () => {
      const createRes = await request(app).post('/api/admin/categories').set('Authorization', `Bearer ${token}`).send({ name: 'To Delete Category' });
      const id = createRes.body.id;
      const res = await request(app).delete(`/api/admin/categories/${id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe('Admin Tags', () => {
    it('GET /api/admin/tags requires auth', async () => {
      const res = await request(app).get('/api/admin/tags');
      expect(res.status).toBe(401);
    });

    it('GET /api/admin/tags returns all tags', async () => {
      const res = await request(app).get('/api/admin/tags').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });

    it('POST /api/admin/tags creates tag', async () => {
      const res = await request(app).post('/api/admin/tags').set('Authorization', `Bearer ${token}`).send({ name: 'New Tag' });
      expect(res.status).toBe(201);
    });

    it('PUT /api/admin/tags/:id updates tag', async () => {
      const res = await request(app).put(`/api/admin/tags/${tagId}`).set('Authorization', `Bearer ${token}`).send({ name: 'Updated Tag' });
      expect(res.status).toBe(200);
    });

    it('DELETE /api/admin/tags/:id deletes tag', async () => {
      const createRes = await request(app).post('/api/admin/tags').set('Authorization', `Bearer ${token}`).send({ name: 'To Delete Tag' });
      const id = createRes.body.id;
      const res = await request(app).delete(`/api/admin/tags/${id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe('Admin Settings', () => {
    it('GET /api/admin/settings requires auth', async () => {
      const res = await request(app).get('/api/admin/settings');
      expect(res.status).toBe(401);
    });

    it('PUT /api/admin/settings updates settings', async () => {
      const res = await request(app).put('/api/admin/settings').set('Authorization', `Bearer ${token}`).send({
        blogTitle: 'My Updated Blog',
        menuVisibility: { categories: false, tags: true, archives: true, about: false }
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});