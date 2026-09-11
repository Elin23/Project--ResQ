import fs from 'node:fs';
import path from 'node:path';

const roots = ['src', 'app'];
const offenders = [];
const forbidden = [
  /test-fixtures\//,
  /inMemory[A-Z]/,
  /\.seed(?:\.|['"])/i,
  /feedingPoints\.mock/i,
  /mockAccounts/i,
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name === '__tests__') continue; walk(full); }
    else if (/\.(?:ts|tsx|js|jsx)$/.test(entry.name)) {
      const text = fs.readFileSync(full, 'utf8');
      for (const pattern of forbidden) {
        if (pattern.test(text)) {
          offenders.push(`${full}: ${pattern}`);
          break;
        }
      }
    }
  }
}

for (const root of roots) walk(root);
if (offenders.length) {
  console.error('Runtime mock isolation failed:');
  for (const item of offenders) console.error(`- ${item}`);
  process.exit(1);
}
console.log('Runtime mock isolation passed: src/ and app/ contain no mock/seed/in-memory dependencies.');
