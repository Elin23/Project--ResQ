import fs from 'node:fs';

const failures = [];
const read = (file) => fs.readFileSync(file, 'utf8');
const must = (file, token, label) => { if (!read(file).includes(token)) failures.push(`${file}: missing ${label}`); };
const mustNot = (file, token, label) => { if (read(file).includes(token)) failures.push(`${file}: forbidden ${label}`); };

must('src/theme/index.ts', 'surface: PALETTE.neutral0', 'white canonical surface');
must('src/components/ui/ScreenHeader.tsx', 'elevated?: boolean', 'scroll elevation contract');
must('src/components/ui/Screen.tsx', 'stickyHeaderIndices={resolvedStickyHeaders}', 'sticky shared header');
must('src/components/ui/FloatingGlassTabBar.tsx', 'privacy-policy|terms-and-conditions', 'legal-page navbar suppression');
must('src/features/map/screens/MapScreen.tsx', 'هل لديك جهة تهم محبي الحيوانات؟', 'map-place invitation');
must('src/features/map/screens/MapScreen.tsx', 'ROUTES.mapPlaceApply', 'map-place application route');
must('src/features/map/components/PlacePreviewCard.tsx', 'acceptsFreeCases', 'conditional free-case preview');
must('src/features/map/screens/ServicePlaceDetailsScreen.tsx', 'ساعات العمل', 'opening hours details');
must('src/components/ui/ToggleField.tsx', 'مفعّل', 'explicit toggle on state');
must('src/components/ui/ToggleField.tsx', 'غير مفعّل', 'explicit toggle off state');
must('src/features/auth/screens/RegistrationPendingScreen.tsx', 'فتح مركز الإشعارات', 'pending organization notifications entry');
must('app/(user)/_layout.tsx', 'principal.account.status !== "pending"', 'pending organization browse shell');
must('app/(user)/(tabs)/_layout.tsx', 'isPendingOrganization', 'pending organization limited tabs');

for (const root of ['src']) {
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = `${current}/${entry.name}`;
      if (entry.isDirectory()) stack.push(full);
      else if (/\.(ts|tsx)$/.test(entry.name)) {
        const text = read(full);
        if (/\baspect\s*:\s*\[[^\]]+\]/.test(text) && text.includes('ImagePicker')) failures.push(`${full}: image picker still forces crop aspect`);
      }
    }
  }
}

if (failures.length) {
  console.error('Shell/Map UX V20 failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Shell/Map UX V20 passed: white surfaces, sticky scroll header, legal/form navbar suppression, map-place CTA/details, explicit toggles, uncropped uploads, and pending-organization notification access are enforced.');
