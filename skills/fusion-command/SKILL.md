---
name: fusion-command
description: 命令执行技能。执行方式：1. exec 执行命令 2. 返回结果
allowed-tools: Bash
---

# Fusion Command - 命令执行

## ⚠️ 执行方式 - 必须按此步骤

### 步骤 1：执行命令
使用 `exec` 工具执行命令：
```bash
命令内容
```

### 步骤 2：显示结果
直接输出命令执行结果

---

## 命令类型

### 同步执行
```bash
npm test
```

### 后台服务
```bash
nohup npm run dev &
```

### 查看进程
```bash
ps aux
```

### 终止进程
```bash
kill PID
```

---

## 示例

**用户：运行测试**
```bash
npm test
```

**用户：启动开发服务器**
```bash
npm run dev
```

**用户：列出当前目录**
```bash
ls -la
```
