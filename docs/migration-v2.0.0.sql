-- ============================================================
-- New Feature: Homepage Redesign v2.0.0
-- SQL Migration for Production Database
-- Date: 2026-05-04
-- ============================================================

-- ============================================================
-- 1. Schema Changes
-- ============================================================

-- 1a. categories: add is_banner and cover fields
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_banner BOOLEAN DEFAULT false;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS cover TEXT;

-- 1b. create quotes table for notification bar (金句通知栏)
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. Initial Data
-- ============================================================

-- 2a. sample quotes
INSERT INTO quotes (content) VALUES
  ('人生若只如初见，何事秋风悲画扇。'),
  ('山重水复疑无路，柳暗花明又一村。'),
  ('不以物喜，不以己悲。'),
  ('路漫漫其修远兮，吾将上下而求索。'),
  ('长风破浪会有时，直挂云帆济沧海。');

-- 2b. navigation menus config (routes match the frontend: /category, /tag, /archive)
INSERT INTO settings (key, value) VALUES
  ('navigation_menus', '{"首页": {"path": "/", "visible": true}, "文章": {"path": null, "visible": true, "children": [{"name": "归档", "path": "/archive"}, {"name": "分类", "path": "/category"}, {"name": "标签", "path": "/tag"}]}, "产品": {"path": null, "visible": true, "children": [{"name": "微光", "path": "/products/weiguang"}, {"name": "树年", "path": "/products/shunian"}]}, "我的": {"path": "/about", "visible": true}, "友链": {"path": "/links", "visible": true}, "关于": {"path": "/about", "visible": true}}')
ON CONFLICT (key) DO NOTHING;

-- 2c. quote cache toggle (default: disabled until Redis is deployed)
INSERT INTO settings (key, value) VALUES ('enable_quote_cache', 'false')
ON CONFLICT (key) DO NOTHING;

-- 2d. banner carousel toggle (default: enabled)
INSERT INTO settings (key, value) VALUES ('enable_banner_carousel', 'true')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 3. Fix: Update navigation paths (if previously set with /categories, /tags, /archives)
-- ============================================================
UPDATE settings
SET value = '{"首页": {"path": "/", "visible": true}, "文章": {"path": null, "visible": true, "children": [{"name": "归档", "path": "/archive"}, {"name": "分类", "path": "/category"}, {"name": "标签", "path": "/tag"}]}, "产品": {"path": null, "visible": true, "children": [{"name": "微光", "path": "/products/weiguang"}, {"name": "树年", "path": "/products/shunian"}]}, "我的": {"path": "/about", "visible": true}, "友链": {"path": "/links", "visible": true}, "关于": {"path": "/about", "visible": true}}'
WHERE key = 'navigation_menus';

-- ============================================================
-- 4. Optional: Test category for banner carousel
-- ============================================================
-- Uncomment to create a test category with banner:
-- INSERT INTO categories (name, slug, cover, is_banner)
-- VALUES ('OpenCode知识库', 'opencode-knowledge', '/images/banner-test.png', true)
-- ON CONFLICT (slug) DO UPDATE SET cover = '/images/banner-test.png', is_banner = true;
