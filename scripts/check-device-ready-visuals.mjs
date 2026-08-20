import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const responsive = read("src/hooks/useResponsiveCardWidth.ts");
check(responsive.includes("useWindowDimensions"), "Responsive rail cards must derive width from the live viewport.");
check(responsive.includes("maxWidth") && responsive.includes("sidePeek"), "Responsive card helper must cap tablet width and preserve rail affordance.");

for (const file of [
  "src/features/home/components/HomeAdoptionCard.tsx",
  "src/features/home/components/NearbyReportCard.tsx",
  "src/features/organization-dashboard/components/EmergencyCaseCard.tsx",
  "src/features/organizations/screens/OrganizationsScreen.tsx",
]) {
  const src = read(file);
  check(src.includes("useResponsiveCardWidth"), `${file} must use responsive rail-card sizing.`);
  check(!/\bwidth:\s*(250|270|278|280)\b/.test(src), `${file} must not restore phone-specific fixed card widths.`);
}

const organizations = read("src/features/organizations/screens/OrganizationsScreen.tsx");
check(organizations.includes("ShellAwareScrollView"), "Organizations reading surface must clear the floating navbar through ShellAwareScrollView.");
check(!organizations.includes("headerActions"), "Organizations header must not show decorative search/filter affordances without handlers.");
check(!organizations.includes("paddingBottom: 130"), "Organizations must not hard-code floating-navbar clearance.");

const screenHeader = read("src/components/ui/ScreenHeader.tsx");
check(screenHeader.includes('numberOfLines={2}'), "ScreenHeader title clipping contract changed unexpectedly; validate header wrapping before modifying it.");

if (failures.length) {
  console.error("Device-ready visual hardening failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log("Device-ready visual hardening passed: responsive rails, shell-aware reading surfaces, and header affordances are guarded.");
