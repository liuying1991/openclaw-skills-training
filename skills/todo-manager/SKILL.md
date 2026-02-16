---
name: todo-manager
description: 任务列表管理能力，用于创建和管理结构化任务列表。
---

# Todo Manager - 任务列表管理

## 功能说明

这是一个任务管理工具，用于：
- 规划复杂多步骤任务
- 跟踪任务进度
- 向用户展示工作进度

## 使用方法

### 执行命令

```bash
node ~/.openclaw/workspace/skills/todo-manager/scripts/todo.js <action> [args]
```

### 操作说明

| 操作 | 说明 |
|------|------|
| create <json> | 创建任务列表 |
| update <id> <status> | 更新任务状态 |
| complete <id> | 完成任务 |
| list | 列出所有任务 |
| clear | 清空任务列表 |

## 示例

```bash
# 创建任务列表
node scripts/todo.js create '[{"id":"1","content":"分析需求","status":"pending","priority":"high"}]'

# 更新任务状态
node scripts/todo.js update 1 in_progress

# 完成任务
node scripts/todo.js complete 1

# 列出所有任务
node scripts/todo.js list
```

## 输出格式

```
Task List:
==========

⏳ 🔴 [1] 分析需求
🔄 🟡 [2] 编写代码
✅ 🟢 [3] 测试部署

Progress: 1/3 completed (1 in progress, 1 pending)
```

## 适用场景

- 规划复杂多步骤任务
- 跟踪任务进度
- 向用户展示工作进度
