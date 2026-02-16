const fs = require('fs');
const path = require('path');

const THINKING_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'fusion-thinking.json');

function ensureThinkingFile() {
    const dir = path.dirname(THINKING_FILE);
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
    if (!fs.existsSync(THINKING_FILE)) { fs.writeFileSync(THINKING_FILE, JSON.stringify({ sessions: {} }, null, 2)); }
}

function readSessions() { ensureThinkingFile(); return JSON.parse(fs.readFileSync(THINKING_FILE, 'utf-8')); }
function writeSessions(data) { fs.writeFileSync(THINKING_FILE, JSON.stringify(data, null, 2)); }
function generateSessionId() { return `think-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; }

function think(params) {
    const { thought, thoughtNumber, totalThoughts, nextThoughtNeeded, isRevision = false, revisesThought = null, branchFromThought = null, branchId = null } = params;
    const sessions = readSessions();
    let sessionId = params.sessionId;
    if (!sessionId) {
        sessionId = generateSessionId();
        sessions.sessions[sessionId] = { thoughts: [], branches: {}, createdAt: new Date().toISOString() };
    }
    const session = sessions.sessions[sessionId];
    const thoughtEntry = { number: thoughtNumber, thought, isRevision, revisesThought, branchFromThought, branchId, timestamp: new Date().toISOString() };
    if (isRevision && revisesThought) {
        const idx = session.thoughts.findIndex(t => t.number === revisesThought);
        if (idx !== -1) { session.thoughts[idx].revised = true; session.thoughts[idx].revisedBy = thoughtNumber; }
    }
    if (branchFromThought && branchId) {
        if (!session.branches[branchId]) { session.branches[branchId] = []; }
        session.branches[branchId].push(thoughtEntry);
    }
    session.thoughts.push(thoughtEntry);
    session.lastUpdated = new Date().toISOString();
    writeSessions(sessions);
    return { sessionId, thoughtNumber, totalThoughts, nextThoughtNeeded, thought: thoughtEntry, progress: `${thoughtNumber}/${totalThoughts}`, status: nextThoughtNeeded ? 'continuing' : 'completed' };
}

function conclude(params) {
    const { sessionId, conclusion } = params;
    const sessions = readSessions();
    const session = sessions.sessions[sessionId];
    if (!session) { return { error: '会话不存在' }; }
    session.conclusion = conclusion;
    session.completedAt = new Date().toISOString();
    writeSessions(sessions);
    return { sessionId, conclusion, totalThoughts: session.thoughts.length, branches: Object.keys(session.branches).length };
}

function getSession(sessionId) {
    const sessions = readSessions();
    return sessions.sessions[sessionId] || null;
}

function formatResult(result, action) {
    let output = '## 深度思考\n\n';
    if (result.error) { output += `**错误**: ${result.error}\n`; return output; }
    if (action === 'think') {
        output += `**会话ID**: ${result.sessionId}\n`;
        output += `**进度**: ${result.progress}\n`;
        output += `**状态**: ${result.status === 'completed' ? '✅ 完成' : '🔄 进行中'}\n\n`;
        output += `### 步骤 ${result.thoughtNumber}\n\n`;
        output += `${result.thought.thought}\n`;
        if (result.thought.isRevision) { output += `\n*修正步骤 ${result.thought.revisesThought}*\n`; }
        if (result.thought.branchId) { output += `\n*分支: ${result.thought.branchId}*\n`; }
    } else if (action === 'conclude') {
        output += `**会话ID**: ${result.sessionId}\n`;
        output += `**总步骤**: ${result.totalThoughts}\n`;
        output += `**分支数**: ${result.branches}\n\n`;
        output += `### 最终结论\n\n${result.conclusion}\n`;
    }
    return output;
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) { console.log('用法: node thinking.js <action> <params-file>'); process.exit(1); }
    const action = args[0];
    const paramsFile = args[1];
    let params;
    if (fs.existsSync(paramsFile)) { params = JSON.parse(fs.readFileSync(paramsFile, 'utf-8')); }
    else { params = JSON.parse(paramsFile); }
    let result;
    switch (action) {
        case 'think': result = think(params); break;
        case 'conclude': result = conclude(params); break;
        case 'session': result = getSession(params.sessionId); break;
        default: console.log('未知操作:', action); process.exit(1);
    }
    console.log(formatResult(result, action));
}

main();
