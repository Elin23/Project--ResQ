import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const asyncResource = read("src/hooks/useAsyncResource.ts");
expect(asyncResource.includes("refreshing"), "useAsyncResource must expose a refreshing state.");
expect(asyncResource.includes("refreshError"), "useAsyncResource must separate refresh failures from initial-load failures.");
expect(asyncResource.includes("resolvedRef"), "useAsyncResource must distinguish first load from later reloads.");

const skeleton = read("src/components/ui/Skeleton.tsx");
expect(skeleton.includes("SkeletonList"), "Shared SkeletonList must exist.");
expect(skeleton.includes("COLORS.surfaceMuted"), "Skeleton surfaces must use semantic theme tokens.");

const refreshStatus = read("src/components/ui/RefreshStatus.tsx");
expect(refreshStatus.includes("جاري تحديث البيانات"), "RefreshStatus must provide Arabic background-refresh feedback.");
expect(refreshStatus.includes('accessibilityRole={failed ? "alert" : "progressbar"}'), "RefreshStatus must expose accessible async semantics.");

const screens = [
  "src/features/adoption/screens/AdoptionScreen.tsx",
  "src/features/donations/screens/DonationsScreen.tsx",
  "src/features/map/screens/MapScreen.tsx",
  "src/features/map-places/screens/MyMapPlacesScreen.tsx",
  "src/features/feeding-points/screens/FeedingPointsScreen.tsx",
];
for (const file of screens) {
  const source = read(file);
  expect(source.includes("SkeletonList"), `${file} must use skeletons for first-load layout stability.`);
  expect(source.includes("RefreshControl"), `${file} must expose pull-to-refresh without replacing rendered content.`);
}

const feedingHook = read("src/features/feeding-points/hooks/useFeedingPoints.ts");
expect(feedingHook.includes("isRefreshing"), "Feeding-points loading must distinguish refresh from initial load.");
expect(feedingHook.includes("refreshError"), "Feeding-points refresh failures must preserve already loaded data.");

if (failures.length) {
  console.error("Async state V15 check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`Async state V15 passed: ${screens.length} high-traffic surfaces use skeleton-first loading and background refresh semantics.`);
