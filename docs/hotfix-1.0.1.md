# Hotfix v1.0.1

## 问题修复

### 1. 文章详情页代码块样式优化

**问题**: 代码块样式简陋，缺少 Mac 风格窗口装饰

**解决方案**: 
- 添加 Mac 风格窗口头部（三色圆点按钮）
- 添加代码语言标签显示
- 添加复制按钮（使用内联 onclick 处理）

**文件**: `client/src/pages/ArticleDetail/ArticleDetail.tsx`, `client/src/pages/ArticleDetail/ArticleDetail.css`

---

### 2. 文章详情页元信息布局

**问题**: 标题下的时间、分类、标签分散在多行

**错误原因**: 分类和标签使用了单独的 div 容器，未与时间在同一行显示

**解决方案**: 
- 将时间、分类、标签都放入同一个 `.article-meta` 容器
- 标签使用 flex 布局保持一行显示
- 样式与文章列表页面（ArticleCard）保持一致

**文件**: `client/src/pages/ArticleDetail/ArticleDetail.tsx`, `client/src/pages/ArticleDetail/ArticleDetail.css`

---

## 新增功能

### 1. 文章搜索功能

**功能描述**: 在导航栏添加搜索框，支持按标题、内容、摘要搜索文章

**实现**:
- 后端 API 支持 `search` 查询参数
- 前端 Layout 添加搜索表单
- 首页 Home 读取 search 参数并调用 API

**文件**:
- `server/src/routes/articles.ts` - 添加 search 参数支持
- `client/src/components/Layout/Layout.tsx` - 添加搜索框
- `client/src/components/Layout/Layout.css` - 搜索框样式
- `client/src/pages/Home/Home.tsx` - 搜索参数处理

---

### 2. SEO 优化

**功能描述**: 增强页面 SEO，支持动态 meta 标签

**实现**:
- index.html 添加 description 和 og:title meta 标签
- ArticleDetail 页面加载后更新 document.title 和 meta description
- 从 settings API 动态获取 blogDescription

**文件**:
- `client/index.html` - 添加 SEO meta 标签
- `client/src/pages/ArticleDetail/ArticleDetail.tsx` - 动态更新 title 和 meta

---

### 3. 测试用例扩展

**新增测试用例**:
- `GET /api/articles with search query` - 验证搜索功能
- `GET /api/articles with search query returns empty for no match` - 验证无结果情况

**文件**: `server/src/__tests__/api.test.ts`

---

## 测试结果

```
Tests: 35 passed (35)
```

---

## 版本记录

- v1.0.0: 初始版本，包含基础博客功能和管理后台
- v1.0.1: 代码块样式优化、元信息布局统一、搜索功能、SEO 优化
