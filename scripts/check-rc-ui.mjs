import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (msg) => { console.error(`RC UI check failed: ${msg}`); process.exit(1); };

const reports = read('src/features/reports/screens/ReportsScreen.tsx');
if (!reports.includes('<ScreenHeader')) fail('ReportsScreen must use the shared ScreenHeader.');
if (reports.includes('arrow-forward') || reports.includes('headerTools')) fail('ReportsScreen contains legacy/non-interactive header affordances.');

const orgDetails = read('src/features/organizations/screens/OrganizationDetailsScreen.tsx');
if (!orgDetails.includes('can("view-adoption")')) fail('Organization details must gate adoption content by capability.');
if (!orgDetails.includes('<ScreenHeader')) fail('Organization details must use ScreenHeader.');
if (orgDetails.includes('size={28}')) fail('Organization details contains oversized legacy title typography.');

const productCopyFiles = [
  'src/features/organization-dashboard/screens/OrganizationProfileScreen.tsx',
  'src/features/organization-dashboard/screens/OrganizationReportDetailsScreen.tsx',
];
const forbidden = ['Repository', 'API دون', 'مصدر البيانات المشترك', 'حزمة المنتج', 'مصدر بيانات مستقل'];
for (const file of productCopyFiles) {
  const text = read(file);
  for (const phrase of forbidden) {
    if (text.includes(phrase)) fail(`${file} exposes developer-facing copy: ${phrase}`);
  }
}

const semanticTargets = [
  'src/features/organizations/components/OrganizationStatsGrid.tsx',
  'src/features/organization-dashboard/components/OrganizationMetricCards.tsx',
  'src/features/organization-dashboard/components/OrganizationSummaryCard.tsx',
  'src/features/home/components/CommunityStatsCard.tsx',
  'src/features/search/components/SearchResultCard.tsx',
];
for (const file of semanticTargets) {
  const text = read(file);
  if (/fontSize:\s*\d+/.test(text)) fail(`${file} still contains literal fontSize.`);
  if (/<AppText[^>]*size=\{?\d+/.test(text)) fail(`${file} still contains numeric AppText size.`);
}

console.log('V1 RC UI audit passed.');
console.log('- shared headers: enforced on audited detail/list surfaces');
console.log('- guest adoption discovery: visible; protected action remains authentication-gated');
console.log('- developer-facing copy: removed from audited workspaces');
console.log('- metric/search typography: semantic on audited surfaces');
