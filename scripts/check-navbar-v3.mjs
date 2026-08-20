import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];

const navbar = read("src/components/ui/FloatingGlassTabBar.tsx");
const context = read("src/components/ui/FloatingNavigationContext.tsx");
const fab = read("src/components/ui/QuickReportFab.tsx");
const theme = read("src/theme/index.ts");
const userTabs = read("app/(user)/(tabs)/_layout.tsx");
const orgTabs = read("app/organization/(tabs)/_layout.tsx");

for (const token of [
  'direction: "rtl"',
  'Haptics.selectionAsync()',
  'NAVIGATION.activeIndicatorWidth',
  'NAVIGATION.iconSlotSize',
  'activeIndicatorHidden',
  'accessibilityRole="tab"',
  'numberOfLines={2}',
]) {
  if (!navbar.includes(token)) failures.push(`Navbar V3 missing contract: ${token}`);
}

for (const forbidden of [
  'focused && styles.iconSurface',
  'focused && styles.activeBackground',
  'right: LAYOUT.screenPadding',
]) {
  if (navbar.includes(forbidden) || fab.includes(forbidden)) failures.push(`Navbar V3 contains forbidden legacy pattern: ${forbidden}`);
}

if (!fab.includes('left: LAYOUT.screenPadding')) failures.push("Quick report FAB must mirror to the RTL action/end edge");
if (!context.includes("NAVIGATION.quickActionGap")) failures.push("FAB/navbar vertical relationship must come from NAVIGATION tokens");
if (!theme.includes("export const NAVIGATION")) failures.push("Theme must expose centralized NAVIGATION metrics");
if (!theme.includes("tabBar: 68")) failures.push("Canonical navbar height must be 68");

for (const [name, source] of [["user", userTabs], ["organization", orgTabs]]) {
  if (!source.includes("FloatingGlassTabBar")) failures.push(`${name} tabs must use the shared FloatingGlassTabBar`);
  if (!source.includes("FloatingNavigationProvider")) failures.push(`${name} tabs must use FloatingNavigationProvider`);
}

const expectedLabels = ["الرئيسية", "الخريطة", "التنبيهات", "حسابي"];
for (const label of expectedLabels) {
  if (!userTabs.includes(label)) failures.push(`User tabs missing Arabic label: ${label}`);
}

if (failures.length) {
  console.error("Navbar V3 check failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Navbar V3 check passed: Arabic RTL order, stable icons, haptic selection, shared metrics, safe FAB clearance, and one persistent component are enforced.");
