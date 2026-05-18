-- Blog System Database Schema (PostgreSQL)

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
  cover_image TEXT,
  category_id INTEGER REFERENCES categories(id),
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS article_views (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id),
  ip VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);
-- CREATE INDEX idx_article_views_article_ip_time ON article_views(article_id, ip, created_at);
-- CREATE INDEX idx_article_views_expire ON article_views(created_at);

CREATE TABLE IF NOT EXISTS article_tags (
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS diaries (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  type TEXT DEFAULT 'diary' CHECK(type IN ('diary', 'ai')),
  ai_summary TEXT,
  ai_growth_tips TEXT[],
  ai_sentiment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_config (
  id SERIAL PRIMARY KEY,
  api_key TEXT,
  base_url TEXT DEFAULT 'https://api.openai.com/v1',
  model TEXT DEFAULT 'gpt-3.5-turbo',
  enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_diaries_created ON diaries(created_at);
CREATE INDEX IF NOT EXISTS idx_diaries_type ON diaries(type);
CREATE INDEX IF NOT EXISTS idx_diaries_tags ON diaries USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_created ON articles(created_at);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_article_tags_article ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag ON article_tags(tag_id);

INSERT INTO settings (key, value) VALUES ('blogTitle', 'My Blog') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('blogLogo', '/images/logo.svg') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('paginationSize', '10') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('menuVisibility', '{"categories": true, "tags": true, "archives": true, "about": true, "diary": true}') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('aboutContent', '这是一个个人博客，记录技术文章和思考。') ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('aiConfig', '{"enabled": false, "model": "gpt-3.5-turbo", "baseUrl": "https://api.openai.com/v1"}') ON CONFLICT (key) DO NOTHING;
