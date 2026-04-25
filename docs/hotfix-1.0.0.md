# Hotfix v1.0.0

## 问题修复

### 1. Client 端 npm install 报错 @types/react-router-dom

**问题**: npm install 报错 `No matching version found for @types/react-router-dom@^6.22.0`

**错误原因**: `@types/react-router-dom@^6.22.0` 不存在，`@types/react-router-dom` 最新版本只到 `5.3.3`

**解决方案**: 移除 `@types/react-router-dom` 依赖（react-router-dom v6 已自带类型定义）

**文件**: `client/package.json`

---

### 2. Server 端 import path 错误

**问题**: Error: Cannot find module '../../db'

**错误原因**: 相对路径计算错误，14处 import 路径需要修正

**解决方案**: 修正所有 route 文件中的 import 路径

**文件**: `server/src/routes/*.ts`

---

### 3. TypeScript 类型错误

**问题**: marked v12 版本 `highlight` 选项已废弃

**错误原因**: marked.setOptions({ highlight }) API 已移除

**解决方案**: 使用 `marked.use({renderer})` 替代废弃的 `highlight` 选项

**文件**: `client/src/pages/ArticleDetail/ArticleDetail.tsx`

---

### 4. 测试框架配置

**问题**: Jest 无法正确加载 ESM 模块 (tsx)

**解决方案**: 使用 Vitest 替代 Jest

**文件**: `server/package.json`, `server/vitest.config.ts`

---

### 5. 访问 /tag 和 /archive 页面失败

**问题**: No routes matched location "/tag" / "/archive"

**错误原因**: Layout.tsx 导航链接指向 `/tag` 和 `/archive`，但 App.tsx 路由配置中：
- `tag/:slug` 需要 slug 参数，但没有 `/tag` 本身
- `archive/:year/:month` 需要 year/month 参数，但没有 `/archive` 本身

**解决方案**: 
1. 添加 `TagList` 页面展示所有标签
2. 添加 `ArchiveList` 页面展示归档概览
3. 修改 App.tsx 添加新路由

**文件**: 
- `client/src/App.tsx`
- `client/src/pages/Tag/TagList.tsx`
- `client/src/pages/Archive/Archive.tsx`

---

### 6. Logo 图片无法展示

**问题**: Logo 显示不正确或路径不存在

**错误原因**: 
1. `schema.sql` 默认值使用 JSON 字符串格式存储，导致值带引号
2. 路径 `/images/logo.jpg` 不存在

**解决方案**:
1. 修改 `schema.sql` 默认值，直接存储字符串
2. 创建 `client/public/images/logo.svg`

**文件**: 
- `server/src/db/schema.sql`
- `client/public/images/logo.svg`

---

### 7. 登录后台后立即跳转回登录页

**问题**: 登录成功但页面立即跳转到登录页

**错误原因**: 
1. API 响应拦截器收到 401 后清除 localStorage 并跳转
2. 但 `useAuthStore.getState().logout()` 在清除 store 时触发重新渲染
3. Dashboard 的 useEffect 检测 token 变化后再次跳转

**解决方案**: 修改 `api/index.ts`:
- 使用 zustand store 读取 token 而非 localStorage
- 添加 `isLoggingIn` 标志防止登录请求触发 401 处理逻辑

**文件**: `client/src/api/index.ts`

---

### 8. Settings 默认值格式问题

**问题**: blogTitle/blogLogo 显示时带引号

**错误原因**: schema.sql 中 blogTitle/blogLogo 使用 JSON 字符串格式存储，解析后值带引号

**解决方案**: 直接存储字符串值，不使用 JSON 包装

**文件**: `server/src/db/schema.sql`

---

### 9. 文章创建支持自定义发布时间

**问题**: 文章 created_at 字段无法自定义

**解决方案**: 后端 API 支持接收 created_at 参数

**文件**: `server/src/routes/admin/articles.ts`

---

### 10. marked API 变化

**问题**: marked v12 版本 `highlight` 选项已废弃

**错误原因**: marked.setOptions({ highlight }) API 已移除

**解决方案**: 使用 `marked.use({renderer})` 替代

**文件**: `client/src/pages/ArticleDetail/ArticleDetail.tsx`

---

### 11. INSERT OR IGNORE vs INSERT OR REPLACE

**问题**: 数据库初始化时覆盖已有数据

**错误原因**: INSERT OR IGNORE 保留已有数据，INSERT OR REPLACE 会替换

**解决方案**: schema.sql 中使用 INSERT OR IGNORE 保护现有数据

**文件**: `server/src/db/schema.sql`

---

### 12. 嵌套 Link 问题

**问题**: `<a> cannot appear as a descendant of <a>`

**错误原因**: 文章卡片中标题和分类/标签都是 Link，嵌套导致 React 警告

**解决方案**: 拆分 Link 结构，标题使用 Link，分类/标签独立渲染

**文件**: `client/src/components/ArticleCard/ArticleCard.tsx`
