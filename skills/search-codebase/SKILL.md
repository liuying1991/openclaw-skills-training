---
name: search-codebase
description: 语义化代码搜索能力。使用关键词提取和 ripgrep 在代码库中查找相关代码片段。
---

# Search Codebase - 语义化代码搜索

## 功能说明

这是一个强大的代码搜索工具，用于：
- 根据语义描述查找代码
- 快速定位相关代码片段
- 理解代码架构和依赖关系

## 使用方法

### 执行命令

```bash
node ~/.openclaw/workspace/skills/search-codebase/scripts/search.js "<query>" [--dir <directory>]
```

### 参数说明

| 参数 | 说明 |
|------|------|
| query | 搜索查询描述 |
| --dir | 搜索目录（可选，默认当前目录） |

## 示例

```bash
# 搜索认证相关代码
node scripts/search.js "user authentication"

# 搜索数据库连接代码
node scripts/search.js "database connection" --dir ./src
```

## 输出格式

```
Searching for: authentication, user
Directory: ./src
---
Found 15 matches:

1. ./src/auth/login.js:23
   async function authenticateUser(username, password) {

2. ./src/middleware/auth.js:45
   const token = await verifyToken(req.headers.authorization)
```

## 适用场景

- 查找特定功能的实现代码
- 理解代码架构和依赖关系
- 快速定位相关代码片段
