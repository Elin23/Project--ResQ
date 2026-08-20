import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const failures = [];
const header = read("src/components/ui/ScreenHeader.tsx");
const topBar = read("src/components/ui/TopBar.tsx");

const requireText = (source, needle, message) => {
  if (!source.includes(needle)) failures.push(message);
};

requireText(header, 'direction: "rtl"', "ScreenHeader must declare RTL at container level.");
requireText(header, 'borderBottomWidth: StyleSheet.hairlineWidth', "ScreenHeader must use the shared bottom separator.");
requireText(header, 'horizontalPadding = LAYOUT.screenPadding', "ScreenHeader must default to the canonical page gutter.");
requireText(header, 'width: "100%"', "ScreenHeader must own the full width supplied by its page.");
requireText(topBar, 'paddingHorizontal: LAYOUT.screenPadding', "TopBar must use the same canonical page gutter.");
requireText(topBar, 'borderBottomWidth: StyleSheet.hairlineWidth', "TopBar must share the same separator language.");

const screens = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx$/.test(entry.name)) screens.push(full);
  }
};
walk(path.join(root, "src/features"));

for (const full of screens) {
  const rel = path.relative(root, full).replaceAll("\\", "/");
  const source = fs.readFileSync(full, "utf8");
  if (source.includes("<ScreenHeader") && /marginHorizontal\s*:\s*-/.test(source)) {
    failures.push(`${rel}: ScreenHeader pages may not use negative horizontal margins.`);
  }
  if (source.includes("<ScreenHeader") && /marginTop\s*:\s*-/.test(source)) {
    // tolerate image/logo overlaps unrelated to the header only when there is no header style token.
    const headerStyleNegative = /header\s*:\s*\{[^}]*marginTop\s*:\s*-/s.test(source);
    if (headerStyleNegative) failures.push(`${rel}: header style may not use negative top margins.`);
  }
}

const requiredCanonical = [
  "src/features/reports/screens/ReportsScreen.tsx",
  "src/features/reports/components/ReportDetailsScreen.tsx",
  "src/features/notifications/screens/NotificationsScreen.tsx",
  "src/features/search/screens/SearchScreen.tsx",
  "src/features/map/screens/MapScreen.tsx",
  "src/features/organization-dashboard/screens/OrganizationReportsScreen.tsx",
  "src/features/organizations/screens/OrganizationsScreen.tsx",
  "src/features/organizations/screens/OrganizationDetailsScreen.tsx",
];
for (const rel of requiredCanonical) {
  if (!read(rel).includes("<ScreenHeader")) failures.push(`${rel}: must use ScreenHeader V2.`);
}

const notifications = read("src/features/notifications/screens/NotificationsScreen.tsx");
if (notifications.includes('onPress={() => undefined}')) failures.push("Notifications header still contains a fake action.");

const reports = read("src/features/reports/screens/ReportsScreen.tsx");
if (reports.includes("marginHorizontal: -SPACING") || reports.includes("marginTop: -SPACING")) failures.push("Reports header still uses legacy negative margins.");

const search = read("src/features/search/screens/SearchScreen.tsx");
if (!search.includes('edges={["top", "left", "right"]}')) failures.push("Search header must own the top safe area.");

if (failures.length) {
  console.error("Unified Header V2 check failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`Unified Header V2 check passed: ${requiredCanonical.length} critical reading surfaces use the canonical header; no legacy negative header margins remain.`);
