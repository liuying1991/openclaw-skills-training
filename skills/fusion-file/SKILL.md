---
name: fusion-file
description: 融合文件操作能力。智能文件管理、大文件处理、批量操作。超越Trae Agent的Read/Write/SearchReplace/DeleteFile/LS和OpenClaw的clawdbot-filesystem/multi-file-editor。
version: 2.0.0
allowed-tools: Bash, exec
---

# Fusion File - 融合文件操作

## 功能说明

这是一个超级文件操作技能，融合了三方优势：

### 来源分析
| 来源 | 能力 | 优势 |
|------|------|------|
| Trae Agent | Read | 智能截断 |
| Trae Agent | Write | 覆盖写入 |
| Trae Agent | SearchReplace | 精确替换 |
| Trae Agent | DeleteFile | 文件删除 |
| Trae Agent | LS | 目录列表 |
| OpenClaw | clawdbot-filesystem | 文件系统 |
| OpenClaw | multi-file-editor | 多文件编辑 |
| 开源 | batch-file-processor | 批量处理 |

### 融合能力
1. **智能读取** - 自动截断、编码检测
2. **安全写入** - 原子写入、备份机制
3. **精确编辑** - 搜索替换、差异对比
4. **批量操作** - 多文件并行处理
5. **目录管理** - 递归列表、模式过滤
6. **文件监控** - 变化检测、自动同步

## 使用方法

### 读取文件
```json
{
  "action": "read",
  "path": "/path/to/file.ts",
  "offset": 100,
  "limit": 200,
  "encoding": "utf-8"
}
```

### 写入文件
```json
{
  "action": "write",
  "path": "/path/to/file.ts",
  "content": "文件内容...",
  "backup": true
}
```

### 搜索替换
```json
{
  "action": "replace",
  "path": "/path/to/file.ts",
  "old_str": "旧内容",
  "new_str": "新内容"
}
```

### 批量操作
```json
{
  "action": "batch",
  "operations": [
    {"type": "read", "path": "/path/to/file1.ts"},
    {"type": "write", "path": "/path/to/file2.ts", "content": "..."},
    {"type": "delete", "path": "/path/to/file3.ts"}
  ]
}
```

### 目录列表
```json
{
  "action": "list",
  "path": "/path/to/dir",
  "recursive": true,
  "pattern": "**/*.ts",
  "ignore": ["node_modules", "dist"]
}
```

### 文件监控
```json
{
  "action": "watch",
  "path": "/path/to/dir",
  "events": ["change", "add", "delete"],
  "callback": true
}
```

## 输出格式

### 读取结果
```markdown
## 文件内容

**路径**: /path/to/file.ts
**大小**: 15.2 KB
**行数**: 500
**编码**: UTF-8

### 内容 (第100-300行)

```typescript
   100→export class UserService {
   101→  private repository: UserRepository;
   102→  
   103→  constructor() {
   104→    this.repository = new UserRepository();
   105→  }
   ...
```

**注意**: 文件已截断，显示第100-300行
```

### 目录列表
```markdown
## 目录内容

**路径**: /path/to/project
**文件数**: 45
**目录数**: 12

### 文件列表

| 类型 | 名称 | 大小 | 修改时间 |
|------|------|------|----------|
| 📄 | index.ts | 2.1 KB | 2026-02-16 |
| 📄 | app.ts | 5.3 KB | 2026-02-15 |
| 📁 | src/ | - | 2026-02-16 |
| 📁 | tests/ | - | 2026-02-14 |
```

## 优势对比

| 特性 | Trae | OpenClaw | 开源 | Fusion |
|------|------|----------|------|--------|
| 智能截断 | ✓ | 部分 | 部分 | ✓ |
| 原子写入 | ✗ | ✗ | 部分 | ✓ |
| 精确替换 | ✓ | ✓ | ✓ | ✓ |
| 批量操作 | ✗ | ✓ | ✓ | ✓ |
| 文件监控 | ✗ | ✗ | ✓ | ✓ |
| 编码检测 | ✗ | 部分 | ✓ | ✓ |

## 执行脚本

```bash
node ~/.openclaw/workspace/skills/fusion-file/scripts/file.js <action> '<json-params>'
```
