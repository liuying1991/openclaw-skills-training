const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

const COMMANDS_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'fusion-commands.json');

function ensureCommandsFile() {
    const dir = path.dirname(COMMANDS_FILE);
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
    if (!fs.existsSync(COMMANDS_FILE)) { fs.writeFileSync(COMMANDS_FILE, JSON.stringify({ commands: {} }, null, 2)); }
}

function readCommands() { ensureCommandsFile(); return JSON.parse(fs.readFileSync(COMMANDS_FILE, 'utf-8')); }
function writeCommands(data) { fs.writeFileSync(COMMANDS_FILE, JSON.stringify(data, null, 2)); }
function generateCommandId() { return `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; }

function runCommand(params) {
    const { command, blocking = true, timeout = 60000, cwd, command_type = 'other' } = params;
    const commandId = generateCommandId();
    
    if (blocking) {
        return new Promise((resolve) => {
            exec(command, { cwd: cwd || process.cwd(), timeout, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
                resolve({
                    command_id: commandId,
                    command,
                    status: error ? 'failed' : 'completed',
                    exit_code: error ? error.code : 0,
                    stdout: stdout.toString(),
                    stderr: stderr.toString()
                });
            });
        });
    } else {
        const child = spawn('cmd.exe', ['/c', command], { cwd: cwd || process.cwd(), detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
        const commands = readCommands();
        commands.commands[commandId] = {
            command, command_type, status: 'running', pid: child.pid,
            cwd: cwd || process.cwd(), startedAt: new Date().toISOString(), output: []
        };
        writeCommands(commands);
        child.stdout.on('data', (data) => {
            const cmds = readCommands();
            if (cmds.commands[commandId]) {
                cmds.commands[commandId].output.push({ type: 'stdout', data: data.toString(), time: new Date().toISOString() });
                writeCommands(cmds);
            }
        });
        child.on('close', (code) => {
            const cmds = readCommands();
            if (cmds.commands[commandId]) {
                cmds.commands[commandId].status = 'completed';
                cmds.commands[commandId].exitCode = code;
                cmds.commands[commandId].completedAt = new Date().toISOString();
                writeCommands(cmds);
            }
        });
        return { command_id: commandId, command, status: 'running', pid: child.pid, command_type };
    }
}

function checkStatus(commandId) {
    const commands = readCommands();
    const cmd = commands.commands[commandId];
    if (!cmd) { return { error: '命令不存在', command_id: commandId }; }
    return { command_id: commandId, command: cmd.command, status: cmd.status, pid: cmd.pid, exit_code: cmd.exitCode, started_at: cmd.startedAt, completed_at: cmd.completedAt, command_type: cmd.command_type };
}

function getOutput(commandId, lines = 100) {
    const commands = readCommands();
    const cmd = commands.commands[commandId];
    if (!cmd) { return { error: '命令不存在', command_id: commandId }; }
    let output = (cmd.output || []).slice(-lines);
    return { command_id: commandId, status: cmd.status, output: output.map(o => o.data).join('') };
}

function stopCommand(commandId) {
    const commands = readCommands();
    const cmd = commands.commands[commandId];
    if (!cmd) { return { error: '命令不存在', command_id: commandId }; }
    if (cmd.status !== 'running') { return { error: '命令未在运行', command_id: commandId, status: cmd.status }; }
    try {
        process.kill(cmd.pid, 'SIGTERM');
        cmd.status = 'stopped';
        cmd.stoppedAt = new Date().toISOString();
        writeCommands(commands);
        return { success: true, command_id: commandId, status: 'stopped' };
    } catch (e) { return { error: '无法终止进程', command_id: commandId, message: e.message }; }
}

function listCommands(filter = {}) {
    const commands = readCommands();
    let results = Object.entries(commands.commands).map(([id, cmd]) => ({ command_id: id, ...cmd }));
    if (filter.status) { results = results.filter(r => r.status === filter.status); }
    if (filter.type) { results = results.filter(r => r.command_type === filter.type); }
    return { count: results.length, commands: results };
}

function formatResult(result, action) {
    let output = '## 命令执行\n\n';
    if (result.error) { output += `**错误**: ${result.error}\n`; return output; }
    if (action === 'run') {
        output += `**命令ID**: ${result.command_id}\n`;
        output += `**命令**: ${result.command}\n`;
        output += `**状态**: ${result.status}\n`;
        if (result.pid) output += `**PID**: ${result.pid}\n`;
        if (result.stdout) output += `\n### 输出\n\`\`\`\n${result.stdout}\n\`\`\`\n`;
    } else if (action === 'status') {
        output += `**命令ID**: ${result.command_id}\n`;
        output += `**状态**: ${result.status}\n`;
        output += `**启动时间**: ${result.started_at}\n`;
    } else if (action === 'output') {
        output += `**命令ID**: ${result.command_id}\n`;
        output += `**状态**: ${result.status}\n`;
        output += `\n### 输出\n\`\`\`\n${result.output}\n\`\`\`\n`;
    } else if (action === 'list') {
        output += `**命令数量**: ${result.count}\n\n`;
        result.commands.forEach(cmd => { output += `- **${cmd.command_id}**: ${cmd.command} (${cmd.status})\n`; });
    }
    return output;
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) { console.log('用法: node command.js <action> <params-file>'); process.exit(1); }
    const action = args[0];
    const paramsFile = args[1];
    let params;
    if (fs.existsSync(paramsFile)) { params = JSON.parse(fs.readFileSync(paramsFile, 'utf-8')); }
    else { params = JSON.parse(paramsFile); }
    let result;
    switch (action) {
        case 'run': result = await runCommand(params); break;
        case 'status': result = checkStatus(params.command_id); break;
        case 'output': result = getOutput(params.command_id, params.lines); break;
        case 'stop': result = stopCommand(params.command_id); break;
        case 'list': result = listCommands(params.filter); break;
        default: console.log('未知操作:', action); process.exit(1);
    }
    console.log(formatResult(result, action));
}

main();
