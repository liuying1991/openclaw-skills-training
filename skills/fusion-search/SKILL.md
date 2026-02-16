---
name: fusion-search
description: 融合搜索能力。结合语义搜索、关键词搜索、正则搜索、文件模式匹配于一体。超越Trae Agent的SearchCodebase、Grep、Glob，以及OpenClaw的search-codebase。
version: 2.0.0
allowed-tools: Bash, exec
---

# Fusion Search - 融合搜索

## 功能说明

这是一个超级搜索技能，融合了三方优势：

### 来源分析
| 来源 | 能力 | 优势 |
|------|------|------|
| Trae Agent | SearchCodebase(嵌入模型) | 语义理解强 |
| Trae Agent | Grep(ripgrep) | 正则搜索快 |
| Trae Agent | Glob | 文件模式匹配 |
| OpenClaw | search-codebase | ripgrep关键词 |
| 开源 | exa, brave-search | 多引擎聚合 |

### 融合能力
1. **语义搜索** - 理解自然语言查询意图
2. **关键词搜索** - 精确匹配关键词
3. **正则搜索** - 复杂模式匹配
4. **文件模式** - Glob模式匹配文件
5. **混合搜索** - 多模式组合搜索

## 使用方法

### 语义搜索
```json
{
  "action": "semantic",
  "query": "找到处理用户认证的代码",
  "path": "/path/to/project"
}
```

### 关键词搜索
```json
{
  "action": "keyword",
  "query": "authentication",
  "path": "/path/to/project",
  "filePattern": "*.js"
}
```

### 正则搜索
```json
{
  "action": "regex",
  "pattern": "async\\s+function\\s+\\w+",
  "path": "/path/to/project"
}
```

### 文件模式匹配
```json
{
  "action": "glob",
  "pattern": "**/*.test.js",
  "path": "/path/to/project"
}
```

### 混合搜索
```json
{
  "action": "hybrid",
  "semanticQuery": "用户登录验证",
  "keywords": ["login", "auth", "verify"],
  "path": "/path/to/project"
}
```

## 输出格式

```markdown
## 搜索结果

**搜索类型**: 语义搜索
**查询**: "找到处理用户认证的代码"
**匹配文件**: 15个

### 相关文件

1. **src/auth/login.ts** (相关度: 95%)
   - 第23-45行: 登录验证逻辑
   ```typescript
   async function validateUser(credentials) {
     // ...
   }
   ```

2. **src/middleware/auth.ts** (相关度: 88%)
   - 第10-30行: 认证中间件
   ...
```

## 优势对比

| 特性 | Trae | OpenClaw | 开源 | Fusion |
|------|------|----------|------|--------|
| 语义理解 | ✓ | ✗ | 部分 | ✓ |
| 正则搜索 | ✓ | ✗ | ✓ | ✓ |
| 文件模式 | ✓ | ✗ | ✓ | ✓ |
| 多模式组合 | ✗ | ✗ | ✗ | ✓ |
| 结果排序 | ✓ | 部分 | ✓ | ✓ |
| 上下文提取 | ✓ | 部分 | 部分 | ✓ |

## 执行脚本

```bash
node ~/.openclaw/workspace/skills/fusion-search/scripts/search.js <action> '<json-params>'
```
