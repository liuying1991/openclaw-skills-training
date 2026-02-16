---
name: fusion-command
description: 融合命令执行能力。跨平台命令管理、进程监控、后台运行。超越Trae Agent的RunCommand/CheckCommandStatus/StopCommand和OpenClaw的command-manager。
version: 2.0.0
allowed-tools: Bash, exec
---

# Fusion Command - 融合命令执行

## 功能说明

这是一个超级命令执行技能，融合了三方优势：

### 来源分析
| 来源 | 能力 | 优势 |
|------|------|------|
| Trae Agent | RunCommand | PowerShell支持 |
| Trae Agent | CheckCommandStatus | 状态检查 |
| Trae Agent | StopCommand | 进程终止 |
| OpenClaw | command-manager | 进程管理 |
| 开源 | daemon-runner | 后台守护 |

### 融合能力
1. **命令执行** - 支持PowerShell/Bash/Cmd
2. **后台运行** - 非阻塞执行、守护进程
3. **进程监控** - 实时状态、输出获取
4. **进程控制** - 暂停/恢复/终止
5. **跨平台** - Windows/WSL/Linux兼容
6. **超时管理** - 自动超时、重试机制

## 使用方法

### 同步执行
```json
{
  "action": "run",
  "command": "npm test",
  "blocking": true,
  "timeout": 60000,
  "cwd": "/path/to/project"
}
```

### 后台执行
```json
{
  "action": "run",
  "command": "npm run dev",
  "blocking": false,
  "command_type": "web_server",
  "cwd": "/path/to/project"
}
```

### 检查状态
```json
{
  "action": "status",
  "command_id": "cmd-12345"
}
```

### 获取输出
```json
{
  "action": "output",
  "command_id": "cmd-12345",
  "lines": 100,
  "priority": "bottom"
}
```

### 终止进程
```json
{
  "action": "stop",
  "command_id": "cmd-12345"
}
```

### 批量管理
```json
{
  "action": "list",
  "filter": {
    "status": "running",
    "type": "web_server"
  }
}
```

## 输出格式

### 执行结果
```markdown
## 命令执行结果

**命令ID**: cmd-12345
**命令**: npm run dev
**状态**: 运行中
**类型**: web_server
**启动时间**: 2026-02-16 10:00:00
**运行时长**: 5分钟

### 输出 (最近100行)
```
> project@1.0.0 dev
> vite

  VITE v5.0.0  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
```

### 进程列表
```markdown
## 运行中的进程

| ID | 命令 | 类型 | 状态 | 运行时长 |
|----|------|------|------|----------|
| cmd-12345 | npm run dev | web_server | 运行中 | 5分钟 |
| cmd-12346 | python app.py | long_running | 运行中 | 2分钟 |
```

## 优势对比

| 特性 | Trae | OpenClaw | 开源 | Fusion |
|------|------|----------|------|--------|
| PowerShell | ✓ | ✗ | 部分 | ✓ |
| 后台运行 | ✓ | ✓ | ✓ | ✓ |
| 进程监控 | ✓ | ✓ | ✓ | ✓ |
| 跨平台 | 部分 | ✓ | ✓ | ✓ |
| 超时管理 | ✓ | ✗ | 部分 | ✓ |
| 类型分类 | ✓ | ✗ | ✗ | ✓ |

## 执行脚本

```bash
node ~/.openclaw/workspace/skills/fusion-command/scripts/command.js <action> '<json-params>'
```
