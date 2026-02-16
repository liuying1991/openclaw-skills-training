#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getDiagnostics(options = {}) {
  const { file, type = 'all' } = options;
  const diagnostics = [];
  
  // Check for TypeScript project
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  const hasTypeScript = fs.existsSync(tsconfigPath);
  
  if (hasTypeScript) {
    try {
      const cmd = file 
        ? `npx tsc --noEmit --pretty false "${file}" 2>&1 || true`
        : `npx tsc --noEmit --pretty false 2>&1 || true`;
      
      const output = execSync(cmd, { 
        encoding: 'utf-8', 
        maxBuffer: 10 * 1024 * 1024,
        cwd: process.cwd()
      });
      
      const lines = output.split('\n');
      for (const line of lines) {
        const match = line.match(/^(.+?)\((\d+),(\d+)\):\s*(error|warning)\s*(.+)$/);
        if (match) {
          const [, filePath, lineNum, col, severity, message] = match;
          
          if (type === 'all' || type === severity) {
            diagnostics.push({
              file: filePath,
              line: parseInt(lineNum),
              column: parseInt(col),
              severity,
              message
            });
          }
        }
      }
    } catch (e) {
      // TypeScript might not be available
    }
  }
  
  // Check for ESLint
  try {
    const eslintCmd = file
      ? `npx eslint --format compact "${file}" 2>&1 || true`
      : `npx eslint --format compact . 2>&1 || true`;
    
    const eslintOutput = execSync(eslintCmd, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
      cwd: process.cwd()
    });
    
    const lines = eslintOutput.split('\n');
    for (const line of lines) {
      const match = line.match(/^(.+?): line (\d+), col \d+, (Error|Warning) - (.+)$/);
      if (match) {
        const [, filePath, lineNum, severity, message] = match;
        const sev = severity.toLowerCase();
        
        if (type === 'all' || type === sev) {
          diagnostics.push({
            file: filePath,
            line: parseInt(lineNum),
            severity: sev,
            message
          });
        }
      }
    }
  } catch (e) {
    // ESLint might not be available
  }
  
  return diagnostics;
}

// CLI
const args = process.argv.slice(2);
const options = { file: null, type: 'all' };

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--file' || args[i] === '-f') {
    options.file = args[++i];
  } else if (args[i] === '--type' || args[i] === '-t') {
    options.type = args[++i];
  }
}

console.log('Running diagnostics...\n');

const results = getDiagnostics(options);

const errors = results.filter(d => d.severity === 'error');
const warnings = results.filter(d => d.severity === 'warning');

console.log(`Found ${errors.length} errors and ${warnings.length} warnings\n`);

if (results.length > 0) {
  results.forEach((d, i) => {
    const icon = d.severity === 'error' ? '❌' : '⚠️';
    console.log(`${icon} ${d.file}:${d.line}`);
    console.log(`   ${d.message}`);
    console.log('');
  });
}

process.exit(errors.length > 0 ? 1 : 0);
