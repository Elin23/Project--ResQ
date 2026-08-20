import fs from 'node:fs';
import path from 'node:path';

const roots = ['src', 'app'];
const files = [];
for (const root of roots) walk(root);

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
}

const failures = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const imports = [...text.matchAll(/^\s*import\b[^;]*?\bfrom\s+["']([^"']+)["']\s*;/gms)].map((match) => match[1]);
  const seen = new Set();
  for (const source of imports) {
    if (seen.has(source)) failures.push(`${file}: duplicate import source ${source}`);
    seen.add(source);
  }
}

const mustContain = [
  ['src/features/auth/types/registerEntity.ts', 'export type RegisterEntityErrors'],
  ['src/features/auth/types/registerEntity.ts', 'export type RegisterEntityChipOption'],
  ['src/features/auth/types/registerEntity.ts', 'export type RegisterEntityUploadKey'],
  ['src/features/auth/types/registerEntity.ts', 'export type EntityLocation'],
  ['src/features/feeding-points/components/ReportIssueSheet.tsx', 'import ActionStack'],
  ['src/features/reports/components/ReportCard.tsx', 'assigned:'],
  ['src/features/explore/screens/ExploreScreen.tsx', 'adoptionRoute'],
  ['src/features/explore/screens/ExploreScreen.tsx', 'useSession'],
  ['src/components/ui/ConfirmDialog.tsx', 'import { useResponsiveLayout }'],
  ['src/components/ui/UnsavedChangesDialog.tsx', 'import { useResponsiveLayout }'],
];
for (const [file, needle] of mustContain) {
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes(needle)) failures.push(`${file}: missing ${needle}`);
}

const mustNotContain = [
  ['src/features/adoption/screens/CreateAdoptionListingScreen.tsx', 'const useCurrentLocation'],
  ['src/features/feeding-points/screens/CreateFeedingPointScreen.tsx', 'const useCurrentLocation'],
  ['src/features/public/screens/PrivacyPolicyScreen.tsx', 'styles.topBarButton'],
  ['src/features/donations/screens/CreateDonationCampaignScreen.tsx', '!account.kind === "organization"'],
  ['src/data/repositories/inMemoryMapPlaceApplicationRepository.ts', 'import type { validateMapPlaceDraft'],
];
for (const [file, needle] of mustNotContain) {
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes(needle)) failures.push(`${file}: forbidden stale pattern ${needle}`);
}

if (fs.existsSync('app.json')) failures.push('app.json must not coexist with app.config.js');
if (!fs.existsSync('app.config.js')) failures.push('app.config.js missing');

if (failures.length) {
  console.error('Source Health V19 failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Source Health V19 passed: ${files.length} TS/TSX files, no duplicate imports or known Package 78 regression signatures.`);
