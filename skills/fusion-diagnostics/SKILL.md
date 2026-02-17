---
name: fusion-diagnostics
description: 代码诊断技能。必须实际执行诊断命令并返回结果。禁止只说计划不执行。
allowed-tools: Bash
---

# Fusion Diagnostics - 代码诊断

## ⚠️ 必须执行 - 不准只说计划

当用户要求诊断代码时，你**必须**使用exec工具**实际执行**诊断命令：

### Python诊断
```bash
python3 -m py_compile *.py 2>&1 || ruff check . 2>&1 || echo "无诊断工具"
```

### JavaScript诊断
```bash
npx eslint . 2>&1 || echo "无ESLint配置"
```

### 依赖安全检查
```bash
npm audit 2>&1 || pip check 2>&1 || echo "检查完成"
```

### 语法检查
```bash
find . -name "*.py" -exec python3 -m py_compile {} \; 2>&1 | head -20
```

## ❌ 禁止这样做

- 禁止只说"我来检查"但不执行
- 禁止只返回命令不执行
- 禁止说"检查中..."但没有结果

## ✅ 必须这样做

1. **立即执行**诊断命令
2. **返回实际诊断结果**
3. **列出发现的问题**

---

## 示例对话

**用户**: 检查代码是否有语法错误

**正确响应**:
```
执行诊断...

检查了 10 个Python文件：
- 8个文件无错误
- 2个文件有警告

警告详情：
1. main.py:23 - unused variable 'x'
2. utils.py:45 - line too long
```
