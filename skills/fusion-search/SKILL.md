---
name: fusion-search
description: 文件搜索技能。执行方式：1. exec 执行搜索命令 2. 返回结果
allowed-tools: Bash
---

# Fusion Search - 文件搜索

## ⚠️ 执行方式 - 必须按此步骤

### 步骤 1：执行搜索
使用 `exec` 工具执行搜索命令：
```bash
find . -name "*.js" -type f
```

### 步骤 2：显示结果
直接输出搜索结果

---

## 搜索类型

### 搜索文件名
```bash
find . -name "*.json" -type f
```

### 搜索文件内容
```bash
grep -r "关键词" . --include="*.js"
```

### 搜索正则模式
```bash
grep -rE "pattern" . --include="*.js"
```

---

## 示例

**用户：帮我搜索所有的js文件**
```bash
find . -name "*.js" -type f
```

**用户：搜索包含"function"的py文件**
```bash
grep -r "function" . --include="*.py"
```

**用户：搜索当前目录下所有的json文件**
```bash
find . -name "*.json" -type f
```
