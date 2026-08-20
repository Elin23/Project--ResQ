import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];

const required = [
  "src/components/ui/FloatingGlassTabBar.tsx",
  "src/components/ui/TopBar.tsx",
  "app/(user)/(tabs)/_layout.tsx",
  "app/(user)/(tabs)/(home)/_layout.tsx",
  "app/organization/(tabs)/_layout.tsx",
];
for (const file of required) if (!fs.existsSync(path.join(root, file))) failures.push(`missing ${file}`);

const tabBar = read("src/components/ui/FloatingGlassTabBar.tsx");
for (const token of [
  'flexDirection: "row"',
  'direction: "rtl"',
  "COLORS.glassSurface",
  "COLORS.glassBorder",
  "useSafeAreaInsets",
  'accessibilityRole="tab"',
  'position: "absolute"',
]) {
  if (!tabBar.includes(token)) failures.push(`FloatingGlassTabBar missing ${token}`);
}
if (/from\s+["\']expo-blur["\']|require\(["\']expo-blur["\']\)/.test(tabBar)) {
  failures.push("FloatingGlassTabBar must not import unavailable expo-blur dependency");
}

const topBar = read("src/components/ui/TopBar.tsx");
for (const token of ["avatarUri", "onAvatarPress", 'accessibilityLabel={avatarLabel}']) {
  if (!topBar.includes(token)) failures.push(`TopBar missing account identity contract: ${token}`);
}

const userLayout = read("app/(user)/(tabs)/_layout.tsx");
const userHomeLayout = read("app/(user)/(tabs)/(home)/_layout.tsx");
if (!userLayout.includes("FloatingGlassTabBar")) failures.push("User shell missing FloatingGlassTabBar");
for (const token of ["DEFAULT_PROFILE.avatarUri", "router.push(ROUTES.profile)"]) {
  if (!userHomeLayout.includes(token)) failures.push(`User home stack missing ${token}`);
}

for (const file of ["app/organization/(tabs)/_layout.tsx"]) {
  const source = read(file);
  if (!source.includes("FloatingGlassTabBar")) failures.push(`${file} does not use shared floating navigation`);
  if (source.includes("activeIconPill") || source.includes("borderTopLeftRadius")) failures.push(`${file} still contains legacy tab-bar styling`);
}

const welcomePath = path.join(root, "src/features/home/components/UserWelcomeHeader.tsx");
if (fs.existsSync(welcomePath)) {
  const welcome = fs.readFileSync(welcomePath, "utf8");
  if (welcome.includes("<Image") || welcome.includes("avatarUrl")) failures.push("Home greeting still duplicates account avatar below TopBar");
  failures.push("Legacy UserWelcomeHeader should be removed; the signed-in Home no longer uses a personal greeting block");
}

if (failures.length) {
  console.error("App shell check failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log("App shell check passed: shared floating translucent navigation + header identity contracts are in place.");
