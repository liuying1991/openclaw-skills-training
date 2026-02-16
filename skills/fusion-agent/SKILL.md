---
name: fusion-agent
description: 融合代理调度能力。并行任务调度、子代理管理、结果整合。超越Trae Agent的Task和OpenClaw的task-agent。
version: 2.0.0
allowed-tools: Bash, exec
---

# Fusion Agent - 融合代理调度

## 功能说明

这是一个超级代理调度技能，融合了三方优势：

### 来源分析
| 来源 | 能力 | 优势 |
|------|------|------|
| Trae Agent | Task | 子代理启动 |
| OpenClaw | task-agent | 并行处理 |
| 开源 | multi-agent | 多代理协作 |

### 融合能力
1. **单任务调度** - 启动独立代理执行任务
2. **并行调度** - 同时启动多个代理
3. **任务委托** - 将复杂任务分解委托
4. **结果整合** - 汇总多个代理结果
5. **错误隔离** - 单个代理失败不影响其他
6. **进度追踪** - 实时监控代理状态

## 使用方法

### 单任务调度
```json
{
  "action": "dispatch",
  "agent_type": "search",
  "description": "搜索认证代码",
  "query": "在代码库中查找用户认证相关的代码",
  "response_language": "zh-CN"
}
```

### 并行调度
```json
{
  "action": "dispatch-parallel",
  "agents": [
    {
      "agent_type": "search",
      "description": "搜索前端代码",
      "query": "查找前端登录组件"
    },
    {
      "agent_type": "search",
      "description": "搜索后端代码",
      "query": "查找后端认证API"
    },
    {
      "agent_type": "search",
      "description": "搜索配置文件",
      "query": "查找认证相关配置"
    }
  ],
  "response_language": "zh-CN"
}
```

### 任务委托
```json
{
  "action": "delegate",
  "task": "实现用户认证功能",
  "subtasks": [
    {"type": "analysis", "description": "分析现有代码结构"},
    {"type": "design", "description": "设计认证流程"},
    {"type": "implement", "description": "实现认证逻辑"},
    {"type": "test", "description": "编写测试用例"}
  ]
}
```

### 状态查询
```json
{
  "action": "status",
  "agent_id": "agent-12345"
}
```

### 结果获取
```json
{
  "action": "result",
  "agent_id": "agent-12345"
}
```

## 输出格式

### 调度结果
```markdown
## 代理调度结果

**调度ID**: dispatch-67890
**代理数量**: 3
**状态**: 全部完成

### 代理列表

| ID | 类型 | 描述 | 状态 | 耗时 |
|----|------|------|------|------|
| agent-12345 | search | 搜索前端代码 | ✅ 完成 | 2.3s |
| agent-12346 | search | 搜索后端代码 | ✅ 完成 | 1.8s |
| agent-12347 | search | 搜索配置文件 | ✅ 完成 | 1.2s |

### 结果汇总

#### 前端代码搜索结果
- src/components/Login.tsx
- src/pages/AuthPage.tsx

#### 后端代码搜索结果
- src/api/auth.ts
- src/middleware/auth.ts

#### 配置文件搜索结果
- config/auth.config.json
```

### 委托结果
```markdown
## 任务委托结果

**主任务**: 实现用户认证功能
**子任务数**: 4
**完成状态**: 4/4

### 子任务详情

1. **分析现有代码结构** ✅
   - 结果: 识别了3个相关模块

2. **设计认证流程** ✅
   - 结果: 生成了认证流程图

3. **实现认证逻辑** ✅
   - 结果: 创建了5个新文件

4. **编写测试用例** ✅
   - 结果: 编写了12个测试用例

### 最终交付
- 新增文件: 5个
- 修改文件: 3个
- 测试覆盖率: 85%
```

## 优势对比

| 特性 | Trae | OpenClaw | 开源 | Fusion |
|------|------|----------|------|--------|
| 单任务调度 | ✓ | ✓ | ✓ | ✓ |
| 并行调度 | ✓ | ✓ | ✓ | ✓ |
| 任务委托 | ✗ | 部分 | ✓ | ✓ |
| 结果整合 | ✓ | ✓ | ✓ | ✓ |
| 错误隔离 | ✓ | ✓ | 部分 | ✓ |
| 进度追踪 | ✗ | ✗ | 部分 | ✓ |

## 执行脚本

```bash
node ~/.openclaw/workspace/skills/fusion-agent/scripts/agent.js <action> '<json-params>'
```
