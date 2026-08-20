import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');
const must = (cond, msg) => { if (!cond) throw new Error(msg); };

const appText = read('src/components/ui/AppText.tsx');
const input = read('src/components/ui/Input.tsx');
const chip = read('src/components/ui/Chip.tsx');
const card = read('src/components/ui/Card.tsx');
const sectionHeader = read('src/components/ui/SectionHeader.tsx');
const confirm = read('src/components/ui/ConfirmDialog.tsx');
const selection = read('src/components/ui/SelectionSheet.tsx');
const header = read('src/components/ui/ScreenHeader.tsx');
const button = read('src/components/ui/Button.tsx');
const feedingMap = read('src/features/feeding-points/components/FeedingPointsMap.tsx');
const serviceMap = read('src/features/map/components/ServicePlacesMap.tsx');

must(appText.includes('allowFontScaling = true'), 'AppText must allow font scaling by default.');
must(appText.includes('ACCESSIBILITY.textMaxFontSizeMultiplier'), 'AppText must use shared Arabic font scaling contract.');
must(input.includes('accessibilityLabel={accessibilityLabel}'), 'Input must expose an accessibility label.');
must(input.includes('accessibilityHint={accessibilityHint}'), 'Input must expose helper/error context as an accessibility hint.');
must(input.includes('accessibilityState={{ disabled: !isEditable }}'), 'Input must expose disabled/read-only state.');
must(input.includes('COLORS.primaryStrong'), 'Input focus indication must use the strong accessible brand token.');
must(chip.includes('accessibilityState={onPress ? { selected: Boolean(selected) }'), 'Selectable chips must announce selected state.');
must(chip.includes('readableContentColor'), 'Filled chips must resolve readable foreground contrast.');
must(card.includes('accessibilityRole={interactive ?'), 'Interactive cards must inherit button semantics.');
must(sectionHeader.includes('accessibilityRole="header"'), 'Section headings must expose heading semantics.');
must(sectionHeader.includes('accessibilityRole="button"'), 'Section actions must expose button semantics.');
must(confirm.includes('AccessibilityInfo.announceForAccessibility'), 'Decision dialogs must be announced to assistive technology.');
must(confirm.includes('accessibilityViewIsModal'), 'Decision dialogs must expose modal semantics.');
must(selection.includes('accessibilityRole="radio"'), 'Selection options must use radio semantics.');
must(selection.includes('accessibilityState={{ selected }}'), 'Selection options must announce selection state.');
must(header.includes('numberOfLines={2}'), 'Arabic screen headers must tolerate enlarged text/wrapping.');
must(button.includes('backgroundColor: COLORS.primaryStrong'), 'Primary CTA must use the accessible strong brand token.');
must(feedingMap.includes('accessibilityState={{ selected: isSelected }}'), 'Feeding map pins must announce selected state.');
must(serviceMap.includes('accessibilityState={{ selected }}'), 'Service-place map pins must announce selected state.');

const roots = ['src/components', 'src/features'];
const badScaling = [];
for (const root of roots) {
  const stack = [path.join(process.cwd(), root)];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(target);
      else if (/\.(tsx|ts)$/.test(entry.name)) {
        const source = fs.readFileSync(target, 'utf8');
        if (/allowFontScaling\s*=\s*\{?false\}?/.test(source)) badScaling.push(path.relative(process.cwd(), target));
      }
    }
  }
}
must(badScaling.length === 0, `Font scaling disabled in: ${badScaling.join(', ')}`);

function luminance(hex) {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}
const pairs = [
  ['primary CTA', '#B64E00', '#FFFFFF', 4.5],
  ['secondary CTA', '#18833B', '#FFFFFF', 4.5],
  ['danger CTA', '#D32F2F', '#FFFFFF', 4.5],
  ['body text', '#1A1A1A', '#FFFFFF', 4.5],
  ['secondary text', '#4D514A', '#FFFFFF', 4.5],
  ['focus/selected brand', '#B64E00', '#FFF0E8', 3],
];
for (const [label, fg, bg, min] of pairs) {
  const value = contrast(fg, bg);
  must(value >= min, `${label} contrast ${value.toFixed(2)} is below ${min}:1.`);
}
console.log(`Accessibility V17 passed: ${pairs.length} contrast pairs, Arabic Dynamic Type, modal semantics, selected states, headings, and map controls are enforced.`);
