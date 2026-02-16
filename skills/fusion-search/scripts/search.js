const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

function semanticSearch(query, searchPath) {
    const keywords = extractKeywords(query);
    return keywordSearch(keywords, searchPath);
}

function extractKeywords(text) {
    const stopWords = ['的', '是', '在', '和', '了', '有', '我', '他', '她', '它', '这', '那', '什么', '怎么', '如何', '找到', '查找', '搜索', '代码', '文件', '函数', '类', '方法'];
    const words = text.toLowerCase().split(/\s+|(?=[A-Z])|(?<=[a-z])(?=[A-Z])/);
    return words.filter(w => w.length > 1 && !stopWords.includes(w));
}

function keywordSearch(keywords, searchPath) {
    const results = [];
    const pattern = keywords.join('|');
    try {
        const output = execSync(`rg -l "${pattern}" "${searchPath}" 2>/dev/null || true`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
        const files = output.trim().split('\n').filter(f => f);
        files.forEach(file => {
            try {
                const content = fs.readFileSync(file, 'utf-8');
                const lines = content.split('\n');
                const matches = [];
                lines.forEach((line, idx) => {
                    keywords.forEach(kw => {
                        if (line.toLowerCase().includes(kw.toLowerCase())) {
                            matches.push({ line: idx + 1, content: line.trim().substring(0, 100) });
                        }
                    });
                });
                if (matches.length > 0) {
                    results.push({ file, matches: matches.slice(0, 5), relevance: matches.length });
                }
            } catch (e) {}
        });
    } catch (e) {}
    return results.sort((a, b) => b.relevance - a.relevance);
}

function regexSearch(pattern, searchPath, filePattern = '*') {
    const results = [];
    try {
        const output = execSync(`rg -n "${pattern}" -g "${filePattern}" "${searchPath}" 2>/dev/null || true`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
        const lines = output.trim().split('\n').filter(l => l);
        lines.forEach(line => {
            const match = line.match(/^(.+?):(\d+):(.*)$/);
            if (match) {
                results.push({ file: match[1], line: parseInt(match[2]), content: match[3].trim() });
            }
        });
    } catch (e) {}
    return results;
}

function globSearch(pattern, searchPath) {
    const results = [];
    try {
        const output = execSync(`find "${searchPath}" -name "${pattern.replace(/\*\*/g, '*')}" -type f 2>/dev/null || true`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
        const files = output.trim().split('\n').filter(f => f);
        files.forEach(file => {
            try {
                const stat = fs.statSync(file);
                results.push({ file, size: stat.size, modified: stat.mtime });
            } catch (e) {}
        });
    } catch (e) {}
    return results;
}

function hybridSearch(params) {
    const { semanticQuery, keywords, path: searchPath } = params;
    const semanticKeywords = semanticQuery ? extractKeywords(semanticQuery) : [];
    const allKeywords = [...new Set([...semanticKeywords, ...(keywords || [])])];
    return keywordSearch(allKeywords, searchPath);
}

function formatResults(results, searchType) {
    let output = `## 搜索结果\n\n**搜索类型**: ${searchType}\n**匹配文件**: ${results.length}个\n\n`;
    if (results.length === 0) {
        output += '未找到匹配结果。\n';
        return output;
    }
    output += '### 相关文件\n\n';
    results.slice(0, 20).forEach((r, i) => {
        output += `${i + 1}. **${r.file}**`;
        if (r.relevance) output += ` (相关度: ${r.relevance})`;
        output += '\n';
        if (r.matches) {
            r.matches.slice(0, 3).forEach(m => {
                output += `   - 第${m.line}行: ${m.content}\n`;
            });
        } else if (r.content) {
            output += `   - 第${r.line}行: ${r.content}\n`;
        }
        output += '\n';
    });
    return output;
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('用法: node search.js <action> <params-file>');
        console.log('action: semantic | keyword | regex | glob | hybrid');
        process.exit(1);
    }
    const action = args[0];
    const paramsFile = args[1];
    let params;
    if (fs.existsSync(paramsFile)) {
        params = JSON.parse(fs.readFileSync(paramsFile, 'utf-8'));
    } else {
        params = JSON.parse(paramsFile);
    }
    let results;
    switch (action) {
        case 'semantic':
            results = semanticSearch(params.query, params.path || process.cwd());
            console.log(formatResults(results, '语义搜索'));
            break;
        case 'keyword':
            results = keywordSearch(params.query.split(/\s+/), params.path || process.cwd());
            console.log(formatResults(results, '关键词搜索'));
            break;
        case 'regex':
            results = regexSearch(params.pattern, params.path || process.cwd(), params.filePattern);
            console.log(formatResults(results, '正则搜索'));
            break;
        case 'glob':
            results = globSearch(params.pattern, params.path || process.cwd());
            console.log(formatResults(results, '文件模式匹配'));
            break;
        case 'hybrid':
            results = hybridSearch(params);
            console.log(formatResults(results, '混合搜索'));
            break;
        default:
            console.log('未知操作:', action);
    }
}

main();
