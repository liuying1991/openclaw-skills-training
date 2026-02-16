#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function extractKeywords(query) {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'to', 'of',
    'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'code', 'find',
    'search', 'looking', 'want', 'need', 'get', 'show', 'list', 'all'
  ]);
  
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 5);
}

function searchCodebase(query, directory = '.') {
  const keywords = extractKeywords(query);
  const results = [];
  
  console.log(`Searching for: ${keywords.join(', ')}`);
  console.log(`Directory: ${directory}`);
  console.log('---');
  
  for (const keyword of keywords) {
    try {
      const cmd = `rg -l "${keyword}" "${directory}" --type-add 'code:*.{js,ts,py,go,java,rs,c,cpp,h,jsx,tsx,vue}' -t code 2>/dev/null || true`;
      const output = execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }).trim();
      
      if (output) {
        const files = output.split('\n');
        for (const file of files.slice(0, 10)) {
          try {
            const content = fs.readFileSync(file, 'utf-8');
            const lines = content.split('\n');
            
            lines.forEach((line, idx) => {
              if (line.toLowerCase().includes(keyword.toLowerCase())) {
                results.push({
                  file,
                  line: idx + 1,
                  content: line.trim().slice(0, 150),
                  keyword
                });
              }
            });
          } catch (e) {}
        }
      }
    } catch (e) {}
  }
  
  // Deduplicate and sort by relevance
  const seen = new Set();
  const uniqueResults = results.filter(r => {
    const key = `${r.file}:${r.line}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 30);
  
  // Output results
  console.log(`Found ${uniqueResults.length} matches:\n`);
  
  uniqueResults.forEach((r, i) => {
    console.log(`${i + 1}. ${r.file}:${r.line}`);
    console.log(`   ${r.content}`);
    console.log('');
  });
  
  return uniqueResults;
}

// CLI
const args = process.argv.slice(2);
let query = '';
let directory = '.';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir' || args[i] === '-d') {
    directory = args[++i];
  } else if (!args[i].startsWith('-')) {
    query = args[i];
  }
}

if (!query) {
  console.log('Usage: node search.js <query> [--dir <directory>]');
  console.log('Example: node search.js "user authentication" --dir ./src');
  process.exit(1);
}

searchCodebase(query, directory);
