import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const fail = (message) => { console.error(`✖ ${message}`); process.exitCode = 1; };
const pass = (message) => console.log(`✔ ${message}`);

const reportsPath = "src/features/reports/screens/ReportsScreen.tsx";
const fabPath = "src/components/ui/QuickReportFab.tsx";
const contextPath = "src/components/ui/FloatingNavigationContext.tsx";
const cardPath = "src/features/reports/components/MyReportCard.tsx";

for (const file of [reportsPath, fabPath, contextPath, cardPath]) {
  if (!fs.existsSync(path.join(root, file))) fail(`${file} is missing`);
}

if (!process.exitCode) {
  const reports = read(reportsPath);
  const fab = read(fabPath);
  const context = read(contextPath);
  const card = read(cardPath);

  if (!reports.includes("<QuickReportFab")) fail("ReportsScreen must render the shell-aware QuickReportFab outside scroll content");
  else pass("ReportsScreen uses the shared QuickReportFab");

  if (/styles\.fab\b|left:\s*20|bottom:\s*20/.test(reports)) fail("ReportsScreen must not own legacy absolute FAB coordinates");
  else pass("Legacy local FAB coordinates are removed");

  if (!fab.includes("useFloatingNavigation") || !fab.includes("quickActionBottomOffset")) fail("QuickReportFab must derive vertical placement from floating navigation metrics");
  else pass("QuickReportFab derives placement from floating navigation metrics");

  if (!fab.includes('left: LAYOUT.screenPadding')) fail("QuickReportFab must sit on the RTL action/end edge for the Arabic product shell");
  else pass("QuickReportFab is anchored to the Arabic action edge");

  if (!context.includes("navBarBottomOffset") || !context.includes("navBarHeight") || !context.includes("quickActionBottomOffset")) fail("FloatingNavigationContext must expose reusable shell metrics");
  else pass("Floating navigation metrics are centralized");

  if (!reports.includes("WorkspaceMetricGrid") || !reports.includes("<Chip")) fail("My Reports summary and filters must use shared responsive primitives");
  else pass("My Reports summary and filters use shared responsive primitives");

  if (card.includes('accessibilityLabel="خيارات البلاغ"') || card.includes("Alert.alert")) fail("MyReportCard must not carry the old redundant options affordance");
  else pass("MyReportCard no longer carries the redundant options affordance");

  if (!card.includes("StatusBadge") || !card.includes("ActionRow")) fail("MyReportCard must use shared status/action primitives");
  else pass("MyReportCard uses shared status/action primitives");
}

if (!process.exitCode) console.log("My Reports + floating quick report FAB V2 check passed.");
