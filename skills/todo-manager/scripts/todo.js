#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TODO_FILE = path.join(process.cwd(), '.todo-list.json');

function loadTodos() {
  if (fs.existsSync(TODO_FILE)) {
    return JSON.parse(fs.readFileSync(TODO_FILE, 'utf-8'));
  }
  return { todos: [], createdAt: null, updatedAt: null };
}

function saveTodos(data) {
  data.updatedAt = new Date().toISOString();
  if (!data.createdAt) {
    data.createdAt = data.updatedAt;
  }
  fs.writeFileSync(TODO_FILE, JSON.stringify(data, null, 2));
}

function createTodos(todosJson) {
  const todos = JSON.parse(todosJson);
  const data = { todos, createdAt: null, updatedAt: null };
  saveTodos(data);
  console.log(`Created ${todos.length} tasks\n`);
  listTodos();
}

function updateTodo(id, status) {
  const data = loadTodos();
  const todo = data.todos.find(t => t.id === id);
  if (todo) {
    todo.status = status;
    saveTodos(data);
    console.log(`Updated task ${id} to ${status}\n`);
    listTodos();
  } else {
    console.log(`Task ${id} not found`);
  }
}

function completeTodo(id) {
  updateTodo(id, 'completed');
}

function listTodos() {
  const data = loadTodos();
  if (data.todos.length === 0) {
    console.log('No tasks found');
    return;
  }
  
  console.log('Task List:');
  console.log('==========\n');
  
  const statusIcons = {
    pending: '⏳',
    in_progress: '🔄',
    completed: '✅'
  };
  
  const priorityIcons = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };
  
  data.todos.forEach(todo => {
    const status = statusIcons[todo.status] || '❓';
    const priority = priorityIcons[todo.priority] || '⚪';
    console.log(`${status} ${priority} [${todo.id}] ${todo.content}`);
  });
  
  const completed = data.todos.filter(t => t.status === 'completed').length;
  const inProgress = data.todos.filter(t => t.status === 'in_progress').length;
  const pending = data.todos.filter(t => t.status === 'pending').length;
  
  console.log(`\nProgress: ${completed}/${data.todos.length} completed (${inProgress} in progress, ${pending} pending)`);
}

function clearTodos() {
  saveTodos({ todos: [], createdAt: null, updatedAt: null });
  console.log('All tasks cleared');
}

// CLI
const args = process.argv.slice(2);
const action = args[0];

switch (action) {
  case 'create':
    createTodos(args[1]);
    break;
  case 'update':
    updateTodo(args[1], args[2]);
    break;
  case 'complete':
    completeTodo(args[1]);
    break;
  case 'list':
    listTodos();
    break;
  case 'clear':
    clearTodos();
    break;
  default:
    console.log('Usage: node todo.js <action> [args]');
    console.log('Actions:');
    console.log('  create <json>  - Create task list from JSON');
    console.log('  update <id> <status> - Update task status');
    console.log('  complete <id>  - Mark task as completed');
    console.log('  list           - List all tasks');
    console.log('  clear          - Clear all tasks');
}
