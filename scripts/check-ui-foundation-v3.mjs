import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const assert = (condition, message) => {
  if (!condition) {
    console.error(`UI foundation v3 failed: ${message}`);
    process.exitCode = 1;
  }
};

const theme = read('src/theme/index.ts');
const screen = read('src/components/ui/Screen.tsx');
const text = read('src/components/ui/AppText.tsx');
const rtlRow = read('src/components/ui/RtlRow.tsx');
const uiIndex = read('src/components/ui/index.ts');

assert(theme.includes('export const SCREEN_SURFACES'), 'SCREEN_SURFACES must be the canonical page-surface contract.');
assert(theme.includes('export const ARABIC_LAYOUT'), 'ARABIC_LAYOUT must define shared RTL text/layout semantics.');
assert(screen.includes('surface?: ScreenSurface'), 'Screen must expose semantic surface variants.');
assert(screen.includes('surface = "app"'), 'Normal product screens must default to the canonical app surface.');
assert(screen.includes('SCREEN_SURFACES[surface]'), 'Screen must resolve its background through semantic surface tokens.');
assert(text.includes('align = ARABIC_LAYOUT.textAlign'), 'AppText must default to Arabic logical-start alignment.');
assert(rtlRow.includes('ARABIC_LAYOUT.direction'), 'RtlRow must consume the shared Arabic direction contract.');
assert(uiIndex.includes('ScreenSection'), 'ScreenSection must be exported from the component library.');
assert(uiIndex.includes('ScreenStack'), 'ScreenStack must be exported from the component library.');

const roots = ['src', 'app'];
const files = [];
for (const base of roots) {
  const walk = (dir) => {
    for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const rel = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(rel);
      else if (/\.(tsx|ts)$/.test(entry.name)) files.push(rel);
    }
  };
  walk(base);
}

const rowReverse = files.filter((f) => read(f).includes('row-reverse'));
assert(rowReverse.length === 0, `row-reverse is forbidden in Arabic-first UI: ${rowReverse.join(', ')}`);

const legacyScreenSurface = files.filter((f) => /<Screen[\s\S]{0,240}backgroundColor=\{COLORS\.surface\}/m.test(read(f)));
assert(legacyScreenSurface.length === 0, `Screen surface must be semantic, not backgroundColor={COLORS.surface}: ${legacyScreenSurface.join(', ')}`);

if (!process.exitCode) {
  console.log('UI foundation v3 passed: semantic surfaces, Arabic alignment, RTL primitives, and canonical screen rhythm are enforced.');
}
