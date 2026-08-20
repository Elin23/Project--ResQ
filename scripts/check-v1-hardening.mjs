import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (p) => fs.existsSync(path.join(root, p));
const failures = [];
const assert = (ok, message) => { if (!ok) failures.push(message); };

assert(!exists("src/components/ui/ComingSoonScreen.tsx"), "ComingSoonScreen must not ship in the V1 RC source.");
assert(exists("src/features/feeding-points/components/FeedingPointsMap.native.tsx"), "Native map implementation is required for V1 RC.");

const map = read("src/features/map/screens/MapScreen.tsx");
assert(!map.includes("ComingSoonScreen"), "Main Map tab cannot be a coming-soon placeholder.");
assert(map.includes("useServicePlaces"), "Main Map tab must load the public service-place repository.");

const nativeMap = read("src/features/feeding-points/components/FeedingPointsMap.native.tsx");
assert(nativeMap.includes("react-native-maps"), "Native feeding-points map must use react-native-maps.");
assert(nativeMap.includes("<Marker"), "Native feeding-points map must render data markers.");

const feeding = read("src/features/feeding-points/screens/FeedingPointsScreen.tsx");
assert(!feeding.includes("رح تنضاف قريب"), "Feeding points cannot expose fake coming-soon actions.");
assert(feeding.includes('title="إضافة نقطة"'), "Feeding points should expose the now-implemented add-point action to authorized accounts.");
assert(feeding.includes("ROUTES.createFeedingPoint"), "Add-point action must navigate to the real create route.");
assert(!feeding.includes('actionLabel="رؤية الكل"'), "Section actions without handlers must not appear.");

const sectionHeader = read("src/components/ui/SectionHeader.tsx");
assert(sectionHeader.includes("actionLabel && onActionPress"), "SectionHeader must only render actionable labels when a handler exists.");

const searchDetails = read("src/features/search/screens/SearchResultDetailsScreen.tsx");
assert(!searchDetails.includes("البيانات الحالية تجريبية"), "Search details cannot expose demo-data copy.");

const donations = read("src/features/donations/screens/DonationsScreen.tsx");
assert(!donations.includes("Frontend"), "Donations screen cannot expose implementation language.");
assert(!donations.includes("خيارات تجريبية"), "Donations screen cannot expose experimental UI copy.");
assert(donations.includes("تبرع الآن") && donations.includes("donationCampaignDetailsRoute"), "Donations screen must provide a real campaign donation next action.");

const modal = read("app/modal.tsx");
assert(!/size=\{\d+\}/.test(modal), "Generic modal must use semantic typography.");
assert(!modal.includes("يمكن استخدام هذا المسار لاحقًا"), "Generic modal cannot contain developer-facing placeholder copy.");

const scanRoots = ["app", "src"];
const sourceFiles = [];
const walk = (dir) => {
  for (const name of fs.readdirSync(path.join(root, dir))) {
    const rel = path.join(dir, name);
    const full = path.join(root, rel);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(rel);
    else if (/\.tsx$/.test(name)) sourceFiles.push(rel);
  }
};
for (const dir of scanRoots) walk(dir);

for (const rel of sourceFiles) {
  const text = read(rel);
  if (/\b(Repository|Frontend)\b/.test(text) && /["'`][^"'`]*(Repository|Frontend)[^"'`]*["'`]/.test(text)) {
    failures.push(`${rel}: implementation-facing copy detected in a TSX string.`);
  }
  if (/<AppText[^>]*size=\{\d+/.test(text)) {
    failures.push(`${rel}: numeric AppText size remains; use semantic typography.`);
  }
}

if (failures.length) {
  console.error("V1 hardening check failed:\n" + failures.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

console.log(`V1 hardening check passed (${sourceFiles.length} TSX surfaces scanned).`);
