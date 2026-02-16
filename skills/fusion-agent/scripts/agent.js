const fs = require('fs');
const path = require('path');

const AGENTS_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'fusion-agents.json');

function ensureAgentsFile() {
    const dir = path.dirname(AGENTS_FILE);
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
    if (!fs.existsSync(AGENTS_FILE)) { fs.writeFileSync(AGENTS_FILE, JSON.stringify({ agents: {} }, null, 2)); }
}

function readAgents() { ensureAgentsFile(); return JSON.parse(fs.readFileSync(AGENTS_FILE, 'utf-8')); }
function writeAgents(data) { fs.writeFileSync(AGENTS_FILE, JSON.stringify(data, null, 2)); }
function generateAgentId() { return `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; }

function dispatch(params) {
    const { agent_type, description, query, response_language = 'zh-CN' } = params;
    const agentId = generateAgentId();
    const agents = readAgents();
    agents.agents[agentId] = { type: agent_type, description, query, response_language, status: 'dispatched', createdAt: new Date().toISOString(), result: null };
    writeAgents(agents);
    return { agent_id: agentId, type: agent_type, description, status: 'dispatched' };
}

function dispatchParallel(params) {
    const { agents: agentConfigs, response_language = 'zh-CN' } = params;
    const results = [];
    const agents = readAgents();
    for (const config of agentConfigs) {
        const agentId = generateAgentId();
        agents.agents[agentId] = { type: config.agent_type, description: config.description, query: config.query, response_language, status: 'dispatched', createdAt: new Date().toISOString(), result: null };
        results.push({ agent_id: agentId, type: config.agent_type, description: config.description, status: 'dispatched' });
    }
    writeAgents(agents);
    return { dispatch_id: `dispatch-${Date.now()}`, count: results.length, agents: results };
}

function delegate(params) {
    const { task, subtasks } = params;
    const delegationId = `delegate-${Date.now()}`;
    const agents = readAgents();
    const subAgentIds = [];
    for (const subtask of subtasks) {
        const agentId = generateAgentId();
        agents.agents[agentId] = { type: subtask.type, description: subtask.description, parentTask: task, delegationId, status: 'dispatched', createdAt: new Date().toISOString(), result: null };
        subAgentIds.push(agentId);
    }
    writeAgents(agents);
    return { delegation_id: delegationId, main_task: task, subtask_count: subtasks.length, agent_ids: subAgentIds, status: 'delegated' };
}

function status(agentId) {
    const agents = readAgents();
    const agent = agents.agents[agentId];
    if (!agent) { return { error: '代理不存在', agent_id: agentId }; }
    return { agent_id: agentId, type: agent.type, description: agent.description, status: agent.status, created_at: agent.createdAt, completed_at: agent.completedAt };
}

function result(agentId) {
    const agents = readAgents();
    const agent = agents.agents[agentId];
    if (!agent) { return { error: '代理不存在', agent_id: agentId }; }
    return { agent_id: agentId, type: agent.type, status: agent.status, result: agent.result || '结果尚未就绪' };
}

function listAgents(filter = {}) {
    const agents = readAgents();
    let results = Object.entries(agents.agents).map(([id, agent]) => ({ agent_id: id, ...agent }));
    if (filter.status) { results = results.filter(r => r.status === filter.status); }
    if (filter.type) { results = results.filter(r => r.type === filter.type); }
    return { count: results.length, agents: results };
}

function formatResult(result, action) {
    let output = '## 代理调度\n\n';
    if (result.error) { output += `**错误**: ${result.error}\n`; return output; }
    if (action === 'dispatch') {
        output += `**代理ID**: ${result.agent_id}\n`;
        output += `**类型**: ${result.type}\n`;
        output += `**描述**: ${result.description}\n`;
        output += `**状态**: 🔄 已调度\n`;
    } else if (action === 'dispatch-parallel') {
        output += `**调度ID**: ${result.dispatch_id}\n`;
        output += `**代理数量**: ${result.count}\n\n`;
        output += '### 代理列表\n\n';
        result.agents.forEach(a => { output += `- **${a.agent_id}**: ${a.description} (${a.status})\n`; });
    } else if (action === 'delegate') {
        output += `**委托ID**: ${result.delegation_id}\n`;
        output += `**主任务**: ${result.main_task}\n`;
        output += `**子任务数**: ${result.subtask_count}\n\n`;
        output += '### 子代理\n\n';
        result.agent_ids.forEach(id => { output += `- ${id}\n`; });
    } else if (action === 'status') {
        output += `**代理ID**: ${result.agent_id}\n`;
        output += `**类型**: ${result.type}\n`;
        output += `**状态**: ${result.status}\n`;
        output += `**创建时间**: ${result.created_at}\n`;
    } else if (action === 'result') {
        output += `**代理ID**: ${result.agent_id}\n`;
        output += `**状态**: ${result.status}\n\n`;
        output += `### 结果\n\n${result.result}\n`;
    } else if (action === 'list') {
        output += `**代理数量**: ${result.count}\n\n`;
        result.agents.forEach(a => { output += `- **${a.agent_id}**: ${a.description || a.type} (${a.status})\n`; });
    }
    return output;
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) { console.log('用法: node agent.js <action> <params-file>'); process.exit(1); }
    const action = args[0];
    const paramsFile = args[1];
    let params;
    if (fs.existsSync(paramsFile)) { params = JSON.parse(fs.readFileSync(paramsFile, 'utf-8')); }
    else { params = JSON.parse(paramsFile); }
    let result;
    switch (action) {
        case 'dispatch': result = dispatch(params); break;
        case 'dispatch-parallel': result = dispatchParallel(params); break;
        case 'delegate': result = delegate(params); break;
        case 'status': result = status(params.agent_id); break;
        case 'result': result = result(params.agent_id); break;
        case 'list': result = listAgents(params.filter); break;
        default: console.log('未知操作:', action); process.exit(1);
    }
    console.log(formatResult(result, action));
}

main();
