# Personal Blog - feature-simple-0506

## 架构概览

```
blog/
├── client/                 # React 前端 (Vite)
│   └── src/
│       ├── components/     # 通用组件
│       ├── pages/          # 页面 (Home, ArticleDetail, Category, Tag, Archive, About, admin)
│       ├── store/          # Zustand 状态
│       └── api/            # Axios API 封装
├── server/                 # Express 后端
│   └── src/
│       ├── db/            # PostgreSQL 数据库
│       ├── middleware/     # 认证中间件
│       └── routes/        # API 路由
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + TypeScript + React Router 6 + Zustand + Axios |
| Backend | Express.js + PostgreSQL + JWT |
| Database | PostgreSQL |

## 最近更新 (feature-simple-0506)

### 1. 文章阅读量统计

- **数据库**: `articles` 表新增 `view_count` 字段，`article_views` 表记录每次访问
- **防刷机制**: 同一 IP 访问同一文章，5 分钟内只计一次
- **API**: `/articles/:slug` 返回 `view_count`
- **前端**: 列表页和详情页显示阅读数

### 2. SEO/AIO 优化

- **Sitemap**: `/sitemap.xml` 动态生成，包含所有已发布文章、分类、标签
- **RSS Feed**: `/rss.xml` 生成 RSS 2.0 订阅源
- **JSON-LD**: 文章详情页添加 Schema.org Article 结构化数据
- **Open Graph**: og:title, og:description, og:image, og:type, og:site_name
- **Twitter Card**: twitter:card, twitter:title, twitter:description, twitter:image
- **Canonical URL**: 每页添加 canonical link
- **robots.txt**: 搜索引擎爬虫指引

## 数据库变更

### 新增表

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

### 新增字段

```sql
ALTER TABLE articles ADD COLUMN view_count INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN cover_image TEXT;
```

## 环境变量

### Server (.env)

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
BASE_URL=https://yourblog.com
BLOG_TITLE=我的博客
NODE_ENV=production
```

## API 路由

| Method | Path | 说明 |
|--------|------|------|
| GET | /api/articles | 文章列表 |
| GET | /api/articles/:slug | 文章详情（含阅读量统计） |
| GET | /api/categories | 分类列表 |
| GET | /api/tags | 标签列表 |
| GET | /api/archive | 归档 |
| GET | /api/settings | 博客设置 |
| GET | /sitemap.xml | Sitemap |
| GET | /rss.xml | RSS Feed |

## 服务管理 (systemd)

```bash
# 服务文件 /etc/systemd/system/blog-server.service
[Unit]
Description=Blog Server
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/data/project/react-blog/server
Environment=NODE_ENV=production
Environment=DATABASE_URL=postgresql://user:password@host:5432/dbname
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target

# 管理命令
systemctl daemon-reload
systemctl enable blog-server
systemctl start blog-server
systemctl restart blog-server
systemctl status blog-server
```

## 部署步骤

1. 数据库执行迁移 SQL
2. 配置环境变量
3. 构建前端: `cd client && npm run build`
4. 构建后端: `cd server && npm run build`
5. 重启服务: `systemctl restart blog-server`