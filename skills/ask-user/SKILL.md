---
name: ask-user
description: 结构化用户交互能力，提供选项让用户选择。
---

# Ask User - 结构化用户交互

## 功能说明

这是一个用户交互工具，用于：
- 需要用户确认操作
- 让用户选择执行路径
- 收集用户偏好

## 使用方法

### 执行命令

```bash
node ~/.openclaw/workspace/skills/ask-user/scripts/ask.js "<question>" "<options>" [--default <option>]
```

### 参数说明

| 参数 | 说明 |
|------|------|
| question | 要询问的问题 |
| options | 选项列表（逗号分隔） |
| --default | 默认选项（可选） |

## 示例

```bash
# 询问用户选择编程语言
node scripts/ask.js "请选择编程语言" "Python,JavaScript,Go" --default Python

# 询问用户确认
node scripts/ask.js "是否继续执行?" "是,否"
```

## 输出格式

```
请选择编程语言
---

  1. Python (default)
     高级编程语言
  2. JavaScript
     Web开发语言
  3. Go
     系统编程语言

Enter choice [1-3] (default: 1): 

You selected: Python
```

## 适用场景

- 需要用户确认操作
- 让用户选择执行路径
- 收集用户偏好
