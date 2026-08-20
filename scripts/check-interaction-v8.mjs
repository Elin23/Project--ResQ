import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const checks = [
  ['touch target token', read('src/theme/index.ts').includes('touchTargetMin: 44')],
  ['small button touch target', read('src/theme/index.ts').includes('buttonSmall: 44')],
  ['icon button touch target', read('src/theme/index.ts').includes('iconButton: 44')],
  ['arabic button wrapping', read('src/components/ui/Button.tsx').includes('numberOfLines = 2')],
  ['screen footer support', read('src/components/ui/Screen.tsx').includes('footer?: React.ReactNode')],
  ['sticky action bar', fs.existsSync('src/components/ui/StickyActionBar.tsx')],
  ['responsive confirm dialog', read('src/components/ui/ConfirmDialog.tsx').includes('actionsNarrow')],
  ['destructive adoption confirmation', read('src/features/adoption/screens/MyAdoptionListingDetailsScreen.tsx').includes('<ConfirmDialog')],
  ['task details persistent footer', read('src/features/organization-dashboard/screens/OrganizationTaskDetailsScreen.tsx').includes('footer={<StickyActionBar>')],
  ['task completed persistent footer', read('src/features/organization-dashboard/screens/OrganizationTaskCompletedScreen.tsx').includes('footer={<StickyActionBar>')],
  ['rating 44px target', read('src/features/organization-dashboard/screens/OrganizationTaskCompletedScreen.tsx').includes('starButton: { width: 44, height: 44')],
];
const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? '✓' : '✗'} ${name}`);
if (failed.length) process.exit(1);
console.log(`Interaction ergonomics V8 passed: ${checks.length} contracts.`);
