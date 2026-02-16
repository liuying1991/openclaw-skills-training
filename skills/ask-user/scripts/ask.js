#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askUser(question, options, defaultOption = null) {
  return new Promise((resolve) => {
    console.log(`\n${question}`);
    console.log('---\n');
    
    options.forEach((opt, i) => {
      const isDefault = defaultOption && opt.label === defaultOption;
      console.log(`  ${i + 1}. ${opt.label}${isDefault ? ' (default)' : ''}`);
      if (opt.description) {
        console.log(`     ${opt.description}`);
      }
    });
    
    console.log('');
    
    const defaultNum = defaultOption 
      ? options.findIndex(o => o.label === defaultOption) + 1 
      : null;
    
    rl.question(`Enter choice [1-${options.length}]${defaultNum ? ` (default: ${defaultNum})` : ''}: `, (answer) => {
      rl.close();
      
      if (!answer && defaultNum) {
        resolve(options[defaultNum - 1]);
        return;
      }
      
      const num = parseInt(answer);
      if (num >= 1 && num <= options.length) {
        resolve(options[num - 1]);
      } else {
        console.log('Invalid choice, using first option');
        resolve(options[0]);
      }
    });
  });
}

// CLI
const args = process.argv.slice(2);
let question = '';
let optionsStr = '';
let defaultOption = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--default' || args[i] === '-d') {
    defaultOption = args[++i];
  } else if (!question) {
    question = args[i];
  } else {
    optionsStr = args[i];
  }
}

if (!question || !optionsStr) {
  console.log('Usage: node ask.js <question> <options> [--default <option>]');
  console.log('Example: node ask.js "Choose language" "Python,JavaScript,Go" --default Python');
  process.exit(1);
}

const options = optionsStr.split(',').map(opt => ({
  label: opt.trim(),
  description: ''
}));

askUser(question, options, defaultOption).then(result => {
  console.log(`\nYou selected: ${result.label}`);
  // Output as JSON for programmatic use
  console.log(`\n__RESULT__: ${JSON.stringify(result)}`);
});
