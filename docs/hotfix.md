# Hotfix

## 2026-04-29

### 1. 创建分类时 slug 生成问题

**问题**: 创建中文分类时返回 "Category with this name already exists" 错误

**原因**: `slugify` 库默认配置会移除所有非拉丁字符，导致中文名称转换为空字符串，空字符串 slug 已在数据库中存在时触发冲突

**解决方案**:
- 修改 `server/src/routes/admin/categories.ts` 中的 `generateSlug` 函数
- 英文名称使用 slugify 转换，中文名称使用 base64url 编码作为 slug
- 添加 slug 为空时的校验

**文件**: `server/src/routes/admin/categories.ts`

---

### 2. 分类页面显示错误的分类名称

**问题**: 点击 "AICoding案例" 分类，URL 变为 /category/aicoding，但页面显示 "分类: 运维知识"，刷新后显示 "分类: aicoding"

**原因**: 当 slug 参数变化时，useEffect 会重新获取数据，但在获取新数据之前没有重置 category 状态，导致组件使用旧的 category 状态进行渲染

**解决方案**:
- 在 useEffect 开始时添加 `setCategory(null)`，确保在加载新数据前清空旧分类

**文件**: `client/src/pages/Category/Category.tsx`

---

## 版本记录

- v1.0.1: 代码块样式优化、元信息布局统一、搜索功能、SEO 优化
- 2026-04-29: 修复中文分类 slug 生成问题，修复分类页面状态残留问题