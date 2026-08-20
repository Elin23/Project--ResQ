import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const failures = [];
const assert = (ok, message) => { if (!ok) failures.push(message); };

const formSection = read('src/components/ui/FormSection.tsx');
const screen = read('src/components/ui/Screen.tsx');
const input = read('src/components/ui/Input.tsx');
const adoption = read('src/features/adoption/screens/CreateAdoptionListingScreen.tsx');
const feeding = read('src/features/feeding-points/screens/CreateFeedingPointScreen.tsx');
const places = read('src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx');
const card = read('src/components/ui/Card.tsx');

assert(formSection.includes('ScreenSection') && formSection.includes('<Card'), 'FormSection must compose ScreenSection + Card.');
assert(screen.includes('compactScreenBreakpoint') && screen.includes('useWindowDimensions'), 'Screen must apply compact-device density.');
assert(input.includes('marginBottom: SPACING.sm'), 'Inputs must use compact canonical field rhythm.');
assert((adoption.match(/<FormSection/g) ?? []).length >= 6, 'Adoption form must use grouped FormSection composition.');
assert((feeding.match(/<FormSection/g) ?? []).length >= 4, 'Feeding-point form must use grouped FormSection composition.');
assert((places.match(/<FormSection/g) ?? []).length >= 5, 'Map-place form must use grouped FormSection composition.');
assert(!adoption.includes('SectionHeader'), 'Adoption create form must not mix manual SectionHeader composition.');
assert(!feeding.includes('SectionHeader'), 'Feeding-point create form must not mix manual SectionHeader composition.');
assert(!places.includes('ScreenSection'), 'Map-place create form must use the form composition primitive.');
assert(adoption.includes('<LoadingState') && adoption.includes('<ErrorState'), 'Adoption edit loading/error states must use shared states.');
assert(card.includes('const interactive = typeof props.onPress === "function"'), 'Card pressed affordance must only apply to interactive cards.');

if (failures.length) {
  console.error(`Screen composition V5 failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Screen composition V5 passed: responsive density, grouped Arabic forms, shared states, and interactive card semantics are enforced.');
