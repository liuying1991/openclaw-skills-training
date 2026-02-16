const fs = require('fs');
const path = require('path');

function read(params) {
    const { path: filePath, offset = 0, limit = 2000, encoding = 'utf-8' } = params;
    if (!fs.existsSync(filePath)) { return { error: '文件不存在', path: filePath }; }
    try {
        const stat = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, encoding);
        const lines = content.split('\n');
        const totalLines = lines.length;
        const startLine = Math.max(0, offset);
        const endLine = Math.min(totalLines, startLine + limit);
        const selectedLines = lines.slice(startLine, endLine);
        let output = '';
        selectedLines.forEach((line, idx) => {
            const lineNum = (startLine + idx + 1).toString().padStart(6, ' ');
            output += `${lineNum}→${line}\n`;
        });
        return { path: filePath, size: stat.size, totalLines, displayedLines: selectedLines.length, offset: startLine, content: output, truncated: endLine < totalLines };
    } catch (e) { return { error: e.message, path: filePath }; }
}

function write(params) {
    const { path: filePath, content, backup = false } = params;
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
        if (backup && fs.existsSync(filePath)) { fs.copyFileSync(filePath, `${filePath}.backup-${Date.now()}`); }
        fs.writeFileSync(filePath, content, 'utf-8');
        return { success: true, path: filePath, size: Buffer.byteLength(content, 'utf-8'), backup: backup ? `${filePath}.backup-*` : null };
    } catch (e) { return { error: e.message, path: filePath }; }
}

function replace(params) {
    const { path: filePath, old_str, new_str } = params;
    if (!fs.existsSync(filePath)) { return { error: '文件不存在', path: filePath }; }
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        if (!content.includes(old_str)) { return { error: '未找到要替换的内容', path: filePath }; }
        const oldContent = content;
        content = content.replace(old_str, new_str);
        fs.writeFileSync(filePath, content, 'utf-8');
        return { success: true, path: filePath, replaced: true, oldLength: oldContent.length, newLength: content.length };
    } catch (e) { return { error: e.message, path: filePath }; }
}

function deleteFile(params) {
    const { paths } = params;
    const results = [];
    for (const filePath of paths) {
        try {
            if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); results.push({ path: filePath, success: true }); }
            else { results.push({ path: filePath, success: false, error: '文件不存在' }); }
        } catch (e) { results.push({ path: filePath, success: false, error: e.message }); }
    }
    return { results, deleted: results.filter(r => r.success).length };
}

function list(params) {
    const { path: dirPath, recursive = false, pattern = '*', ignore = [] } = params;
    if (!fs.existsSync(dirPath)) { return { error: '目录不存在', path: dirPath }; }
    const results = [];
    function scanDir(dir, baseDir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (ignore.includes(entry.name)) continue;
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(baseDir, fullPath);
            if (entry.isDirectory()) {
                results.push({ type: 'directory', name: entry.name, path: fullPath, relativePath });
                if (recursive) { scanDir(fullPath, baseDir); }
            } else if (entry.isFile()) {
                const stat = fs.statSync(fullPath);
                results.push({ type: 'file', name: entry.name, path: fullPath, relativePath, size: stat.size, modified: stat.mtime });
            }
        }
    }
    scanDir(dirPath, dirPath);
    return { path: dirPath, total: results.length, files: results.filter(r => r.type === 'file').length, directories: results.filter(r => r.type === 'directory').length, items: results };
}

function formatResult(result, action) {
    let output = '## 文件操作\n\n';
    if (result.error) { output += `**错误**: ${result.error}\n`; return output; }
    if (action === 'read') {
        output += `**文件**: ${result.path}\n`;
        output += `**大小**: ${(result.size / 1024).toFixed(2)} KB\n`;
        output += `**行数**: ${result.totalLines}\n`;
        output += `**显示**: 第${result.offset + 1}-${result.offset + result.displayedLines}行\n\n`;
        output += '```\n' + result.content + '```\n';
        if (result.truncated) { output += '\n*文件已截断*\n'; }
    } else if (action === 'write') {
        output += `**文件**: ${result.path}\n`;
        output += `**大小**: ${result.size} 字节\n`;
        output += `**状态**: ✅ 写入成功\n`;
    } else if (action === 'replace') {
        output += `**文件**: ${result.path}\n`;
        output += `**状态**: ✅ 替换成功\n`;
    } else if (action === 'delete') {
        output += `**删除成功**: ${result.deleted}/${result.results.length}\n`;
    } else if (action === 'list') {
        output += `**目录**: ${result.path}\n`;
        output += `**文件**: ${result.files}\n`;
        output += `**目录**: ${result.directories}\n\n`;
        result.items.slice(0, 20).forEach(item => {
            const icon = item.type === 'directory' ? '📁' : '📄';
            output += `${icon} ${item.name}\n`;
        });
    }
    return output;
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) { console.log('用法: node file.js <action> <params-file>'); process.exit(1); }
    const action = args[0];
    const paramsFile = args[1];
    let params;
    if (fs.existsSync(paramsFile)) { params = JSON.parse(fs.readFileSync(paramsFile, 'utf-8')); }
    else { params = JSON.parse(paramsFile); }
    let result;
    switch (action) {
        case 'read': result = read(params); break;
        case 'write': result = write(params); break;
        case 'replace': result = replace(params); break;
        case 'delete': result = deleteFile(params); break;
        case 'list': result = list(params); break;
        default: console.log('未知操作:', action); process.exit(1);
    }
    console.log(formatResult(result, action));
}

main();
