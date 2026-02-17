---
name: fusion-todo
description: 任务管理技能。必须实际创建任务文件并返回任务列表。禁止只说计划不执行。
allowed-tools: Bash
---

# Fusion Todo - 任务管理

## ⚠️ 必须执行 - 不准只说计划

当用户要求创建任务时，你**必须**使用write工具**实际创建**任务文件：

### 创建任务文件
```bash
echo '{
  "todos": [
    {"id": "1", "content": "任务内容", "priority": "high", "status": "pending"},
    {"id": "2", "content": "任务内容", "priority": "medium", "status": "pending"}
  ],
  "created_at": "'$(date)'"
}' > /tmp/todo.json && cat /tmp/todo.json
```

### 查看任务
```bash
cat /tmp/todo.json 2>/dev/null || echo "无任务文件"
```

## ❌ 禁止这样做

- 禁止只说"我来创建任务"但不执行
- 禁止只返回Markdown列表不创建文件
- 禁止说"任务已创建"但没有实际文件

## ✅ 必须这样做

1. **立即创建**任务文件
2. **返回任务列表**
3. **显示文件路径**

---

## 示例对话

**用户**: 创建任务列表：安装依赖、运行测试

**正确响应**:
```
已创建任务文件: /tmp/todo.json

任务列表：
🔴 [1] 安装依赖 (high)
🟡 [2] 运行测试 (medium)

共2个任务待处理
```
