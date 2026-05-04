# 博客主页重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构博客主页，新增导航栏、通知栏、轮播广告位、分类滑动展示，将文章列表分页改为无限滚动

**Architecture:** 采用后端配置驱动导航菜单，数据来源包括 settings 表（navigation_menus、enable_quote_cache）和 categories 表（is_banner、cover）。金句使用 Redis 缓存（可开关）。

**Tech Stack:** React + Vite (frontend), Express + PostgreSQL (backend), Redis (缓存)

---

## 文件结构

### 后端
```
server/src/
├── db/
│   └── schema.pg.sql          # 数据库 Schema 修改
├── routes/
│   ├── quotes.ts              # 新增: 金句随机接口
│   └── categories.ts          # 修改: 新增 banner 接口
├── index.ts                   # 修改: 注册新路由
└── db/index.ts                # 修改: Redis 缓存逻辑
```

### 前端
```
client/src/
├── components/
│   ├── Layout/Layout.tsx       # 重构: 导航栏
│   ├── NotificationBar/       # 新增: 通知栏组件
│   │   ├── NotificationBar.tsx
│   │   └── NotificationBar.css
│   ├── BannerCarousel/        # 新增: 轮播广告位
│   │   ├── BannerCarousel.tsx
│   │   └── BannerCarousel.css
│   └── CategorySlider/        # 新增: 分类滑动展示
│       ├── CategorySlider.tsx
│       └── CategorySlider.css
├── pages/
│   ├── Home/Home.tsx          # 修改: 无限滚动
│   ├── Home/Home.css          # 修改: 样式调整
│   ├── Product/               # 新增: 产品占位页面
│   │   └── Product.tsx
│   └── NotFound/NotFound.tsx  # 可能复用现有
├── types/index.ts             # 修改: 新增类型定义
└── api/index.ts               # 修改: 新增 API 方法
```

---

## Task 1: 数据库 Schema 修改

**Files:**
- Modify: `server/src/db/schema.pg.sql`

- [ ] **Step 1: 添加 categories 表新字段**

```sql
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_banner BOOLEAN DEFAULT false;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS cover TEXT;
```

- [ ] **Step 2: 创建 quotes 表**

```sql
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] **Step 3: 插入示例金句数据**

```sql
INSERT INTO quotes (content) VALUES
  ('人生若只如初见，何事秋风悲画扇。'),
  ('山重水复疑无路，柳暗花明又一村。'),
  ('不以物喜，不以己悲。')
ON CONFLICT DO NOTHING;
```

- [ ] **Step 4: 添加 navigation_menus 默认配置**

```sql
INSERT INTO settings (key, value) VALUES
  ('navigation_menus', '{"首页": {"path": "/", "visible": true}, "文章": {"path": null, "visible": true, "children": [{"name": "归档", "path": "/archives"}, {"name": "分类", "path": "/categories"}, {"name": "标签", "path": "/tags"}]}, "产品": {"path": null, "visible": true, "children": [{"name": "微光", "path": "/products/weiguang"}, {"name": "树年", "path": "/products/shunian"}]}, "我的": {"path": "/about", "visible": true}, "友链": {"path": "/links", "visible": true}, "关于": {"path": "/about", "visible": true}}')
ON CONFLICT (key) DO NOTHING;
INSERT INTO settings (key, value) VALUES ('enable_quote_cache', 'true')
ON CONFLICT (key) DO NOTHING;
```

---

## Task 2: 后端 API - 金句接口

**Files:**
- Create: `server/src/routes/quotes.ts`
- Modify: `server/src/index.ts`
- Modify: `server/src/db/index.ts`

- [ ] **Step 1: 在 db/index.ts 添加 Redis 缓存逻辑**

在 `getSql()` 函数之前添加:

```typescript
import redis from 'redis';

let redisClient: ReturnType<typeof redis.createClient> | null = null;

function getRedisClient(): ReturnType<typeof redis.createClient> | null {
  if (process.env.REDIS_URL) {
    if (!redisClient) {
      redisClient = redis.createClient({ url: process.env.REDIS_URL });
      redisClient.on('error', (err) => console.error('Redis Client Error', err));
    }
    return redisClient;
  }
  return null;
}

export async function getRedis(): Promise<ReturnType<typeof redis.createClient> | null> {
  const client = getRedisClient();
  if (client && !client.isOpen) {
    await client.connect();
  }
  return client;
}
```

- [ ] **Step 2: 创建 quotes.ts 路由**

```typescript
import { Router } from 'express';
import { sql, getRedis } from '../db';

const router = Router();

router.get('/random', async (_, res) => {
  try {
    const settingsRows = await sql`SELECT value FROM settings WHERE key = 'enable_quote_cache'`;
    const enableCache = settingsRows[0]?.value === 'true';
    const redis = await getRedis();

    if (enableCache && redis) {
      const cached = await redis.get('quote:random');
      if (cached) {
        res.json(JSON.parse(cached));
        return;
      }
    }

    const quote = await sql`SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1`;

    if (enableCache && redis && quote[0]) {
      await redis.setEx('quote:random', 3600, JSON.stringify(quote[0]));
    }

    res.json(quote[0] || { id: 0, content: '暂无金句' });
  } catch (error) {
    console.error('Error fetching random quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

export default router;
```

- [ ] **Step 3: 在 index.ts 注册路由**

```typescript
import quotesRoutes from './routes/quotes';
// ...existing imports

app.use('/api/quotes', quotesRoutes);
// ...existing routes
```

---

## Task 3: 后端 API - Banner 分类接口

**Files:**
- Modify: `server/src/routes/categories.ts`

- [ ] **Step 1: 修改 categories.ts 添加 banner 接口**

```typescript
import { Router } from 'express';
import { sql } from '../db';

const router = Router();

router.get('/', async (_, res) => {
  const categories = await sql`
    SELECT c.*, COUNT(a.id) as article_count
    FROM categories c
    LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
    GROUP BY c.id
    ORDER BY c.name
  `;
  res.json(categories);
});

router.get('/banner', async (_, res) => {
  const categories = await sql`
    SELECT c.* FROM categories c
    WHERE c.is_banner = true AND c.cover IS NOT NULL AND c.cover != ''
    ORDER BY c.name
  `;

  const result = await Promise.all(categories.map(async (category: any) => {
    const articles = await sql`
      SELECT a.id, a.title, a.slug, a.excerpt
      FROM articles a
      WHERE a.category_id = ${category.id} AND a.status = 'published'
      ORDER BY a.created_at DESC
      LIMIT 1
    `;
    return {
      ...category,
      article: articles[0] || null
    };
  }));

  res.json({ data: result });
});

export default router;
```

---

## Task 4: 前端类型定义

**Files:**
- Modify: `client/src/types/index.ts`

- [ ] **Step 1: 添加新类型定义**

```typescript
export interface Quote {
  id: number;
  content: string;
  created_at?: string;
}

export interface BannerCategory {
  id: number;
  name: string;
  slug: string;
  cover: string;
  is_banner?: boolean;
  article: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
  } | null;
}

export interface NavigationMenu {
  [key: string]: {
    path: string | null;
    visible: boolean;
    children?: Array<{
      name: string;
      path: string;
      cover?: string;
    }>;
  };
}

export interface Settings {
  blogTitle: string;
  blogLogo: string;
  paginationSize: number;
  aboutContent: string;
  menuVisibility: {
    categories: boolean;
    tags: boolean;
    archives: boolean;
    about: boolean;
  };
  navigation_menus?: NavigationMenu;
  enable_quote_cache?: boolean;
}
```

---

## Task 5: 前端 API

**Files:**
- Modify: `client/src/api/index.ts`

- [ ] **Step 1: 添加新 API 方法**

```typescript
getQuote: () => api.get('/quotes/random'),
getBannerCategories: () => api.get('/categories/banner'),
```

---

## Task 6: 前端 - 通知栏组件

**Files:**
- Create: `client/src/components/NotificationBar/NotificationBar.tsx`
- Create: `client/src/components/NotificationBar/NotificationBar.css`

- [ ] **Step 1: 创建 NotificationBar.tsx**

```tsx
import { useState, useEffect } from 'react';
import api from '../../api';
import type { Quote } from '../../types';
import './NotificationBar.css';

export default function NotificationBar() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    api.get('/quotes/random').then(res => {
      setQuote(res.data);
    });
  }, []);

  if (!quote) return null;

  return (
    <div className="notification-bar">
      <div className="notification-content">
        <span className="quote-icon">💬</span>
        <span className="quote-text">{quote.content}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 NotificationBar.css**

```css
.notification-bar {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 8px 16px;
  text-align: center;
}

.notification-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.quote-icon {
  font-size: 16px;
}

.quote-text {
  font-style: italic;
}
```

---

## Task 7: 前端 - 轮播广告位组件

**Files:**
- Create: `client/src/components/BannerCarousel/BannerCarousel.tsx`
- Create: `client/src/components/BannerCarousel/BannerCarousel.css`

- [ ] **Step 1: 创建 BannerCarousel.tsx**

```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import type { BannerCategory } from '../../types';
import './BannerCarousel.css';

export default function BannerCarousel() {
  const [banners, setBanners] = useState<BannerCategory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories/banner').then(res => {
      setBanners(res.data.data || []);
    });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleClick = () => {
    const banner = banners[currentIndex];
    if (banner) {
      navigate(`/categories/${banner.slug}`);
    }
  };

  if (banners.length === 0) return null;

  const banner = banners[currentIndex];

  return (
    <div className="banner-carousel">
      <div className="banner-item" onClick={handleClick}>
        <img src={banner.cover} alt={banner.name} className="banner-image" />
        <div className="banner-overlay">
          <h3 className="banner-title">{banner.name}</h3>
          {banner.article && (
            <p className="banner-article-title">{banner.article.title}</p>
          )}
        </div>
      </div>
      {banners.length > 1 && (
        <>
          <button className="banner-nav prev" onClick={handlePrev}>‹</button>
          <button className="banner-nav next" onClick={handleNext}>›</button>
          <div className="banner-dots">
            {banners.map((_, index) => (
              <span
                key={index}
                className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 创建 BannerCarousel.css**

```css
.banner-carousel {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 24px;
}

.banner-item {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
}

.banner-title {
  font-size: 24px;
  margin: 0 0 8px;
}

.banner-article-title {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.banner-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  font-size: 32px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

.banner-nav:hover {
  background: rgba(255,255,255,0.3);
}

.banner-nav.prev { left: 16px; }
.banner-nav.next { right: 16px; }

.banner-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.banner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: background 0.2s;
}

.banner-dot.active {
  background: white;
}
```

---

## Task 8: 前端 - 分类滑动展示组件

**Files:**
- Create: `client/src/components/CategorySlider/CategorySlider.tsx`
- Create: `client/src/components/CategorySlider/CategorySlider.css`

- [ ] **Step 1: 创建 CategorySlider.tsx**

```tsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import type { Category } from '../../types';
import './CategorySlider.css';

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="category-slider">
      <div className="category-slider-header">
        <h2 className="section-title">全部分类</h2>
        <Link to="/categories" className="more-link">更多 ›</Link>
      </div>
      <div className="category-slider-container">
        <button className="scroll-btn left" onClick={() => scroll('left')}>‹</button>
        <div className="category-list" ref={scrollRef}>
          {categories.map(cat => (
            <Link key={cat.id} to={`/categories/${cat.slug}`} className="category-card">
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.article_count} 篇</span>
            </Link>
          ))}
        </div>
        <button className="scroll-btn right" onClick={() => scroll('right')}>›</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 CategorySlider.css**

```css
.category-slider {
  margin-bottom: 24px;
}

.category-slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  margin: 0;
}

.more-link {
  color: var(--text-secondary);
  font-size: 14px;
  text-decoration: none;
}

.more-link:hover {
  color: var(--accent-color);
}

.category-slider-container {
  position: relative;
  display: flex;
  align-items: center;
}

.category-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 8px 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.category-list::-webkit-scrollbar {
  display: none;
}

.category-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 80px;
  background: var(--card-bg);
  border-radius: 8px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.category-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.category-count {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--card-bg);
  color: var(--text-primary);
  font-size: 20px;
  cursor: pointer;
  box-shadow: var(--shadow);
}

.scroll-btn.left { left: -16px; }
.scroll-btn.right { right: -16px; }
```

---

## Task 9: 前端 - 重构导航栏 Layout

**Files:**
- Modify: `client/src/components/Layout/Layout.tsx`
- Modify: `client/src/components/Layout/Layout.css`

- [ ] **Step 1: 重构 Layout.tsx 导航菜单部分**

替换现有的 `<nav>` 部分，使用后端配置的 navigation_menus:

```tsx
{settings?.navigation_menus && Object.entries(settings.navigation_menus).map(([key, menu]) => {
  if (!menu.visible) return null;
  const hasChildren = menu.children && menu.children.length > 0;
  return hasChildren ? (
    <div key={key} className="nav-dropdown">
      <span className={`nav-link ${isActive(menu.path || '/') ? 'active' : ''}`}>
        {key}
      </span>
      <div className="nav-dropdown-content">
        {menu.children?.map(child => (
          <Link key={child.name} to={child.path} className="nav-dropdown-item">
            {child.cover && <img src={child.cover} alt="" className="dropdown-cover" />}
            <span>{child.name}</span>
          </Link>
        ))}
      </div>
    </div>
  ) : (
    <Link
      key={key}
      to={menu.path || '/'}
      className={`nav-link ${isActive(menu.path || '/') ? 'active' : ''}`}
    >
      {key}
    </Link>
  );
})}
```

- [ ] **Step 2: 添加导航栏相关 CSS（到 Layout.css）**

```css
.nav-dropdown {
  position: relative;
  display: inline-block;
}

.nav-dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 8px 0;
  z-index: 100;
}

.nav-dropdown:hover .nav-dropdown-content {
  display: block;
}

.nav-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  text-decoration: none;
  color: var(--text-primary);
  transition: background 0.2s;
}

.nav-dropdown-item:hover {
  background: var(--hover-bg);
}

.dropdown-cover {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  object-fit: cover;
}
```

- [ ] **Step 3: 在 Layout.tsx 添加 NotificationBar 和 BannerCarousel**

在 `<main className="main">` 之前添加:

```tsx
import NotificationBar from '../NotificationBar/NotificationBar';
import BannerCarousel from '../BannerCarousel/BannerCarousel';
import CategorySlider from '../CategorySlider/CategorySlider';
// ...existing imports

// 在 header 之后，main 之前添加:
<NotificationBar />
<BannerCarousel />
{categories.length > 0 && <CategorySlider categories={categories} />}
```

并添加 categories state 和 fetch:

```tsx
const [categories, setCategories] = useState<Category[]>([]);

// 在 useEffect 中添加:
api.get('/categories').then(res => setCategories(res.data));
```

- [ ] **Step 4: 调整 Layout 整体结构**

header 保持左中右布局: Logo+标题 | 导航菜单 | 搜索+主题切换

---

## Task 10: 前端 - 产品占位页面

**Files:**
- Create: `client/src/pages/Product/Product.tsx`
- Modify: `client/src/App.tsx`

- [ ] **Step 1: 创建 Product.tsx**

```tsx
import { useParams } from 'react-router-dom';

export default function Product() {
  const { productId } = useParams();

  return (
    <div className="product-page">
      <h1 className="page-title">
        {productId === 'weiguang' ? '微光' : productId === 'shunian' ? '树年' : '产品'}
      </h1>
      <p className="coming-soon">该产品即将上线，敬请期待...</p>
    </div>
  );
}
```

- [ ] **Step 2: 在 App.tsx 添加路由**

```tsx
import Product from './pages/Product/Product';

// 在路由配置中添加:
<Route path="/products/:productId" element={<Product />} />
```

---

## Task 11: 前端 - 文章列表无限滚动

**Files:**
- Modify: `client/src/pages/Home/Home.tsx`
- Modify: `client/src/pages/Home/Home.css`

- [ ] **Step 1: 修改 Home.tsx 实现无限滚动**

```tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import type { Article, Pagination as PaginationType } from '../../types';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import './Home.css';

export default function Home() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || undefined;
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadArticles = useCallback((pageNum: number, searchQuery?: string, reset = false) => {
    if (loading || (!reset && !hasMore)) return;
    setLoading(true);
    api.get('/articles', { params: { page: pageNum, limit: 10, search: searchQuery } })
      .then(res => {
        if (reset) {
          setArticles(res.data.articles);
        } else {
          setArticles(prev => [...prev, ...res.data.articles]);
        }
        setPagination(res.data.pagination);
        setHasMore(pageNum < res.data.pagination.totalPages);
        setPage(pageNum);
      })
      .finally(() => setLoading(false));
  }, [loading, hasMore]);

  useEffect(() => {
    loadArticles(1, search, true);
  }, [search]);

  useEffect(() => {
    if (loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadArticles(page + 1, search);
        }
      }, { threshold: 0.1 });
      observerRef.current.observe(loadMoreRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [page, loading, hasMore, search, loadArticles]);

  return (
    <div className="home">
      <h1 className="page-title">{search ? `搜索结果: "${search}"` : '文章列表'}</h1>
      <div className="article-list">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
        {articles.length === 0 && <p className="empty">暂无文章</p>}
      </div>
      <div ref={loadMoreRef} className="load-more">
        {loading && <div className="loading">加载中...</div>}
        {!hasMore && articles.length > 0 && <div className="no-more">没有更多文章了</div>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 添加 Home.css 样式**

```css
.load-more {
  padding: 20px;
  text-align: center;
}

.loading {
  color: var(--text-secondary);
}

.no-more {
  color: var(--text-secondary);
  font-size: 14px;
}
```

---

## Task 12: 前端 - 全局样式变量检查

**Files:**
- Modify: `client/src/styles/global.css`

- [ ] **Step 1: 确保 CSS 变量存在**

检查并确保以下变量存在（已有则跳过）:

```css
:root {
  --bg-color: #fdfdfd;
  --text-primary: #1a1a1a;
  --text-secondary: #666;
  --accent-color: #2563eb;
  --card-bg: #fff;
  --border-color: #e5e5e5;
  --hover-bg: #f5f5f5;
  --shadow: 0 2px 8px rgba(0,0,0,0.1);
}

[data-theme='dark'] {
  --bg-color: #0a192f;
  --text-primary: #e6f1ff;
  --text-secondary: #8892b0;
  --accent-color: #64ffda;
  --card-bg: #112240;
  --border-color: #233554;
  --hover-bg: #1d3557;
  --shadow: 0 2px 8px rgba(0,0,0,0.3);
}
```

---

## 执行方式

**Plan complete and saved to `docs/superpowers/plans/2026-05-04-blog-homepage-redesign.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
