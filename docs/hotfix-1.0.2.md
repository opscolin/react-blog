# Hotfix 1.0.2 - 日记内容换行符渲染优化

**日期**: 2026-05-22

## 问题描述

后台编写日记时通过 `<textarea>` 输入的换行符（`\n`）在前端列表页和时间轴页展示时被忽略，导致多段内容挤在一行，阅读体验不佳。

**受影响页面**:
- 日记列表页 (`/diary`) - 卡片视图
- 日记时间轴页 - 时间轴视图
- 日记详情弹窗 - Modal 视图

## 根本原因

前端使用 `<p>` 标签渲染日记 `content` 内容（纯文本）。HTML 规范中，`<p>` 标签默认 `white-space: normal`，会折叠空白字符和换行符。

## 解决方案

在 `client/src/pages/Diary/Diary.css` 中为三个内容展示区域添加 `white-space: pre-wrap`：

| CSS 类名 | 对应视图 |
|---------|---------|
| `.diary-card-content` | 列表卡片 |
| `.timeline-excerpt` | 时间轴卡片 |
| `.diary-modal-content` | 详情弹窗 |

`pre-wrap` 行为：保留换行符和空格，同时允许文本正常换行（不会溢出容器）。

## 修改文件

- `client/src/pages/Diary/Diary.css`
