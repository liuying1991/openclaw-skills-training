---
name: command-manager
description: 命令状态管理能力，启动、监控、停止长时间运行的命令。
---

# Command Manager - 命令状态管理

## 功能说明

这是一个命令管理工具，用于：
- 启动后台服务
- 监控命令执行状态
- 管理多个并行进程

## 使用方法

### 执行命令

```bash
node ~/.openclaw/workspace/skills/command-manager/scripts/command.js <action> [args]
```

### 操作说明

| 操作 | 说明 |
|------|------|
| start <command> | 启动新命令 |
| status <id> | 检查命令状态 |
| stop <id> | 停止命令 |
| list | 列出所有命令 |

## 示例

```bash
# 启动命令
node scripts/command.js start "npm run dev"

# 查看状态
node scripts/command.js status cmd_1234567890

# 停止命令
node scripts/command.js stop cmd_1234567890

# 列出所有命令
node scripts/command.js list
```

## 输出格式

```
Running Commands:
=================

🟢 cmd_1708080000000
   PID: 12345
   Command: npm run dev
   Started: 2024-02-16T12:00:00.000Z

🔴 cmd_1708080000001
   PID: 12346
   Command: npm test
   Started: 2024-02-16T12:01:00.000Z
```

## 适用场景

- 启动后台服务
- 监控命令执行状态
- 管理多个并行进程
