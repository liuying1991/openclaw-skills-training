const fs = require('fs');
const path = require('path');

const TODO_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'fusion-todo.json');

function ensureTodoFile() {
    const dir = path.dirname(TODO_FILE);
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
    if (!fs.existsSync(TODO_FILE)) { fs.writeFileSync(TODO_FILE, JSON.stringify({ todos: [], lastUpdated: new Date().toISOString() }, null, 2)); }
}

function readTodos() { ensureTodoFile(); return JSON.parse(fs.readFileSync(TODO_FILE, 'utf-8')); }
function writeTodos(data) { data.lastUpdated = new Date().toISOString(); fs.writeFileSync(TODO_FILE, JSON.stringify(data, null, 2)); }

function createTodos(todos) {
    const data = readTodos();
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    todos.forEach(todo => {
        todo.id = todo.id || `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        todo.status = todo.status || 'pending';
        todo.priority = todo.priority || 'medium';
        todo.createdAt = new Date().toISOString();
        todo.dependencies = todo.dependencies || [];
        data.todos.push(todo);
    });
    data.todos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    writeTodos(data);
    return { success: true, created: todos.length, todos: data.todos };
}

function updateTodo(id, updates) {
    const data = readTodos();
    const index = data.todos.findIndex(t => t.id === id);
    if (index === -1) {
        const newTodo = { id, ...updates, createdAt: new Date().toISOString() };
        data.todos.push(newTodo);
        writeTodos(data);
        return { success: true, todo: newTodo, created: true };
    }
    Object.assign(data.todos[index], updates);
    data.todos[index].updatedAt = new Date().toISOString();
    writeTodos(data);
    return { success: true, todo: data.todos[index] };
}

function queryTodos(filters = {}, sort = { field: 'priority', order: 'asc' }) {
    const data = readTodos();
    let results = [...data.todos];
    if (filters.status && filters.status.length > 0) { results = results.filter(t => filters.status.includes(t.status)); }
    if (filters.priority && filters.priority.length > 0) { results = results.filter(t => filters.priority.includes(t.priority)); }
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    results.sort((a, b) => {
        let aVal = sort.field === 'priority' ? priorityOrder[a.priority] : new Date(a.createdAt).getTime();
        let bVal = sort.field === 'priority' ? priorityOrder[b.priority] : new Date(b.createdAt).getTime();
        return sort.order === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return { success: true, count: results.length, todos: results };
}

function deleteTodo(id) {
    const data = readTodos();
    const index = data.todos.findIndex(t => t.id === id);
    if (index === -1) { return { success: false, error: '任务不存在' }; }
    data.todos.splice(index, 1);
    writeTodos(data);
    return { success: true };
}

function getStats() {
    const data = readTodos();
    return {
        total: data.todos.length,
        completed: data.todos.filter(t => t.status === 'completed').length,
        inProgress: data.todos.filter(t => t.status === 'in_progress').length,
        pending: data.todos.filter(t => t.status === 'pending').length,
        byPriority: {
            high: data.todos.filter(t => t.priority === 'high').length,
            medium: data.todos.filter(t => t.priority === 'medium').length,
            low: data.todos.filter(t => t.priority === 'low').length
        }
    };
}

function formatResults(result, action) {
    let output = '## 任务管理\n\n';
    if (action === 'create') { output += `**创建成功**: ${result.created}个任务\n\n`; }
    else if (action === 'update') { output += `**更新成功**: 任务 ${result.todo.id}\n\n`; }
    else if (action === 'stats') {
        output += `**总任务数**: ${result.total}\n`;
        output += `**已完成**: ${result.completed} (${result.total > 0 ? Math.round(result.completed / result.total * 100) : 0}%)\n`;
        output += `**进行中**: ${result.inProgress}\n`;
        output += `**待处理**: ${result.pending}\n\n`;
        output += '### 按优先级\n\n';
        output += `- 高优先级: ${result.byPriority.high}\n`;
        output += `- 中优先级: ${result.byPriority.medium}\n`;
        output += `- 低优先级: ${result.byPriority.low}\n`;
        return output;
    }
    if (result.todos) {
        output += '### 任务列表\n\n';
        const statusEmoji = { pending: '⏳', in_progress: '🔄', completed: '✅' };
        const priorityLabel = { high: '🔴', medium: '🟡', low: '🟢' };
        result.todos.forEach(t => {
            output += `${statusEmoji[t.status] || '⏳'} ${priorityLabel[t.priority] || ''} **${t.id}**: ${t.content}\n`;
            if (t.summary) output += `   > ${t.summary}\n`;
        });
    }
    return output;
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) { console.log('用法: node todo.js <action> <params-file>'); process.exit(1); }
    const action = args[0];
    const paramsFile = args[1];
    let params;
    if (fs.existsSync(paramsFile)) { params = JSON.parse(fs.readFileSync(paramsFile, 'utf-8')); }
    else { params = JSON.parse(paramsFile); }
    let result;
    switch (action) {
        case 'create': result = createTodos(params.todos); break;
        case 'update': result = updateTodo(params.id, params); break;
        case 'query': result = queryTodos(params.filters, params.sort); break;
        case 'delete': result = deleteTodo(params.id); break;
        case 'stats': result = getStats(); break;
        default: console.log('未知操作:', action); process.exit(1);
    }
    console.log(formatResults(result, action));
}

main();
