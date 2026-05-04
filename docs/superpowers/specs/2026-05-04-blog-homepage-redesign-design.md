# 博客主页重构设计方案

## 概述

基于参考博客 https://blog.lusyoe.com/ 的设计，对当前博客主页进行重构，新增导航栏、通知栏、轮播广告位、分类滑动展示等模块，同时将文章列表分页改为无限滚动。

**主题色彩**：保持现有的暗色/亮色主题不变。

---

## 1. 导航栏

### 布局结构
- **左**：Logo + 博客名称
- **中**：菜单
- **右**：搜索图标 + 主题切换

### 菜单结构
| 一级菜单 | 下拉内容 |
|---------|---------|
| 首页 | - |
| 文章 | 归档、分类、标签 |
| 产品 | 微光、树年 |
| 我的 | - |
| 友链 | - |
| 关于 | - |

### 数据来源
- **后端配置驱动**：`settings` 表 `navigation_menus` JSON 字段
- **菜单结构示例**：
```json
{
  "首页": { "path": "/", "visible": true },
  "文章": {
    "path": null,
    "visible": true,
    "children": [
      { "name": "归档", "path": "/archives" },
      { "name": "分类", "path": "/categories" },
      { "name": "标签", "path": "/tags" }
    ]
  },
  "产品": {
    "path": null,
    "visible": true,
    "children": [
      { "name": "微光", "path": "/products/weiguang", "cover": "https://..." },
      { "name": "树年", "path": "/products/shunian", "cover": "https://..." }
    ]
  },
  "我的": { "path": "/about", "visible": true },
  "友链": { "path": "/links", "visible": true },
  "关于": { "path": "/about", "visible": true }
}
```
- **显示控制**：`settings.menuVisibility` 控制各菜单项的显示/隐藏（已有的现有逻辑扩展）

### 产品占位路由
- `/products/weiguang` - 微光（简单占位页面）
- `/products/shunian` - 树年（简单占位页面）

---

## 2. 通知栏

### 功能
- 展示随机金句
- 位置：导航栏下方

### 接口
```
GET /api/quotes/random
```

**响应**：
```json
{
  "id": 1,
  "content": "人生若只如初见，何事秋风悲画扇。"
}
```

### 缓存策略
- **Redis 缓存可开关**：通过 `settings.enable_quote_cache` 控制
- 开启时：优先从 Redis 缓存获取，缓存 key 为 `quote:random`
- 关闭时：直接查询数据库

### 数据模型
**quotes 表**：
| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL PRIMARY KEY | 主键 |
| content | TEXT NOT NULL | 金句内容 |
| created_at | TIMESTAMP | 创建时间 |

---

## 3. 轮播广告位

### 数据来源
- 分类 `is_banner=true` 且 `cover` 不为空

### 接口
```
GET /api/categories/banner
```

**响应**：
```json
{
  "data": [
    {
      "id": 1,
      "name": "AI",
      "slug": "ai",
      "cover": "https://cdn.example.com/ai-cover.jpg",
      "article": {
        "id": 101,
        "title": "AI 漫剧创作指南",
        "slug": "ai-manga-drama-guide",
        "description": "如何用AI创作漫剧..."
      }
    }
  ]
}
```

### 前端交互
- 自动轮播（每 5 秒切换）
- 支持手动左右切换
- 点击整个 Banner 区域跳转 `/categories/ai`

### 数据模型变更
**categories 表新增字段**：
| 字段 | 类型 | 说明 |
|------|------|------|
| is_banner | BOOLEAN DEFAULT false | 是否作为Banner展示 |
| cover | TEXT | 封面图片URL |

---

## 4. 分类滑动展示

### 数据来源
- `/api/categories` 接口返回所有分类

### 交互
- 可横向滑动查看所有分类
- 点击分类卡片跳转 `/categories/xxx`
- 左右侧"更多"按钮跳转 `/categories` 分类汇总页

### 样式
- 参考博客的设计，卡片式布局
- 圆角、阴影效果

---

## 5. 文章列表

### 现有功能保留
- 文章卡片样式
- 文章详情页

### 搜索
- 入口在顶部导航栏右侧（不变）
- 搜索结果在文章列表区域展示

### 分页改无限滚动
- **后端分页逻辑不变**：`/articles?page={page}&limit=20&search={query}`
- **前端无限滚动**：滚动到底部自动加载下一页并追加
- 搜索触发时重置列表，从第一页重新加载

---

## 6. 主题

保持现有的暗色/亮色主题不变。

---

## 7. 路由新增

| 路由 | 说明 |
|------|------|
| `/products/weiguang` | 微光占位页面 |
| `/products/shunian` | 树年占位页面 |

---

## 8. 技术实现清单

### 后端
- [ ] `settings` 表新增 `navigation_menus` JSON 字段
- [ ] `settings` 表新增 `enable_quote_cache` 布尔字段
- [ ] `categories` 表新增 `is_banner`、`cover` 字段
- [ ] 创建 `quotes` 表
- [ ] 实现 `GET /api/quotes/random` 接口（含Redis缓存逻辑）
- [ ] 实现 `GET /api/categories/banner` 接口
- [ ] 更新 `GET /api/settings` 接口返回新增字段

### 前端
- [ ] 重构 `Layout` 组件支持后端配置驱动的导航菜单
- [ ] 新增通知栏组件（随机金句）
- [ ] 新增轮播广告位组件
- [ ] 新增分类滑动展示组件
- [ ] 文章列表分页改无限滚动
- [ ] 新增 `/products/weiguang` 占位页面
- [ ] 新增 `/products/shunian` 占位页面

---

## 9. API 接口变更汇总

### 新增接口
| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/quotes/random` | GET | 获取随机金句 |
| `/api/categories/banner` | GET | 获取Banner分类列表 |

### 变更接口
| 接口 | 变更说明 |
|------|---------|
| `/api/settings` | 返回新增 `navigation_menus`、`enable_quote_cache` 字段 |
| `/api/categories` | 返回新增 `is_banner`、`cover` 字段 |
| `/api/articles` | 不变（但前端改为无限滚动调用） |
