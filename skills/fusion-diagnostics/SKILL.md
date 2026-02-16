---
name: fusion-diagnostics
description: 融合诊断能力。全语言代码诊断+自动修复建议。超越Trae Agent的GetDiagnostics和OpenClaw的get-diagnostics。
version: 2.0.0
allowed-tools: Bash, exec
---

# Fusion Diagnostics - 融合诊断

## 功能说明

这是一个超级诊断技能，融合了三方优势：

### 来源分析
| 来源 | 能力 | 优势 |
|------|------|------|
| Trae Agent | GetDiagnostics(VSCode LSP) | IDE集成强 |
| OpenClaw | get-diagnostics | TypeScript/ESLint |
| 开源 | lint-skills | 多语言支持 |

### 融合能力
1. **多语言诊断** - 支持JS/TS/Python/Go/Rust/Java等
2. **类型检查** - TypeScript类型错误检测
3. **规范检查** - ESLint/Pylint等规范问题
4. **安全扫描** - 代码安全漏洞检测
5. **自动修复** - 提供修复建议和自动修复

## 使用方法

### 单文件诊断
```json
{
  "action": "diagnose",
  "path": "/path/to/file.ts",
  "types": ["type", "lint", "security"]
}
```

### 项目诊断
```json
{
  "action": "diagnose-project",
  "path": "/path/to/project",
  "types": ["type", "lint", "security"],
  "exclude": ["node_modules", "dist"]
}
```

### 自动修复
```json
{
  "action": "fix",
  "path": "/path/to/file.ts",
  "issues": ["all"]
}
```

## 输出格式

```markdown
## 诊断报告

**文件**: src/auth/login.ts
**诊断类型**: 类型检查 + 规范检查 + 安全扫描
**问题数量**: 5个

### 问题列表

#### 🔴 错误 (2)

1. **类型错误** (第23行)
   - 消息: Parameter 'credentials' implicitly has an 'any' type
   - 修复建议: 添加类型注解
   ```typescript
   // 修复前
   async function validateUser(credentials) {
   
   // 修复后
   async function validateUser(credentials: Credentials) {
   ```

2. **安全漏洞** (第45行)
   - 消息: Possible SQL injection vulnerability
   - 修复建议: 使用参数化查询
   ```typescript
   // 修复前
   const query = `SELECT * FROM users WHERE id = ${id}`;
   
   // 修复后
   const query = 'SELECT * FROM users WHERE id = ?';
   ```

#### 🟡 警告 (3)

1. **规范问题** (第10行)
   - 消息: 'password' is defined but never used
   - 修复建议: 删除未使用变量
```

## 优势对比

| 特性 | Trae | OpenClaw | 开源 | Fusion |
|------|------|----------|------|--------|
| 多语言支持 | 部分 | 部分 | ✓ | ✓ |
| IDE集成 | ✓ | ✗ | ✗ | ✓ |
| 安全扫描 | ✗ | ✗ | ✓ | ✓ |
| 自动修复 | ✗ | ✗ | 部分 | ✓ |
| 详细建议 | ✓ | 部分 | 部分 | ✓ |

## 执行脚本

```bash
node ~/.openclaw/workspace/skills/fusion-diagnostics/scripts/diagnose.js <action> '<json-params>'
```
