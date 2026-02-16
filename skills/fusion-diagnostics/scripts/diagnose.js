const fs = require('fs');
const path = require('path');

function diagnoseFile(filePath, types = ['type', 'lint', 'security']) {
    const results = { file: filePath, errors: [], warnings: [], suggestions: [] };
    if (!fs.existsSync(filePath)) {
        results.errors.push({ line: 0, message: '文件不存在', type: 'system' });
        return results;
    }
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    if (types.includes('security')) { checkSecurityIssues(filePath, content, results); }
    if (types.includes('lint')) { checkLintIssues(filePath, content, results); }
    return results;
}

function checkSecurityIssues(filePath, content, results) {
    const lines = content.split('\n');
    const securityPatterns = [
        { pattern: /eval\s*\(/, message: '使用eval()可能存在代码注入风险', severity: 'error' },
        { pattern: /innerHTML\s*=/, message: '直接设置innerHTML可能存在XSS风险', severity: 'warning' },
        { pattern: /password\s*=\s*['"]/, message: '硬编码密码', severity: 'error' },
        { pattern: /api[_-]?key\s*=\s*['"]/, message: '硬编码API密钥', severity: 'error' },
        { pattern: /secret\s*=\s*['"]/, message: '硬编码密钥', severity: 'error' },
        { pattern: /SELECT\s+.*\+/, message: '可能的SQL注入漏洞', severity: 'error' },
        { pattern: /exec\s*\(/, message: '使用exec()可能存在命令注入风险', severity: 'warning' }
    ];
    lines.forEach((line, idx) => {
        securityPatterns.forEach(({ pattern, message, severity }) => {
            if (pattern.test(line)) {
                const item = { line: idx + 1, message, type: 'security' };
                if (severity === 'error') { results.errors.push(item); }
                else { results.warnings.push(item); }
            }
        });
    });
}

function checkLintIssues(filePath, content, results) {
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (line.length > 120) {
            results.warnings.push({ line: idx + 1, message: '行长度超过120字符', type: 'lint' });
        }
        if (/\s+$/.test(line)) {
            results.warnings.push({ line: idx + 1, message: '行尾有多余空格', type: 'lint' });
        }
        if (line.includes('console.log') && !filePath.includes('test')) {
            results.suggestions.push({ line: idx + 1, message: '建议移除console.log', type: 'lint' });
        }
    });
}

function diagnoseProject(projectPath, types = ['type', 'lint', 'security'], exclude = ['node_modules', 'dist', 'build', '.git']) {
    const results = { path: projectPath, files: [], summary: { errors: 0, warnings: 0, suggestions: 0 } };
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.json'];
    function scanDir(dir) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            entries.forEach(entry => {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    if (!exclude.includes(entry.name)) { scanDir(fullPath); }
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name);
                    if (extensions.includes(ext)) {
                        const fileResult = diagnoseFile(fullPath, types);
                        if (fileResult.errors.length > 0 || fileResult.warnings.length > 0 || fileResult.suggestions.length > 0) {
                            results.files.push(fileResult);
                            results.summary.errors += fileResult.errors.length;
                            results.summary.warnings += fileResult.warnings.length;
                            results.summary.suggestions += fileResult.suggestions.length;
                        }
                    }
                }
            });
        } catch (e) {}
    }
    scanDir(projectPath);
    return results;
}

function formatResults(results) {
    let output = '## 诊断报告\n\n';
    if (results.file) {
        output += `**文件**: ${results.file}\n`;
        output += `**问题数量**: ${results.errors.length}个错误, ${results.warnings.length}个警告\n\n`;
        if (results.errors.length > 0) {
            output += '### 🔴 错误\n\n';
            results.errors.forEach((e, i) => { output += `${i + 1}. **${e.type}** (第${e.line}行)\n   - 消息: ${e.message}\n\n`; });
        }
        if (results.warnings.length > 0) {
            output += '### 🟡 警告\n\n';
            results.warnings.forEach((w, i) => { output += `${i + 1}. **${w.type}** (第${w.line}行)\n   - 消息: ${w.message}\n\n`; });
        }
    } else if (results.path) {
        output += `**项目路径**: ${results.path}\n`;
        output += `**扫描文件**: ${results.files.length}个有问题\n`;
        output += `**总错误**: ${results.summary.errors}个\n`;
        output += `**总警告**: ${results.summary.warnings}个\n`;
        output += `**总建议**: ${results.summary.suggestions}个\n\n`;
        if (results.files.length > 0) {
            output += '### 问题文件\n\n';
            results.files.slice(0, 10).forEach(f => {
                output += `- **${f.file}**: 错误${f.errors.length}, 警告${f.warnings.length}\n`;
            });
        }
    }
    return output;
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) { console.log('用法: node diagnose.js <action> <params-file>'); process.exit(1); }
    const action = args[0];
    const paramsFile = args[1];
    let params;
    try {
        let content = fs.readFileSync(paramsFile, 'utf-8');
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }
        params = JSON.parse(content);
    } catch (e) {
        console.log('## 诊断报告\n\n**错误**: 参数解析失败 - ' + e.message);
        process.exit(1);
    }
    let results;
    switch (action) {
        case 'diagnose': results = diagnoseFile(params.path, params.types); break;
        case 'diagnose-project': results = diagnoseProject(params.path, params.types, params.exclude); break;
        default: console.log('未知操作:', action); process.exit(1);
    }
    console.log(formatResults(results));
}

main();
