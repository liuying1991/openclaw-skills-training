---
name: fusion-diagnostics
description: 代码诊断技能。执行方式：1. exec 执行诊断命令 2. 返回结果
allowed-tools: Bash
---

# Fusion Diagnostics - 代码诊断

## ⚠️ 执行方式 - 必须按此步骤

### 步骤 1：执行诊断
使用 `exec` 工具执行诊断命令：
```bash
ruff check . --fix
```

### 步骤 2：显示结果
直接输出诊断结果

---

## 诊断类型

### Python诊断
```bash
ruff check . --fix
```

### JavaScript诊断
```bash
npx eslint . --fix
```

### TypeScript诊断
```bash
npx tsc --noEmit
```

### 安全扫描
```bash
npm audit
```

---

## 示例

**用户：检查代码错误**
```bash
ruff check .
```

**用户：运行类型检查**
```bash
npx tsc --noEmit
```

**用户：安全扫描**
```bash
npm audit
```
