import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const fail = (message) => { console.error(`✖ ${message}`); process.exitCode = 1; };
const pass = (message) => console.log(`✔ ${message}`);

const stackPath = "src/components/ui/ActionStack.tsx";
if (!fs.existsSync(path.join(root, stackPath))) fail("ActionStack primitive is missing");
else {
  const stack = read(stackPath);
  if (!stack.includes("gap = SPACING.sm")) fail("ActionStack must use the shared default action gap");
  else pass("ActionStack owns the vertical action gap");
}

const migrated = [
  "src/features/session/GuestAccountGate.tsx",
  "src/features/organizations/screens/OrganizationDetailsScreen.tsx",
  "src/features/adoption/screens/AdoptionDetailsScreen.tsx",
  "src/features/profile/screens/EditProfileScreen.tsx",
  "src/features/profile/screens/ProfileScreen.tsx",
  "src/features/organization-dashboard/screens/OrganizationReportDetailsScreen.tsx",
  "src/features/organization-dashboard/screens/OrganizationProfileScreen.tsx",
  "src/features/organization-dashboard/screens/OrganizationTaskDetailsScreen.tsx",
  "src/features/organization-dashboard/screens/OrganizationTaskCompletedScreen.tsx",
  "src/features/search/screens/SearchResultDetailsScreen.tsx",
  "src/features/feeding-points/components/ReportIssueSheet.tsx",
  "src/features/feeding-points/components/UpdateStatusSheet.tsx",
  "src/components/ui/GuestPromoCard.tsx",
];
for (const file of migrated) {
  if (!read(file).includes("ActionStack")) fail(`${file} is expected to use ActionStack`);
}
if (!process.exitCode) pass(`${migrated.length} high-risk vertical action surfaces use ActionStack`);

const tsxFiles = [];
function walk(dir) {
  for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) walk(rel);
    else if (e.name.endsWith(".tsx")) tsxFiles.push(rel);
  }
}
walk("app"); walk("src");

let fakeInteractiveControls = 0;
for (const file of tsxFiles) {
  const src = read(file);
  for (const tag of ["Pressable", "TouchableOpacity"]) {
    const re = new RegExp(`<${tag}\\b([^>]*)>`, "gs");
    for (const match of src.matchAll(re)) {
      const attrs = match[1];
      if (!attrs.includes("onPress=") && !attrs.includes("disabled")) {
        fakeInteractiveControls++;
        fail(`${file} contains a ${tag} without onPress`);
      }
    }
  }
}
if (!fakeInteractiveControls) pass(`No fake Pressable/TouchableOpacity affordances across ${tsxFiles.length} TSX files`);

const terms = read("src/features/public/screens/TermsAndConditionsScreen.tsx");
if (!terms.includes('accessibilityLabel="تواصل معنا"') || !terms.includes('router.push("/contact-us")')) fail("Terms contact CTA must be interactive");
else pass("Terms contact CTA is wired to Contact Us");

const reports = read("src/features/reports/components/MyReportCard.tsx");
if (!reports.includes('accessibilityLabel="مشاركة البلاغ"') || !reports.includes("onDetailsPress")) fail("MyReportCard primary actions must be interactive");
else pass("MyReportCard primary actions are interactive without a fake options control");

if (!process.exitCode) console.log("Action spacing & interaction QA passed.");
