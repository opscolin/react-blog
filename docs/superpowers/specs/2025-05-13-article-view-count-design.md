# Article View Count Feature - Design

## Overview

Add a view count feature to each article with anti-spam protection (same IP, same article, 5-minute window).

## Database Schema

### New Table: article_views

```sql
CREATE TABLE article_views (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id),
  ip VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_article_views_article_ip_time ON article_views(article_id, ip, created_at);
CREATE INDEX idx_article_views_expire ON article_views(created_at);
```

### articles Table Update

Add `view_count` column to `articles` table (default 0).

## Backend Changes

### GET /articles/:slug

1. Get client IP from request headers (X-Forwarded-For or req.ip)
2. Check if `article_views` has record: same article_id, same IP, created_at within 5 minutes
3. If no record: insert view record + increment `articles.view_count`
4. Return article with `view_count` field

### GET /articles (list)

Return articles with `view_count` field included.

## Frontend Changes

### Types

`Article` interface adds `view_count: number` field.

### ArticleCard Component

Display view count next to date.

### ArticleDetail Component

On mount, trigger view count increment (implicit via API call).

## Data Cleanup

Daily cleanup job to delete `article_views` records older than 24 hours.