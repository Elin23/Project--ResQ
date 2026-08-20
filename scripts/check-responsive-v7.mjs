import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const mustInclude = (file, token) => {
  const source = read(file);
  if (!source.includes(token)) throw new Error(`${file} must include ${token}`);
};

const theme = read("src/theme/index.ts");
for (const token of ["narrowScreenBreakpoint: 360", "compactScreenBreakpoint: 380", "shortScreenBreakpoint: 700"]) {
  if (!theme.includes(token)) throw new Error(`Responsive density contract missing ${token}`);
}

const hook = read("src/components/ui/useResponsiveLayout.ts");
for (const token of ["useWindowDimensions", "isNarrow", "isCompact", "isShort"]) {
  if (!hook.includes(token)) throw new Error(`Shared responsive hook missing ${token}`);
}

for (const file of [
  "src/features/search/components/SearchResultCard.tsx",
  "src/features/map/components/PlaceListCard.tsx",
  "src/features/home/components/SuggestedActionCard.tsx",
  "src/features/donations/screens/DonationsScreen.tsx",
  "src/features/organization-dashboard/components/OrganizationMetricCards.tsx",
  "src/features/organization-dashboard/components/OrganizationQuickActions.tsx",
  "src/features/organization-dashboard/components/ActiveRescueTaskCard.tsx",
  "src/features/organizations/components/OrganizationCard.tsx",
  "src/features/organizations/components/OrganizationStatsGrid.tsx",
]) {
  mustInclude(file, "useResponsiveLayout");
  mustInclude(file, "isNarrow");
}

const searchCard = read("src/features/search/components/SearchResultCard.tsx");
if (!searchCard.includes("imageContainerNarrow") || !searchCard.includes("numberOfLines={2}")) {
  throw new Error("Search cards must reduce image height and allow Arabic wrapping on narrow screens.");
}

const quickActions = read("src/features/organization-dashboard/components/OrganizationQuickActions.tsx");
if (!quickActions.includes('itemNarrow: { width: "47%" }')) {
  throw new Error("Organization quick actions must collapse from three to two columns on narrow screens.");
}

const activeTask = read("src/features/organization-dashboard/components/ActiveRescueTaskCard.tsx");
if (!activeTask.includes('actionsNarrow: { flexDirection: "column" }')) {
  throw new Error("Rescue task actions must stack on narrow screens.");
}

const orgCard = read("src/features/organizations/components/OrganizationCard.tsx");
if (!orgCard.includes('actionsNarrow: { flexDirection: "column" }')) {
  throw new Error("Organization card actions must stack on narrow screens.");
}

console.log("Responsive Cards V7 passed: shared 360px contract, Arabic wrapping, reduced media density, two-column quick actions, and stacked narrow-screen actions are enforced.");
