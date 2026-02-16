---
name: fusion-thinking
description: 融合深度思考能力。多模式推理、分支思考、假设验证。超越Trae Agent的Sequential Thinking MCP和OpenClaw的sequential-thinking。
version: 2.0.0
allowed-tools: Bash, exec
---

# Fusion Thinking - 融合深度思考

## 功能说明

这是一个超级深度思考技能，融合了三方优势：

### 来源分析
| 来源 | 能力 | 优势 |
|------|------|------|
| Trae Agent | mcp_Sequential_Thinking | MCP集成 |
| OpenClaw | sequential-thinking | 本地实现 |
| 开源 | chain-of-thought | 思维链 |

### 融合能力
1. **顺序思考** - 步骤化问题分析
2. **分支思考** - 探索多个解决方案
3. **假设验证** - 验证和修正假设
4. **回溯机制** - 发现错误可回溯
5. **思维导图** - 可视化思考过程
6. **结论生成** - 自动生成最终答案

## 使用方法

### 顺序思考
```json
{
  "action": "think",
  "thought": "首先分析问题的核心：这是一个性能优化问题...",
  "thoughtNumber": 1,
  "totalThoughts": 5,
  "nextThoughtNeeded": true
}
```

### 分支思考
```json
{
  "action": "think",
  "thought": "探索方案A：使用缓存优化...",
  "thoughtNumber": 3,
  "totalThoughts": 8,
  "branchFromThought": 2,
  "branchId": "solution-a",
  "nextThoughtNeeded": true
}
```

### 假设修正
```json
{
  "action": "think",
  "thought": "之前的假设有误，重新考虑...",
  "thoughtNumber": 4,
  "totalThoughts": 6,
  "isRevision": true,
  "revisesThought": 3,
  "nextThoughtNeeded": true
}
```

### 生成结论
```json
{
  "action": "conclude",
  "thoughtNumber": 6,
  "totalThoughts": 6,
  "nextThoughtNeeded": false,
  "conclusion": "最终方案是..."
}
```

## 输出格式

### 思考过程
```markdown
## 深度思考过程

**问题**: 如何优化数据库查询性能？

### 思考步骤

#### 步骤 1/6: 问题理解
**思考**: 首先分析问题的核心：这是一个数据库查询性能问题...
**状态**: ✅ 完成

#### 步骤 2/6: 问题分解
**思考**: 将问题分解为：1) 索引优化 2) 查询重写 3) 缓存策略...
**状态**: ✅ 完成

#### 步骤 3/6: 分支探索 (方案A)
**思考**: 探索方案A：使用缓存优化...
**分支ID**: solution-a
**状态**: ✅ 完成

#### 步骤 4/6: 假设修正
**思考**: 之前的假设有误，重新考虑...
**修正**: 修正步骤3的假设
**状态**: ✅ 完成

### 最终结论
经过6步思考，得出结论：最佳方案是组合使用索引优化和缓存策略...
```

## 优势对比

| 特性 | Trae | OpenClaw | 开源 | Fusion |
|------|------|----------|------|--------|
| 顺序思考 | ✓ | ✓ | ✓ | ✓ |
| 分支思考 | ✓ | ✓ | 部分 | ✓ |
| 假设修正 | ✓ | ✓ | 部分 | ✓ |
| 思维导图 | ✗ | ✗ | ✓ | ✓ |
| 结论生成 | ✓ | ✓ | ✓ | ✓ |
| 可追溯性 | ✓ | ✓ | 部分 | ✓ |

## 执行脚本

```bash
node ~/.openclaw/workspace/skills/fusion-thinking/scripts/thinking.js <action> '<json-params>'
```
