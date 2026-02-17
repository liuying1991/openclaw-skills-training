---
name: fusion-todo
description: 任务管理技能。执行方式：1. write 创建任务文件 2. read 读取状态
allowed-tools: Bash
---

# Fusion Todo - 任务管理

## ⚠️ 执行方式 - 必须按此步骤

### 步骤 1：创建任务文件
使用 `write` 工具创建任务文件到 `/tmp/todo.json`

### 步骤 2：显示任务列表
输出任务列表

---

## 任务文件格式

```json
{
  "todos": [
    {"id": "1", "content": "任务1", "priority": "high", "status": "pending"},
    {"id": "2", "content": "任务2", "priority": "medium", "status": "pending"}
  ]
}
```

## 任务状态

| 状态 | 说明 |
|------|------|
| pending | 待处理 |
| in_progress | 进行中 |
| completed | 已完成 |

## 任务优先级

| 优先级 | 标识 |
|--------|------|
| high | 🔴 |
| medium | 🟡 |
| low | 🟢 |

---

## 示例

**用户：创建任务列表**
1. write 创建 `/tmp/todo.json`
2. 写入任务列表内容
3. 显示任务列表
