import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];

const tabBar = read("src/components/ui/FloatingGlassTabBar.tsx");
const screen = read("src/components/ui/Screen.tsx");
const context = read("src/components/ui/FloatingNavigationContext.tsx");

for (const token of [
  'position: "absolute"',
  'activeIndicator',
  'iconSlot',
  'pointerEvents="box-none"',
]) {
  if (!tabBar.includes(token)) failures.push(`FloatingGlassTabBar missing true-floating contract: ${token}`);
}

if (/iconSurface:\s*\{[\s\S]{0,220}borderRadius:\s*RADIUS\.full/.test(tabBar)) {
  failures.push("Active icon surface regressed to pill/circle radius");
}
if (!context.includes("contentBottomInset") || !screen.includes("contentBottomInset > 0")) {
  failures.push("Screen does not reserve end-of-scroll clearance for the floating overlay");
}
for (const file of ["app/(user)/(tabs)/_layout.tsx", "app/organization/(tabs)/_layout.tsx"]) {
  const source = read(file);
  if (!source.includes("FloatingNavigationProvider")) failures.push(`${file} missing FloatingNavigationProvider`);
}

if (failures.length) {
  console.error("Floating navigation check failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log("Floating navigation check passed: overlay shell, box-free active state, and scroll clearance are enforced.");
