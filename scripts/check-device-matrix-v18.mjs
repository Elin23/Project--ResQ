import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const fail = (msg) => { console.error(`Device Matrix V18 failed: ${msg}`); process.exitCode = 1; };

const representativeRoutes = [
  'app/(user)/(tabs)/(home)/index.tsx',
  'app/(user)/(tabs)/(home)/reports/index.tsx',
  'app/(user)/(tabs)/(adoption)/adoption.tsx',
  'app/(user)/(tabs)/(map)/map.tsx',
  'app/(user)/(tabs)/(profile)/profile.tsx',
  'app/(user)/(tabs)/(adoption)/adoptions.tsx',
  'app/(user)/(tabs)/(adoption)/adoptions/[id].tsx',
  'app/adoptions/create.tsx',
  'app/(user)/(tabs)/(home)/donations/index.tsx',
  'app/(user)/(tabs)/(home)/donations/[id]/index.tsx',
  'app/feeding-points/create.tsx',
  'app/map-places/index.tsx',
  'app/map-places/apply.tsx',
  'app/organization/(tabs)/(home)/index.tsx',
  'app/organization/(tabs)/(tasks)/tasks/index.tsx',
  'app/organization/(tabs)/(tasks)/tasks/[id]/completed.tsx',
  'app/(auth)/login.tsx',
  'app/(auth)/register-user.tsx',
  'app/(auth)/register-entity.tsx',
];
for (const route of representativeRoutes) if (!exists(route)) fail(`missing representative route ${route}`);

const responsive = read('src/components/ui/useResponsiveLayout.ts');
if (!responsive.includes('narrowScreenBreakpoint') || !responsive.includes('compactScreenBreakpoint') || !responsive.includes('shortScreenBreakpoint')) {
  fail('shared responsive hook must expose narrow, compact, and short contracts');
}

const screen = read('src/components/ui/Screen.tsx');
if (!screen.includes('compactScreenPadding') || !screen.includes('contentMaxWidth') || !screen.includes('KeyboardAvoidingView')) {
  fail('Screen must retain compact phone padding, tablet max width, and keyboard handling');
}

const appText = read('src/components/ui/AppText.tsx');
if (!appText.includes('allowFontScaling') || !appText.includes('maxFontSizeMultiplier')) fail('AppText must retain Dynamic Type support');

const files = [];
for (const base of ['src/features', 'src/components']) {
  const walk = (dir) => {
    for (const name of fs.readdirSync(path.join(root, dir))) {
      const rel = path.join(dir, name);
      const st = fs.statSync(path.join(root, rel));
      if (st.isDirectory()) walk(rel);
      else if (/\.(tsx|ts)$/.test(name)) files.push(rel);
    }
  };
  walk(base);
}
for (const file of files) {
  const code = read(file);
  if (code.includes('numberOfLines={1}')) fail(`${file} reintroduced single-line truncation for Arabic UI`);
  if (/\bwidth:\s*(?:320|360|390)\b/.test(code)) fail(`${file} hardcodes a target phone width`);
}

for (const file of [
  'src/features/home/components/ActiveReportCard.tsx',
  'src/features/home/components/NearbyReportCard.tsx',
  'src/features/home/components/HomeAdoptionCard.tsx',
  'src/features/organizations/components/OrganizationCard.tsx',
  'src/features/organization-dashboard/components/OrganizationMetricCards.tsx',
]) {
  if (!read(file).includes('useResponsiveLayout')) fail(`${file} must participate in the shared device matrix`);
}

for (const file of [
  'src/features/adoption/screens/CreateAdoptionListingScreen.tsx',
  'src/features/feeding-points/screens/CreateFeedingPointScreen.tsx',
  'src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx',
]) {
  const code = read(file);
  if (!code.includes('footer=') && !code.includes('footer={')) fail(`${file} must retain a sticky form action footer`);
}

if (!process.exitCode) console.log(`Device Matrix V18 passed: ${representativeRoutes.length} representative routes + ${files.length} feature/component files audited for 320/360/390/tablet contracts.`);
