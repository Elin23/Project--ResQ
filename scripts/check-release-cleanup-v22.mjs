import fs from 'node:fs';
import path from 'node:path';

const roots = ['app', 'src'];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const files = [];
for (const root of roots) {
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (extensions.has(path.extname(entry.name))) files.push(full);
    }
  };
  walk(root);
}

const violations = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const checks = [
    ['picsum.photos', /picsum\.photos/i],
    ['placehold.co', /placehold\.co/i],
    ['api.example.com', /api\.example\.com/i],
    ['debug console.log', /console\.log\s*\(/],
    ['visible incomplete-page copy', /هذه الصفحة غير مكتملة بعد/],
    ['visible demo-ad copy', /إعلان تجريبي/],
  ];
  for (const [label, pattern] of checks) {
    if (pattern.test(text)) violations.push(`${file}: ${label}`);
  }
}

if (violations.length) {
  console.error('Release cleanup check failed:\n' + violations.map((v) => `- ${v}`).join('\n'));
  process.exit(1);
}
console.log(`Release cleanup V22 passed: ${files.length} source files checked.`);
