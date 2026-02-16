const fs = require('fs');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

function getWslIp() {
    try {
        const output = execSync('wsl -e bash -c "hostname -I"', { encoding: 'utf-8' });
        return output.trim().split(' ')[0];
    } catch (e) { return null; }
}

function fetchUrl(url, timeout = 15000) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const timer = setTimeout(() => {
            reject(new Error('请求超时'));
        }, timeout);
        client.get(url, { timeout }, (res) => {
            clearTimeout(timer);
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', (e) => {
            clearTimeout(timer);
            reject(e);
        });
    });
}

async function search(params) {
    const { query, engines = ['google'], num = 10 } = params;
    const results = [];
    const wslIp = getWslIp();
    if (wslIp) {
        try {
            const searchUrl = `http://${wslIp}:8080/search?q=${encodeURIComponent(query)}&format=json&engines=${engines.join(',')}`;
            const response = await fetchUrl(searchUrl);
            const data = JSON.parse(response);
            if (data.results) {
                data.results.slice(0, num).forEach(r => {
                    results.push({ title: r.title, url: r.url, snippet: r.content, engine: r.engine });
                });
            }
        } catch (e) {}
    }
    if (results.length === 0) {
        results.push({ title: `搜索: ${query}`, url: `https://www.google.com/search?q=${encodeURIComponent(query)}`, snippet: '请手动访问搜索引擎查看结果', engine: 'fallback' });
    }
    return { query, engines, count: results.length, results };
}

async function fetch(params) {
    const { url, extract = ['title', 'content'] } = params;
    try {
        const html = await fetchUrl(url);
        const result = { url, extracted: {} };
        if (extract.includes('title')) {
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            result.extracted.title = titleMatch ? titleMatch[1].trim() : '无标题';
        }
        if (extract.includes('content')) {
            let content = html
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
                .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            result.extracted.content = content.substring(0, 5000);
        }
        if (extract.includes('images')) {
            const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
            result.extracted.images = [...imgMatches].map(m => m[1]).slice(0, 10);
        }
        return result;
    } catch (e) {
        return { url, error: e.message, extracted: { title: '获取失败', content: e.message } };
    }
}

function formatResult(result, action) {
    let output = '## 浏览器操作\n\n';
    if (action === 'search') {
        output += `**查询**: ${result.query}\n`;
        output += `**引擎**: ${result.engines.join(', ')}\n`;
        output += `**结果数**: ${result.count}\n\n`;
        output += '### 搜索结果\n\n';
        result.results.forEach((r, i) => { output += `${i + 1}. **${r.title}**\n   - URL: ${r.url}\n   - 摘要: ${r.snippet}\n\n`; });
    } else if (action === 'fetch') {
        output += `**URL**: ${result.url}\n\n`;
        if (result.extracted.title) output += `**标题**: ${result.extracted.title}\n\n`;
        if (result.extracted.content) output += `### 内容\n\n${result.extracted.content.substring(0, 2000)}\n`;
        if (result.error) output += `\n**错误**: ${result.error}\n`;
    }
    return output;
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) { console.log('用法: node browser.js <action> <params-file>'); process.exit(1); }
    const action = args[0];
    const paramsFile = args[1];
    let params;
    if (fs.existsSync(paramsFile)) { params = JSON.parse(fs.readFileSync(paramsFile, 'utf-8')); }
    else { params = JSON.parse(paramsFile); }
    let result;
    switch (action) {
        case 'search': result = await search(params); break;
        case 'fetch': result = await fetch(params); break;
        default: console.log('未知操作:', action); process.exit(1);
    }
    console.log(formatResult(result, action));
}

main();
