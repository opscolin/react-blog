# SEO/AIO Optimization Design

## Overview

Enhance blog for both traditional SEO (search engines) and AIO (AI Optimization) so browsers and AI models can better discover and understand article content.

## Current State

- Basic title/description/og:title in index.html
- Article pages dynamically set title and meta description
- Missing: JSON-LD, canonical URLs, og:image, twitter cards, sitemap, RSS

## Design

### 1. Traditional SEO Enhancements

#### Canonical URL
- Add `<link rel="canonical">` to all pages
- Article detail: canonical = full article URL
- List pages: canonical = base page URL

#### Open Graph Tags
All pages:
- `og:site_name` = blog title
- `og:type` = `website` (list) or `article` (detail)

Article detail:
- `og:title` = article title
- `og:description` = article excerpt or content snippet
- `og:image` = article cover image (need to add field) or default blog logo
- `og:url` = canonical article URL

#### Twitter Card
- `twitter:card` = `summary_large_image`
- `twitter:title` = article title
- `twitter:description` = article excerpt
- `twitter:image` = article cover image

#### Robots
- Add `robots.txt` at root
- Add meta robots tag on pages

### 2. AI-Friendly Optimizations (AIO)

#### JSON-LD Article Schema
On article detail pages, add structured data:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article excerpt or first 200 chars",
  "datePublished": "ISO 8601 creation date",
  "dateModified": "ISO 8601 update date",
  "author": {
    "@type": "Person",
    "name": "Blog author name"
  },
  "image": "cover image URL",
  "url": "canonical article URL"
}
```

#### Sitemap
- Generate `/sitemap.xml` with all published articles
- Include: loc, lastmod, changefreq, priority
- Update dynamically when articles change

#### RSS Feed
- Generate `/rss.xml` with recent articles
- Include: title, link, description, pubDate, author

#### Semantic HTML
- Ensure proper heading hierarchy (single h1 per page)
- Use `<article>`, `<header>`, `<footer>`, `<nav>` semantic tags

### 3. Article Cover Image

Add `cover_image` field to articles table (optional, defaults to blog logo).

### 4. Implementation Approach

Backend:
- New route: `GET /sitemap.xml`
- New route: `GET /rss.xml`
- Modify article schema to include `cover_image`

Frontend:
- Create SEOHead component for dynamic meta tags
- Update ArticleDetail to include JSON-LD
- Add canonical URL to all pages

## Files to Modify

### Backend
- `server/src/db/schema.pg.sql` - add cover_image column
- `server/src/routes/articles.ts` - include cover_image in query
- `server/src/routes/sitemap.ts` - new file for sitemap.xml
- `server/src/routes/rss.ts` - new file for rss.xml
- `server/src/index.ts` - register new routes

### Frontend
- `client/src/components/SEOHead/SEOHead.tsx` - new component
- `client/src/pages/ArticleDetail/ArticleDetail.tsx` - add JSON-LD and og:image
- `client/index.html` - add default og tags
- `client/public/robots.txt` - new file

## Verification

1. Test article page with Google Rich Results Test
2. Test JSON-LD with Schema.org validator
3. Verify social share preview on Facebook Debugger
4. Check sitemap is accessible at /sitemap.xml