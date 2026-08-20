import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoots = ["src", "app"];
const files = [];

function walk(dir) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return;
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel);
    else if (entry.isFile() && [".ts", ".tsx"].includes(path.extname(entry.name))) files.push(rel.replaceAll("\\", "/"));
  }
}
sourceRoots.forEach(walk);

const failures = [];
let rowCount = 0;
let rtlRows = 0;
let ltrRows = 0;
let logicalSpacingCount = 0;

function objectBounds(source, index) {
  const stack = [];
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = 0; i < index; i += 1) {
    const char = source[i];
    const next = source[i + 1];
    if (lineComment) { if (char === "\n") lineComment = false; continue; }
    if (blockComment) { if (char === "*" && next === "/") { blockComment = false; i += 1; } continue; }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "/") { lineComment = true; i += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; i += 1; continue; }
    if (char === '"' || char === "'" || char === "`") { quote = char; continue; }
    if (char === "{") stack.push(i);
    else if (char === "}" && stack.length) stack.pop();
  }
  if (!stack.length) return null;
  const start = stack.at(-1);

  let depth = 0;
  quote = null; escaped = false; lineComment = false; blockComment = false;
  for (let i = start; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];
    if (lineComment) { if (char === "\n") lineComment = false; continue; }
    if (blockComment) { if (char === "*" && next === "/") { blockComment = false; i += 1; } continue; }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "/") { lineComment = true; i += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; i += 1; continue; }
    if (char === '"' || char === "'" || char === "`") { quote = char; continue; }
    if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) return [start, i + 1];
    }
  }
  return [start, source.length];
}

for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), "utf8");

  if (/flexDirection\s*:\s*["']row-reverse["']/.test(source)) {
    failures.push(`${file}: row-reverse is forbidden across the complete TS/TSX surface.`);
  }

  for (const match of source.matchAll(/flexDirection\s*:\s*["']row["']/g)) {
    rowCount += 1;
    const bounds = objectBounds(source, match.index ?? 0);
    if (!bounds) {
      failures.push(`${file}: could not classify a horizontal row contract.`);
      continue;
    }
    const objectSource = source.slice(bounds[0], bounds[1]);
    if (/direction\s*:\s*(?:["']rtl["']|ARABIC_LAYOUT\.direction)/.test(objectSource)) rtlRows += 1;
    else if (/direction\s*:\s*["']ltr["']/.test(objectSource)) ltrRows += 1;
    else {
      const line = source.slice(0, match.index ?? 0).split(/\r?\n/).length;
      failures.push(`${file}:${line}: horizontal row must declare direction: \"rtl\" or \"ltr\" in the same style object.`);
    }
  }

  const physicalSemantic = source.match(/\b(?:marginLeft|marginRight|paddingLeft|paddingRight)\s*:/g) || [];
  if (physicalSemantic.length && file !== "src/features/organization-dashboard/screens/OrganizationDashboardScreen.tsx") {
    failures.push(`${file}: semantic horizontal spacing must use marginStart/marginEnd/paddingStart/paddingEnd.`);
  }
  logicalSpacingCount += (source.match(/\b(?:marginStart|marginEnd|paddingStart|paddingEnd)\s*:/g) || []).length;

  if (source.includes("<ScreenHeader") && /marginHorizontal\s*:\s*-/.test(source)) {
    failures.push(`${file}: ScreenHeader pages may not compensate header width with negative horizontal margins.`);
  }
}

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const header = read("src/components/ui/ScreenHeader.tsx");
for (const [needle, message] of [
  ['horizontalPadding = LAYOUT.screenPadding', "ScreenHeader must default to the canonical page gutter."],
  ['direction: "rtl"', "ScreenHeader must own the RTL ordering contract."],
  ['borderBottomWidth: StyleSheet.hairlineWidth', "ScreenHeader must use the shared separator."],
  ['width: "100%"', "ScreenHeader must span the page width supplied by the screen shell."],
]) if (!header.includes(needle)) failures.push(message);

const sharedLogicalStart = [
  "src/components/ui/StatusBadge.tsx",
  "src/components/ui/Chip.tsx",
];
for (const rel of sharedLogicalStart) {
  const source = read(rel);
  if (!source.includes('alignSelf: "flex-start"')) failures.push(`${rel}: compact semantic elements must default to Arabic logical start, not flex-end.`);
}

const requiredHeaders = [
  "src/features/reports/screens/ReportsScreen.tsx",
  "src/features/reports/components/ReportDetailsScreen.tsx",
  "src/features/notifications/screens/NotificationsScreen.tsx",
  "src/features/search/screens/SearchScreen.tsx",
  "src/features/map/screens/MapScreen.tsx",
  "src/features/organizations/screens/OrganizationsScreen.tsx",
  "src/features/organizations/screens/OrganizationDetailsScreen.tsx",
  "src/features/adoption/screens/AdoptionScreen.tsx",
  "src/features/organization-dashboard/screens/OrganizationReportsScreen.tsx",
  "src/features/organization-dashboard/screens/OrganizationReportDetailsScreen.tsx",
  "src/features/organization-dashboard/screens/OrganizationTasksScreen.tsx",
  "src/features/organization-dashboard/screens/OrganizationProfileScreen.tsx",
];
for (const rel of requiredHeaders) {
  if (!read(rel).includes("<ScreenHeader")) failures.push(`${rel}: reading/workspace surface must use the canonical ScreenHeader.`);
}

const nav = read("src/components/ui/FloatingGlassTabBar.tsx");
if (/iconSurfaceActive|backgroundColor:\s*COLORS\.glassActive/.test(nav)) failures.push("FloatingGlassTabBar: active state may not reintroduce a square/pill background behind the icon.");
if (!/position:\s*["']absolute["']/.test(nav)) failures.push("FloatingGlassTabBar: navbar must remain a floating overlay.");

const fab = read("src/components/ui/QuickReportFab.tsx");
if (!fab.includes("quickActionBottomOffset")) failures.push("QuickReportFab must remain coupled to floating navigation metrics.");
if (/\bbottom\s*:\s*\d+|\bleft\s*:\s*\d+/.test(fab)) failures.push("QuickReportFab may not use local fixed bottom/left coordinates.");

const reports = read("src/features/reports/screens/ReportsScreen.tsx");
if (!reports.includes("<QuickReportFab")) failures.push("ReportsScreen must keep the shared floating quick-report action.");

const forbiddenGreeting = ["أهلاً بعودتك", "أهلا بعودتك", "مرحبًا بعودتك", "مرحبا بعودتك"];
for (const phrase of forbiddenGreeting) {
  for (const file of files) {
    if (read(file).includes(phrase)) failures.push(`${file}: removed personal welcome copy has regressed: ${phrase}`);
  }
}

if (failures.length) {
  console.error("Global header + direction regression audit failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Global regression audit passed: ${files.length} TS/TSX files; ${rowCount} classified horizontal rows (${rtlRows} RTL, ${ltrRows} intentional LTR), 0 row-reverse; ${requiredHeaders.length} canonical reading/workspace headers; ${logicalSpacingCount} logical horizontal spacing declarations.`);
