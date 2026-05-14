# SEO/AIO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add SEO meta tags, JSON-LD structured data, sitemap.xml, and RSS feed for better search engine and AI model discoverability.

**Architecture:** Backend generates sitemap.xml and rss.xml dynamically. Frontend adds SEOHead component for dynamic meta tags and JSON-LD on article pages.

**Tech Stack:** React, Express, PostgreSQL

---

## File Structure

### Backend
- Modify: `server/src/db/schema.pg.sql` - add cover_image column
- Modify: `server/src/routes/articles.ts` - include cover_image in query
- Create: `server/src/routes/sitemap.ts` - sitemap.xml route
- Create: `server/src/routes/rss.ts` - rss.xml route
- Modify: `server/src/index.ts` - register new routes

### Frontend
- Create: `client/src/components/SEOHead/SEOHead.tsx` - SEO meta tags component
- Modify: `client/src/pages/ArticleDetail/ArticleDetail.tsx` - add JSON-LD and og:image
- Modify: `client/index.html` - add default og tags
- Create: `client/public/robots.txt` - robots.txt file

---

## Task 1: Database Schema - Add cover_image Column

**Files:**
- Modify: `server/src/db/schema.pg.sql`

- [ ] **Step 1: Add cover_image column to articles table**

Find the articles table and add after excerpt column:

```sql
excerpt TEXT,
cover_image TEXT,
status TEXT DEFAULT 'draft'
```

- [ ] **Step 2: Commit**

```bash
git add server/src/db/schema.pg.sql
git commit -m "feat: add cover_image column to articles table for SEO"
```

---

## Task 2: Backend - Add cover_image to Article Query

**Files:**
- Modify: `server/src/routes/articles.ts`

- [ ] **Step 1: Add cover_image to SELECT queries**

In both the list query (line 15) and detail query (line 75), add `cover_image` to the SELECT:

List query:
```sql
SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug, a.view_count, a.cover_image
```

Detail query:
```sql
SELECT a.*, c.name as category_name, c.slug as category_slug, a.cover_image
```

- [ ] **Step 2: Commit**

```bash
git add server/src/routes/articles.ts
git commit -m "feat: include cover_image in article queries"
```

---

## Task 3: Backend - Create Sitemap Route

**Files:**
- Create: `server/src/routes/sitemap.ts`

- [ ] **Step 1: Create sitemap.xml route**

```typescript
import { Router } from 'express';
import { sql } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://yourblog.com';

  const articles = await sql`
    SELECT slug, created_at, updated_at FROM articles WHERE status = 'published' ORDER BY created_at DESC
  `;

  const categories = await sql`
    SELECT slug FROM categories
  `;

  const tags = await sql`
    SELECT name FROM tags
  `;

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/archive', changefreq: 'weekly', priority: '0.8' },
    { url: '/about', changefreq: 'monthly', priority: '0.5' },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static pages
  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Categories
  for (const cat of categories) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/category/${cat.slug}</loc>\n`;
    xml += `    <changefreq>${'weekly'}</changefreq>\n`;
    xml += `    <priority>${'0.7'}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Tags
  for (const tag of tags) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/tag/${encodeURIComponent(tag.name)}</loc>\n`;
    xml += `    <changefreq>${'weekly'}</changefreq>\n`;
    xml += `    <priority>${'0.6'}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Articles
  for (const article of articles) {
    const lastmod = article.updated_at ? new Date(article.updated_at).toISOString().split('T')[0] : new Date(article.created_at).toISOString().split('T')[0];
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/article/${article.slug}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${'monthly'}</changefreq>\n`;
    xml += `    <priority>${'0.9'}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += '</urlset>';

  res.set('Content-Type', 'text/xml');
  res.send(xml);
});

export default router;
```

- [ ] **Step 2: Register sitemap route in index.ts**

Add to `server/src/index.ts`:

```typescript
import sitemap from './routes/sitemap';
app.use('/sitemap.xml', sitemap);
```

- [ ] **Step 3: Commit**

```bash
git add server/src/routes/sitemap.ts server/src/index.ts
git commit -m "feat: add sitemap.xml generation route"
```

---

## Task 4: Backend - Create RSS Feed Route

**Files:**
- Create: `server/src/routes/rss.ts`

- [ ] **Step 1: Create rss.xml route**

```typescript
import { Router } from 'express';
import { sql } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://yourblog.com';
  const blogTitle = process.env.BLOG_TITLE || 'My Blog';

  const articles = await sql`
    SELECT a.title, a.slug, a.excerpt, a.content, a.created_at, c.name as category_name
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.status = 'published'
    ORDER BY a.created_at DESC
    LIMIT 20
  `;

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  xml += '  <channel>\n';
  xml += `    <title>${escapeXml(blogTitle)}</title>\n`;
  xml += `    <link>${baseUrl}</link>\n`;
  xml += `    <description>${escapeXml(blogTitle)} RSS Feed</description>\n`;
  xml += `    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>\n`;
  xml += `    <language>zh-CN</language>\n`;

  for (const article of articles) {
    const description = article.excerpt || article.content?.substring(0, 200) || '';
    const pubDate = new Date(article.created_at).toUTCString();
    xml += '    <item>\n';
    xml += `      <title>${escapeXml(article.title)}</title>\n`;
    xml += `      <link>${baseUrl}/article/${article.slug}</link>\n`;
    xml += `      <guid isPermaLink="true">${baseUrl}/article/${article.slug}</guid>\n`;
    xml += `      <pubDate>${pubDate}</pubDate>\n`;
    xml += `      <description>${escapeXml(description)}</description>\n`;
    if (article.category_name) {
      xml += `      <category>${escapeXml(article.category_name)}</category>\n`;
    }
    xml += '    </item>\n';
  }

  xml += '  </channel>\n';
  xml += '</rss>';

  res.set('Content-Type', 'application/rss+xml');
  res.send(xml);
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default router;
```

- [ ] **Step 2: Register RSS route in index.ts**

Add to `server/src/index.ts`:

```typescript
import rss from './routes/rss';
app.use('/rss.xml', rss);
```

- [ ] **Step 3: Commit**

```bash
git add server/src/routes/rss.ts server/src/index.ts
git commit -m "feat: add RSS feed generation route"
```

---

## Task 5: Frontend - Create SEOHead Component

**Files:**
- Create: `client/src/components/SEOHead/SEOHead.tsx`

- [ ] **Step 1: Create SEOHead component**

```tsx
import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
}: SEOHeadProps) {
  const siteName = '我的博客';
  const defaultDescription = '个人博客';
  const defaultImage = '/images/logo.svg';

  useEffect(() => {
    if (title) {
      document.title = `${title} - ${siteName}`;
    }
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    }

    // Open Graph
    if (ogTitle) {
      updateOrCreateMeta('property', 'og:title', ogTitle);
    }
    if (ogDescription) {
      updateOrCreateMeta('property', 'og:description', ogDescription || description || defaultDescription);
    }
    if (ogImage) {
      updateOrCreateMeta('property', 'og:image', ogImage);
    }
    updateOrCreateMeta('property', 'og:type', ogType);
    updateOrCreateMeta('property', 'og:site_name', siteName);

    // Twitter Card
    updateOrCreateMeta('name', 'twitter:card', twitterCard);
    if (ogTitle) {
      updateOrCreateMeta('name', 'twitter:title', ogTitle);
    }
    if (ogDescription) {
      updateOrCreateMeta('name', 'twitter:description', ogDescription || description || defaultDescription);
    }
    if (ogImage) {
      updateOrCreateMeta('name', 'twitter:image', ogImage);
    }
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, twitterCard]);

  return null;
}

function updateOrCreateMeta(attr: 'name' | 'property', key: string, value: string) {
  let meta = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.content = value;
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/SEOHead/SEOHead.tsx
git commit -m "feat: create SEOHead component for dynamic meta tags"
```

---

## Task 6: Frontend - Update ArticleDetail with JSON-LD and og:image

**Files:**
- Modify: `client/src/pages/ArticleDetail/ArticleDetail.tsx`

- [ ] **Step 1: Add JSON-LD script and og:image support**

Import SEOHead at the top:
```tsx
import SEOHead from '../../components/SEOHead/SEOHead';
```

Add SEOHead component before the article element:
```tsx
<SEOHead
  title={article.title}
  description={article.excerpt || article.content?.substring(0, 200)}
  ogType="article"
  ogImage={article.cover_image || undefined}
/>

{/* Add JSON-LD */}
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.excerpt || article.content?.substring(0, 200),
  "datePublished": article.created_at,
  "dateModified": article.updated_at,
  "author": {
    "@type": "Person",
    "name": "博主"
  },
  "image": article.cover_image,
  "url": window.location.href
})}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/ArticleDetail/ArticleDetail.tsx
git commit -m "feat: add JSON-LD structured data and og:image to article pages"
```

---

## Task 7: Frontend - Update index.html with Default OG Tags

**Files:**
- Modify: `client/index.html`

- [ ] **Step 1: Add more complete OG tags**

Add after existing og tags:
```html
<meta property="og:site_name" content="我的博客" />
<meta property="og:locale" content="zh_CN" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="robots" content="index, follow" />
```

Also add robots.txt reference:
```html
<link rel="robots" href="/robots.txt" />
```

- [ ] **Step 2: Commit**

```bash
git add client/index.html
git commit -m "feat: add default og tags and twitter card to index.html"
```

---

## Task 8: Frontend - Create robots.txt

**Files:**
- Create: `client/public/robots.txt`

- [ ] **Step 1: Create robots.txt**

```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://yourblog.com/sitemap.xml
```

Replace `yourblog.com` with actual domain.

- [ ] **Step 2: Commit**

```bash
git add client/public/robots.txt
git commit -m "feat: add robots.txt for search engines"
```

---

## Verification

1. Visit `/sitemap.xml` and verify it generates correctly
2. Visit `/rss.xml` and verify it generates correctly
3. Visit an article page and check page source for:
   - `<link rel="canonical">` tag
   - `og:image` meta tag
   - JSON-LD `<script type="application/ld+json">` with Article schema
4. Test with Google Rich Results Test or Schema.org validator
5. Test social share preview on Twitter Card validator