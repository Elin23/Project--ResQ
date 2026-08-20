import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const checks = [];
const expect = (name, condition) => checks.push({ name, ok: Boolean(condition) });

const asyncHook = read("src/hooks/useAsyncResource.ts");
const refreshStatus = read("src/components/ui/RefreshStatus.tsx");
const adoptionHook = read("src/features/adoption/hooks/useAdoptionListings.ts");
const donationHook = read("src/features/donations/hooks/useDonationDiscovery.ts");
const mapHook = read("src/features/map/hooks/useServicePlaces.ts");
const feedingHook = read("src/features/feeding-points/hooks/useFeedingPoints.ts");
const screens = [
  "src/features/adoption/screens/AdoptionScreen.tsx",
  "src/features/donations/screens/DonationsScreen.tsx",
  "src/features/map/screens/MapScreen.tsx",
  "src/features/feeding-points/screens/FeedingPointsScreen.tsx",
  "src/features/map-places/screens/MyMapPlacesScreen.tsx",
].map(read).join("\n");

expect("async resource persists optional cache", asyncHook.includes("AsyncStorage.setItem") && asyncHook.includes("cacheKey"));
expect("cached data is marked stale until refreshed", asyncHook.includes("setIsStale(true)") && asyncHook.includes("setIsStale(false)"));
expect("refresh failure preserves resolved payload", asyncHook.includes("setRefreshError(errorMessage)") && !/setData\(initialValue\).*setRefreshError/s.test(asyncHook));
expect("request race protection is centralized", asyncHook.includes("requestIdRef") && asyncHook.includes("requestId === requestIdRef.current"));
expect("foreground refresh is supported", asyncHook.includes("AppState.addEventListener") && asyncHook.includes("refreshOnForeground"));
expect("public adoption list uses safe cache", adoptionHook.includes('cacheKey: enabled ? "public-adoption-listings"'));
expect("public donation campaigns use safe cache", donationHook.includes('cacheKey: "public-donation-campaigns"'));
expect("map search results are not cached per free-text query", mapHook.includes("normalizedSearch ? undefined"));
expect("feeding-point search results are not cached per free-text query", feedingHook.includes("normalizedSearch ? undefined"));
expect("stale status explains last available data", refreshStatus.includes("آخر نسخة متاحة") && refreshStatus.includes("cloud-offline-outline"));
expect("refresh status exposes retry", refreshStatus.includes("إعادة المحاولة") && refreshStatus.includes("onRetry"));
expect("heavy screens render stale/refresh metadata", (screens.match(/lastUpdatedAt=/g) ?? []).length >= 5 && (screens.match(/stale=/g) ?? []).length >= 5);

const failed = checks.filter((check) => !check.ok);
for (const check of checks) console.log(`${check.ok ? "✓" : "✗"} ${check.name}`);
if (failed.length) {
  console.error(`\nResilience V16 failed: ${failed.length} check(s).`);
  process.exit(1);
}
console.log(`\nResilience V16 passed: ${checks.length} contracts.`);
