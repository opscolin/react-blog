# Personal Blog System

基于 React + Express + SQLite 的前后端分离个人博客系统，支持文章管理、分类标签、归档、暗色模式和响应式布局。

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + TypeScript + React Router 6 + Zustand + Axios |
| Backend | Express.js + PostgreSQL / SQLite + JWT + bcrypt |
| Database | PostgreSQL (生产) / SQLite3 (开发) |

## 核心架构

```
blog/
├── client/                 # 前端 React 应用
│   └── src/
│       ├── api/           # API 请求封装
│       ├── components/    # 通用组件 (Layout, ArticleCard, CategoryScroll, SEOHead, Timeline, Modal, Pagination, ThemeToggle)
│       ├── pages/         # 页面组件
│       │   ├── Home/      # 首页 - 文章列表
│       │   ├── ArticleDetail/  # 文章详情
│       │   ├── Category/  # 分类页
│       │   ├── Tag/       # 标签页
│       │   ├── Archive/   # 归档页
│       │   ├── Diary/      # AI 日记 (AI 分析、时间线/列表视图)
│       │   ├── About/      # 关于页
│       │   └── admin/     # 管理后台
│       │       ├── Login/         # 登录页
│       │       ├── Dashboard/     # 管理面板
│       │       ├── ArticleList/   # 文章管理
│       │       ├── ArticleEdit/   # 文章编辑
│       │       ├── CategoryManage/ # 分类管理
│       │       ├── TagManage/     # 标签管理
│       │       ├── Settings/      # 博客设置
│       │       └── DiaryManage/    # 日记管理 (CRUD + AI 分析)
│       ├── store/         # Zustand 状态管理 (auth, theme)
│       └── styles/        # 全局样式
├── server/                # 后端 Express 应用
│   └── src/
│       ├── db/           # 数据库初始化和 schema
│       ├── middleware/   # 认证中间件
│       └── routes/       # API 路由
│           ├── auth.ts           # 认证
│           ├── articles.ts       # 文章
│           ├── categories.ts     # 分类
│           ├── tags.ts          # 标签
│           ├── archives.ts      # 归档
│           ├── settings.ts      # 设置
│           ├── diaries.ts       # AI 日记 (公开)
│           ├── ai-analysis.ts   # AI 分析
│           ├── rss.ts           # RSS Feed
│           ├── sitemap.ts       # Sitemap
│           └── admin/          # 管理 API
│               ├── articles.ts
│               ├── categories.ts
│               ├── tags.ts
│               ├── diaries.ts       # 日记管理
│               ├── ai-config.ts     # AI 配置
│               └── settings.ts
└── data/                  # SQLite 数据库文件
```

## 实现逻辑

### 前端架构
- **状态管理**: Zustand - auth store (token/username), theme store (暗色/亮色)
- **路由**: React Router 6 - 公开页面 (`/`) 和管理后台 (`/admin`) 分离
- **主题切换**: 使用 CSS 变量，支持暗色/亮色模式切换
- **Markdown 渲染**: marked + highlight.js

### 后端架构
- **认证**: JWT (7天过期) + bcrypt 密码加密
- **API 设计**: RESTful 风格，公开 API 和管理 API 分离
- **数据库**: better-sqlite3，同步 API，性能优异

### 数据模型
- **users**: 管理员账户
- **categories**: 分类 (name, slug)
- **tags**: 标签 (name)
- **articles**: 文章 (title, slug, content, excerpt, category_id, status)
- **article_tags**: 文章-标签关联表
- **settings**: 博客设置 (blogTitle, blogLogo, paginationSize, menuVisibility, aboutContent)
- **diaries**: AI 日记 (date, content, summary, mood, tags, ai_generated, key_points, action_items)
- **article_views**: 文章阅读量统计 (article_id, ip, created_at)

## 功能介绍

### 公开页面
| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | `/` | 分页展示已发布文章 |
| 文章详情 | `/article/:slug` | Markdown 渲染、代码高亮、分类标签 |
| 分类页 | `/category/:slug` | 按分类筛选文章 |
| 标签页 | `/tag/:slug` | 按标签筛选文章 |
| 归档页 | `/archive` `/archive/:year/:month` | 按年月归档展示 |
| 关于页 | `/about` | 静态内容 |
| AI 日记 | `/diary` | AI 分析日记、时间线/列表双视图、模态预览 |

### 管理后台
| 页面 | 路径 | 功能 |
|------|------|------|
| 登录 | `/admin` | JWT 认证登录 |
| 文章管理 | `/admin/dashboard/articles` | 文章列表、CRUD |
| 分类管理 | `/admin/dashboard/categories` | 分类 CRUD |
| 标签管理 | `/admin/dashboard/tags` | 标签 CRUD |
| 设置 | `/admin/dashboard/settings` | 博客标题、Logo、菜单显示/隐藏 |
| 日记管理 | `/admin/dashboard/diaries` | 日记 CRUD、AI 分析、批量操作 |

### 功能特性
- 暗色/亮色模式切换
- 响应式布局 (PC 双栏 / 移动端单栏)
- Markdown 文章渲染 + 语法高亮
- 文章别名 (slug) 生成
- 分页支持
- 菜单项显示控制
- AI 日记: 时间线/列表双视图、AI 自动分析情绪/关键点/行动项、模态预览
- 分类滚动导航 (CategoryScroll)
- SEO 优化: Sitemap、RSS Feed、JSON-LD、Open Graph、Twitter Card
- 文章阅读量统计 (IP 防刷)

## 部署安装

### 环境要求
- Node.js 18+

### 1. 安装依赖

```bash
# 安装前端依赖
cd client && npm install

# 安装后端依赖
cd server && npm install
```

### 2. 初始化数据库

```bash
cd server
npm run init-admin
```

> 初始化管理员账户后，默认账号: `admin` / 密码: `admin123`

### 3. 启动开发服务器

```bash
# 终端1: 启动后端 (端口 3001)
cd server && npm run dev

# 终端2: 启动前端 (端口 3000)
cd client && npm run dev
```

访问 `http://localhost:3000` 进入博客，`http://localhost:3000/admin` 进入管理后台。

### 4. 生产构建

```bash
# 前端构建
cd client && npm run build

# 后端编译
cd server && npm run build
```

## API 接口

### 公开 API
| Method | Endpoint | 描述 |
|--------|----------|------|
| GET | `/api/articles` | 获取已发布文章列表 (分页) |
| GET | `/api/articles/:slug` | 获取单篇文章 |
| GET | `/api/categories` | 获取分类列表 |
| GET | `/api/tags` | 获取标签列表 |
| GET | `/api/archives` | 获取归档列表 |
| GET | `/api/settings` | 获取博客设置 |
| GET | `/api/health` | 健康检查 |
| GET | `/api/diaries` | 获取日记列表 (分页) |
| GET | `/api/diaries/:id` | 获取单篇日记 |
| POST | `/api/diaries/:id/reanalyze` | 重新 AI 分析日记 |

### 管理 API (需 JWT)
| Method | Endpoint | 描述 |
|--------|----------|------|
| POST | `/api/auth/login` | 登录 |
| GET | `/api/admin/articles` | 文章列表 |
| POST | `/api/admin/articles` | 创建文章 |
| PUT | `/api/admin/articles/:id` | 更新文章 |
| DELETE | `/api/admin/articles/:id` | 删除文章 |
| GET/POST/PUT/DELETE | `/api/admin/categories` | 分类管理 |
| GET/POST/PUT/DELETE | `/api/admin/tags` | 标签管理 |
| GET/PUT | `/api/admin/settings` | 设置管理 |
| GET/POST/PUT/DELETE | `/api/admin/diaries` | 日记管理 |
| POST | `/api/admin/diaries/:id/reanalyze` | AI 重新分析 |
| GET/PUT | `/api/admin/ai-config` | AI 配置管理 |

## 注意事项

1. **安全**: 生产环境请修改默认管理员密码 (`npm run init-admin` 可重新设置)
2. **CORS**: 当前配置允许所有来源 (开发模式)，生产环境请在 `server/src/index.ts` 限制
3. **数据库**: SQLite 文件位于 `server/data/blog.db`，首次启动自动创建
4. **主题**: 暗色模式使用深蓝色背景 (#0a192f) + 青色强调色 (#64ffda)
5. **API 代理**: 开发模式下 Vite 代理 `/api` 请求到后端

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 2.0.1 | 2026-05-26 | 新增 AI 日记功能 (时间线/列表双视图、AI 情绪分析、关键点/行动项提取、模态预览、管理后台 CRUD) |
| 2.0.0 | 2026-05-18 | PostgreSQL 迁移支持、SEO/AIO 优化 (Sitemap/RSS/JSON-LD/OG)、文章阅读量统计、分类滚动导航 |
| 1.0.1 | 2025-05-12 | 修复后台空白页面 |
| 1.0.0 | 2025-05-10 | 初始版本 |
