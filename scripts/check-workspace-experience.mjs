import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const requiredFiles = [
  "src/components/ui/WorkspaceMetricGrid.tsx",
];
for (const rel of requiredFiles) if (!fs.existsSync(path.join(root, rel))) errors.push(`missing workspace file: ${rel}`);

const home = read("src/features/home/screens/HomeScreen.tsx");
if (!home.includes("USER_HOME_METRICS")) errors.push("user home is missing member-specific metrics");
if (!home.includes("GuestPromoCard")) errors.push("guest home is not explicitly separated from member experience");
if (!home.includes("WorkspaceMetricGrid")) errors.push("user workspace is not using shared metric primitive");

const organization = read("src/features/organization-dashboard/screens/OrganizationDashboardScreen.tsx");
const organizationHook = read("src/features/organization-dashboard/hooks/useOrganizationDashboard.ts");
if (!organization.includes("dashboard.metrics") || !organizationHook.includes("بلاغات بانتظار الفرز")) errors.push("organization workspace is missing operating metrics");
if (!organization.includes("الفريق يستقبل حالات جديدة")) errors.push("organization workspace is missing availability state");


const barrel = read("src/components/ui/index.ts");
if (!barrel.includes("WorkspaceMetricGrid")) errors.push("UI barrel does not export WorkspaceMetricGrid");

if (errors.length) {
  console.error("Workspace experience check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Workspace experience check passed.");
console.log("- user/guest home separation: verified");
console.log("- organization operations workspace: verified");
