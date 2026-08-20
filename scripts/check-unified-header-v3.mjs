import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const failures = [];
const requireText = (source, needle, message) => { if (!source.includes(needle)) failures.push(message); };
const forbidText = (source, needle, message) => { if (source.includes(needle)) failures.push(message); };

const header = read("src/components/ui/ScreenHeader.tsx");
const topBar = read("src/components/ui/TopBar.tsx");

requireText(header, 'titleAlignment = "start"', "ScreenHeader must default to Arabic logical-start title alignment.");
requireText(header, 'textAlign: ARABIC_LAYOUT.textAlign', "ScreenHeader title/subtitle must inherit centralized Arabic alignment.");
requireText(header, 'writingDirection: ARABIC_LAYOUT.direction', "ScreenHeader must use centralized Arabic writing direction.");
requireText(header, 'backgroundColor: COLORS.surfaceElevated', "ScreenHeader must use the canonical elevated header surface.");
requireText(header, 'borderBottomColor: COLORS.divider', "ScreenHeader must use the canonical divider token.");
requireText(header, 'backgroundColor: COLORS.surfaceMuted', "Back affordance must use the shared neutral action surface.");
forbidText(header, "sideWidth", "ScreenHeader may not restore geometric sideWidth title compensation.");

requireText(topBar, 'backgroundColor: COLORS.surfaceElevated', "TopBar and ScreenHeader must share the same header surface.");
requireText(topBar, 'borderBottomColor: COLORS.divider', "TopBar and ScreenHeader must share the same divider language.");

const taskHeader = read("src/features/organization-dashboard/components/OrganizationTaskHeader.tsx");
forbidText(taskHeader, "sideWidth", "Organization task header may not compensate title geometry with sideWidth.");

for (const rel of [
  "src/features/donations/screens/DonationCampaignDetailsScreen.tsx",
  "src/features/donations/screens/DonationsScreen.tsx",
]) {
  forbidText(read(rel), "sideWidth=", `${rel}: donation headers may not use legacy symmetric side widths.`);
}

requireText(read("src/features/profile/components/ProfileHeader.tsx"), "<ScreenHeader", "Profile root header must compose the canonical ScreenHeader.");
requireText(read("src/features/organization-dashboard/components/OrganizationDashboardHeader.tsx"), "<ScreenHeader", "Organization dashboard root header must compose the canonical ScreenHeader.");
requireText(read("src/features/profile/screens/ProfileScreen.tsx"), "padded={false}", "Profile root must let its canonical header span the full screen width.");

const featureRoot = path.join(root, "src/features");
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.tsx$/.test(entry.name)) files.push(full);
  }
}
walk(featureRoot);
for (const full of files) {
  const source = fs.readFileSync(full, "utf8");
  const rel = path.relative(root, full).replaceAll("\\", "/");
  if (source.includes("<ScreenHeader") && source.includes("sideWidth=")) {
    failures.push(`${rel}: legacy sideWidth header compensation remains.`);
  }
}

if (failures.length) {
  console.error("Unified Header V3 audit failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`Unified Header V3 passed: Arabic-start header geometry, shared root/page surfaces, and ${files.length} feature TSX files audited with no sideWidth compensation.`);
