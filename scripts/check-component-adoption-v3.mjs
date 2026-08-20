import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const must = (rel, token, label = token) => {
  if (!fs.existsSync(path.join(root, rel)) || !read(rel).includes(token)) failures.push(`${rel}: missing ${label}`);
};

const screenFiles = [];
function walk(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel);
    else if (entry.isFile() && /Screen\.tsx$/.test(entry.name)) screenFiles.push(rel);
  }
}
walk("src/features");

for (const file of screenFiles) {
  const source = read(file);
  if (/\bActivityIndicator\b/.test(source)) {
    failures.push(`${file}: screen-level ActivityIndicator bypasses shared LoadingState`);
  }
}

const sharedLoadingScreens = [
  "src/features/map/screens/MapScreen.tsx",
  "src/features/feeding-points/screens/FeedingPointsScreen.tsx",
  "src/features/map-places/screens/MyMapPlacesScreen.tsx",
];
for (const file of sharedLoadingScreens) {
  const source = read(file);
  if (!source.includes("LoadingState") && !source.includes("SkeletonList")) {
    failures.push(`${file}: missing shared LoadingState/SkeletonList primitive`);
  }
}

for (const [file, tokens] of Object.entries({
  "src/features/map/screens/MapScreen.tsx": ["ErrorState", "EmptyState", "ScreenSection"],
  "src/features/feeding-points/screens/FeedingPointsScreen.tsx": ["ErrorState", "EmptyState", "SectionHeader"],
  "src/features/feeding-points/screens/FeedingPointDetailsScreen.tsx": ["LoadingState", "ErrorState"],
  "src/features/map-places/screens/MyMapPlacesScreen.tsx": ["ScreenSection", "Card", "EmptyState", "ErrorState"],
  "src/features/map-places/screens/MapPlaceApplicationFormScreen.tsx": ["FormSection", "Input", "Button"],
  "src/features/map-places/screens/EditOwnedMapPlaceScreen.tsx": ["Card", "Input", "Button", "LoadingState", "ErrorState"],
})) {
  for (const token of tokens) must(file, token, `shared primitive ${token}`);
}

const empty = read("src/components/ui/EmptyState.tsx");
if (empty.includes("COLORS.lightgray")) failures.push("EmptyState: compatibility color alias lightgray should not define the canonical state surface");
must("src/components/ui/EmptyState.tsx", "COLORS.surfaceSubtle", "semantic empty-state surface");
must("src/components/ui/EmptyState.tsx", "COLORS.divider", "semantic empty-state border");

if (failures.length) {
  console.error("Component adoption V3 check failed:\n" + failures.map((f) => `- ${f}`).join("\n"));
  process.exit(1);
}

console.log(`Component adoption V3 passed: ${screenFiles.length} feature screens audited; screen-level ActivityIndicator usage eliminated; map, feeding-point, and map-place flows use canonical loading/skeleton states, sections, and cards.`);
