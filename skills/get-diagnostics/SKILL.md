---
name: get-diagnostics
description: 语言诊断能力，获取代码的语言服务器诊断信息（错误、警告等）。
---

# Get Diagnostics - 语言诊断能力

## 功能说明

这是一个代码诊断工具，用于：
- 检查代码语法错误
- 获取类型检查结果
- 发现代码质量问题

## 使用方法

### 执行命令

```bash
node ~/.openclaw/workspace/skills/get-diagnostics/scripts/diagnose.js [--file <file>] [--type <type>]
```

### 参数说明

| 参数 | 说明 |
|------|------|
| --file | 要诊断的文件（可选） |
| --type | 诊断类型：error/warning/all（可选，默认 all） |

## 示例

```bash
# 获取所有诊断
node scripts/diagnose.js

# 获取特定文件的诊断
node scripts/diagnose.js --file src/index.ts

# 只获取错误
node scripts/diagnose.js --type error
```

## 输出格式

```
Running diagnostics...

Found 3 errors and 2 warnings

❌ src/index.ts:15
   Property 'name' does not exist on type 'User'

⚠️ src/utils.ts:23
   Unused variable 'temp'
```

## 适用场景

- 检查代码语法错误
- 获取类型检查结果
- 发现代码质量问题
