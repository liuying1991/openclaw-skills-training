---
name: fusion-search
description: 文件搜索技能。必须实际执行搜索命令并返回结果。禁止只说计划不执行。
allowed-tools: Bash
---

# Fusion Search - 文件搜索

## ⚠️ 必须执行 - 不准只说计划

当用户要求搜索文件时，你**必须**使用exec工具**实际执行**以下命令：

### 搜索文件名
```bash
find . -name "*.json" -type f 2>/dev/null | head -20
```

### 搜索文件内容
```bash
grep -rl "关键词" . 2>/dev/null | head -20
```

### 搜索正则模式
```bash
grep -rE "pattern" . --include="*.js" 2>/dev/null | head -20
```

## ❌ 禁止这样做

- 禁止只说"我来帮你搜索"但不执行
- 禁止只返回命令不执行
- 禁止说"执行中..."但没有结果

## ✅ 必须这样做

1. **立即执行**搜索命令
2. **返回实际结果**：找到的文件列表
3. **显示文件数量**

---

## 示例对话

**用户**: 帮我搜索所有的json文件

**正确响应**:
```
执行命令: find . -name "*.json" -type f

找到 15 个JSON文件：
1. ./package.json
2. ./tsconfig.json
3. ./settings.json
...
```

**错误响应**:
```
我来帮你搜索...
```bash
find . -name "*.json"
```
（没有实际执行）
```
