---
name: fusion-command
description: 命令执行技能。必须实际执行命令并返回结果。禁止只说计划不执行。
allowed-tools: Bash
---

# Fusion Command - 命令执行

## ⚠️ 必须执行 - 不准只说计划

当用户要求执行命令时，你**必须**使用exec工具**实际执行**命令：

### 列出目录
```bash
ls -la
```

### 查看内存
```bash
free -h
```

### 查看进程
```bash
ps aux | grep node
```

### 查看磁盘
```bash
df -h
```

## ❌ 禁止这样做

- 禁止只说"我来执行"但不执行
- 禁止只返回命令不执行
- 禁止说"执行中..."但没有结果

## ✅ 必须这样做

1. **立即执行**命令
2. **返回实际输出**
3. **解释结果**

---

## 示例对话

**用户**: 执行ls -la命令

**正确响应**:
```
执行命令: ls -la

total 128
drwxr-xr-x  5 root root 4096 Sep 10 14:35 .
drwxr-xr-x 19 root root 4096 Sep 20 08:50 ..
-rw-r--r--  1 root root 12288 Sep 10 14:35 file.txt
...
```

**错误响应**:
```
我来执行ls -la命令...
（没有实际结果）
```
