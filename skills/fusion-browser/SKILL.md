---
name: fusion-browser
description: 融合浏览器能力。网络搜索、网页抓取、浏览器自动化。超越Trae Agent的WebSearch/WebFetch和OpenClaw的playwright-browser/web-search。
version: 2.0.0
allowed-tools: Bash, exec
---

# Fusion Browser - 融合浏览器

## 功能说明

这是一个超级浏览器技能，融合了三方优势：

### 来源分析
| 来源 | 能力 | 优势 |
|------|------|------|
| Trae Agent | WebSearch | 网络搜索 |
| Trae Agent | WebFetch | 网页抓取 |
| OpenClaw | web-search | SearXNG搜索 |
| OpenClaw | playwright-browser | 浏览器自动化 |
| 开源 | exa, brave-search | 多引擎搜索 |

### 融合能力
1. **多引擎搜索** - Google/Bing/SearXNG/Exa
2. **智能抓取** - 自动提取网页内容
3. **浏览器自动化** - Playwright控制
4. **截图功能** - 全页/区域截图
5. **表单填写** - 自动填写表单
6. **会话管理** - Cookie/登录状态

## 使用方法

### 网络搜索
```json
{
  "action": "search",
  "query": "OpenClaw最新功能",
  "engines": ["google", "bing"],
  "num": 10
}
```

### 网页抓取
```json
{
  "action": "fetch",
  "url": "https://example.com/article",
  "extract": ["title", "content", "images"]
}
```

### 浏览器自动化
```json
{
  "action": "automate",
  "steps": [
    {"type": "goto", "url": "https://example.com/login"},
    {"type": "fill", "selector": "#username", "value": "user"},
    {"type": "fill", "selector": "#password", "value": "pass"},
    {"type": "click", "selector": "button[type=submit]"},
    {"type": "wait", "selector": ".dashboard"},
    {"type": "screenshot", "fullPage": true}
  ]
}
```

### 截图
```json
{
  "action": "screenshot",
  "url": "https://example.com",
  "fullPage": true,
  "output": "/path/to/screenshot.png"
}
```

## 输出格式

### 搜索结果
```markdown
## 搜索结果

**查询**: "OpenClaw最新功能"
**引擎**: Google, Bing
**结果数**: 10

### 相关结果

1. **OpenClaw官方文档** (相关度: 95%)
   - URL: https://openclaw.ai/docs
   - 摘要: OpenClaw是一个开源AI代理框架...

2. **OpenClaw GitHub** (相关度: 90%)
   - URL: https://github.com/openclaw/openclaw
   - 摘要: OpenClaw - 本地优先的AI代理...
```

### 抓取结果
```markdown
## 网页内容

**URL**: https://example.com/article
**标题**: OpenClaw使用指南
**抓取时间**: 2026-02-16 10:00

### 正文内容

OpenClaw是一个强大的AI代理框架...

### 图片列表
1. https://example.com/img1.png
2. https://example.com/img2.png
```

## 优势对比

| 特性 | Trae | OpenClaw | 开源 | Fusion |
|------|------|----------|------|--------|
| 多引擎搜索 | ✓ | 部分 | ✓ | ✓ |
| 网页抓取 | ✓ | ✓ | ✓ | ✓ |
| 浏览器自动化 | ✗ | ✓ | ✓ | ✓ |
| 截图功能 | ✗ | ✓ | ✓ | ✓ |
| 会话管理 | ✗ | 部分 | ✓ | ✓ |
| 表单填写 | ✗ | ✓ | ✓ | ✓ |

## 执行脚本

```bash
node ~/.openclaw/workspace/skills/fusion-browser/scripts/browser.js <action> '<json-params>'
```
