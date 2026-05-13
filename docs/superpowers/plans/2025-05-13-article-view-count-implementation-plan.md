# Article View Count Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add view count to articles with anti-spam protection (same IP, same article, 5-minute window).

**Architecture:** Store each article view in `article_views` table for deduplication. Increment `articles.view_count` only when a new view is recorded (no existing record for same article+IP within 5 minutes).

**Tech Stack:** Node.js/Express backend, React frontend, PostgreSQL database.

---

## File Structure

### Backend
- Modify: `server/src/db/schema.pg.sql` - Add view_count column and article_views table
- Modify: `server/src/routes/articles.ts` - Add view count logic and return field
- Modify: `client/src/types/index.ts` - Add view_count to Article interface
- Modify: `client/src/components/ArticleCard/ArticleCard.tsx` - Display view count
- Modify: `client/src/pages/ArticleDetail/ArticleDetail.tsx` - Display view count

---

## Task 1: Database Schema Update

**Files:**
- Modify: `server/src/db/schema.pg.sql`

- [ ] **Step 1: Add view_count column and article_views table**

Find the `articles` table creation and add `view_count` column, then add the new `article_views` table after it.

```sql
-- Add to articles table creation (add after status column):
view_count INTEGER DEFAULT 0,

-- Add after articles table creation:
CREATE TABLE article_views (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id),
  ip VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_article_views_article_ip_time ON article_views(article_id, ip, created_at);
CREATE INDEX idx_article_views_expire ON article_views(created_at);
```

- [ ] **Step 2: Commit**

```bash
git add server/src/db/schema.pg.sql
git commit -m "feat: add view_count column and article_views table for anti-spam tracking"
```

---

## Task 2: Backend API Changes - GET /articles/:slug

**Files:**
- Modify: `server/src/routes/articles.ts:73-99`

- [ ] **Step 1: Add IP extraction helper and view count logic**

After imports, add helper function to get client IP:

```typescript
function getClientIP(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || '127.0.0.1';
}
```

- [ ] **Step 2: Modify the GET /:slug endpoint to include view counting**

In the `router.get('/:slug', ...)` handler, after fetching the article and before returning:

```typescript
const clientIP = getClientIP(req);

// Check if we should count this view
const recentView = await sql`
  SELECT id FROM article_views
  WHERE article_id = ${article.id}
    AND ip = ${clientIP}
    AND created_at > NOW() - INTERVAL '5 minutes'
`;

// Only increment if no recent view exists
if (recentView.length === 0) {
  // Record the view
  await sql`
    INSERT INTO article_views (article_id, ip) VALUES (${article.id}, ${clientIP})
  `;
  // Increment view count
  await sql`
    UPDATE articles SET view_count = view_count + 1 WHERE id = ${article.id}
  `;
  // Update the returned article's view_count
  article.view_count = (article.view_count || 0) + 1;
}
```

- [ ] **Step 3: Commit**

```bash
git add server/src/routes/articles.ts
git commit -m "feat: add view count tracking with IP-based deduplication"
```

---

## Task 3: Backend API Changes - GET /articles (list)

**Files:**
- Modify: `server/src/routes/articles.ts:6-71`

- [ ] **Step 1: Update list query to include view_count**

In the `router.get('/', ...)` handler, modify the SELECT query to include `view_count`:

```sql
SELECT DISTINCT a.*, c.name as category_name, c.slug as category_slug, a.view_count
```

- [ ] **Step 2: Commit**

```bash
git add server/src/routes/articles.ts
git commit -m "feat: include view_count in articles list response"
```

---

## Task 4: Frontend Type Update

**Files:**
- Modify: `client/src/types/index.ts:21-32`

- [ ] **Step 1: Add view_count to Article interface**

```typescript
export interface Article {
  // ... existing fields
  view_count: number;
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/types/index.ts
git commit -m "feat: add view_count to Article type"
```

---

## Task 5: ArticleCard Component - Display View Count

**Files:**
- Modify: `client/src/components/ArticleCard/ArticleCard.tsx:17-22`

- [ ] **Step 1: Add view count display after date**

```tsx
<span className="article-card-date">
  {dayjs(article.created_at).format('YYYY-MM-DD')}
</span>
<span className="article-card-views">
  <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
  {article.view_count || 0}
</span>
```

- [ ] **Step 2: Add CSS to ArticleCard.css**

Add a style for `.article-card-views` that matches `.article-card-date`.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/ArticleCard/ArticleCard.tsx client/src/components/ArticleCard/ArticleCard.css
git commit -m "feat: display view count in ArticleCard"
```

---

## Task 6: ArticleDetail Component - Display View Count

**Files:**
- Modify: `client/src/pages/ArticleDetail/ArticleDetail.tsx:106-109`

- [ ] **Step 1: Add view count to article-meta section**

Add after the date span:

```tsx
<span className="article-views">
  <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
  {article.view_count || 0} 次阅读
</span>
```

- [ ] **Step 2: Add CSS to ArticleDetail.css**

Add a style for `.article-views` that matches other meta items.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/ArticleDetail/ArticleDetail.tsx client/src/pages/ArticleDetail/ArticleDetail.css
git commit -m "feat: display view count in ArticleDetail"
```

---

## Verification

1. Run the server and client
2. Visit an article - verify view_count increments on first visit
3. Refresh within 5 minutes - verify view_count does NOT increment again
4. Visit a different article - verify its view_count DOES increment
5. Wait 5 minutes - verify the original article's view_count can increment again
6. Check article list - verify view_count displays correctly