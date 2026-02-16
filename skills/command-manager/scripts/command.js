#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const COMMANDS_FILE = path.join(process.cwd(), '.commands.json');

function loadCommands() {
  if (fs.existsSync(COMMANDS_FILE)) {
    return JSON.parse(fs.readFileSync(COMMANDS_FILE, 'utf-8'));
  }
  return { commands: {} };
}

function saveCommands(data) {
  fs.writeFileSync(COMMANDS_FILE, JSON.stringify(data, null, 2));
}

function startCommand(cmd) {
  const id = `cmd_${Date.now()}`;
  
  const child = spawn(cmd, [], {
    shell: true,
    detached: true,
    stdio: 'ignore'
  });
  
  child.unref();
  
  const data = loadCommands();
  data.commands[id] = {
    id,
    command: cmd,
    pid: child.pid,
    startTime: new Date().toISOString(),
    status: 'running'
  };
  saveCommands(data);
  
  console.log(`Started command: ${id}`);
  console.log(`PID: ${child.pid}`);
  console.log(`Command: ${cmd}`);
  
  return id;
}

function checkStatus(id) {
  const data = loadCommands();
  const cmd = data.commands[id];
  
  if (!cmd) {
    console.log(`Command ${id} not found`);
    return;
  }
  
  try {
    process.kill(cmd.pid, 0);
    cmd.status = 'running';
    console.log(`Command ${id} is running`);
  } catch (e) {
    cmd.status = 'stopped';
    console.log(`Command ${id} is stopped`);
  }
  
  saveCommands(data);
  console.log(`PID: ${cmd.pid}`);
  console.log(`Started: ${cmd.startTime}`);
  console.log(`Command: ${cmd.command}`);
}

function stopCommand(id) {
  const data = loadCommands();
  const cmd = data.commands[id];
  
  if (!cmd) {
    console.log(`Command ${id} not found`);
    return;
  }
  
  try {
    process.kill(cmd.pid, 'SIGTERM');
    cmd.status = 'stopped';
    console.log(`Stopped command: ${id}`);
  } catch (e) {
    console.log(`Command ${id} already stopped`);
    cmd.status = 'stopped';
  }
  
  saveCommands(data);
}

function listCommands() {
  const data = loadCommands();
  const commands = Object.values(data.commands);
  
  if (commands.length === 0) {
    console.log('No commands found');
    return;
  }
  
  console.log('Running Commands:');
  console.log('=================\n');
  
  commands.forEach(cmd => {
    const status = cmd.status === 'running' ? '🟢' : '🔴';
    console.log(`${status} ${cmd.id}`);
    console.log(`   PID: ${cmd.pid}`);
    console.log(`   Command: ${cmd.command}`);
    console.log(`   Started: ${cmd.startTime}`);
    console.log('');
  });
}

// CLI
const args = process.argv.slice(2);
const action = args[0];

switch (action) {
  case 'start':
    startCommand(args[1]);
    break;
  case 'status':
    checkStatus(args[1]);
    break;
  case 'stop':
    stopCommand(args[1]);
    break;
  case 'list':
    listCommands();
    break;
  default:
    console.log('Usage: node command.js <action> [args]');
    console.log('Actions:');
    console.log('  start <command>  - Start a new command');
    console.log('  status <id>      - Check command status');
    console.log('  stop <id>        - Stop a command');
    console.log('  list             - List all commands');
}
