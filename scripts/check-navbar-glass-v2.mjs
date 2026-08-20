import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const source = read("src/components/ui/FloatingGlassTabBar.tsx");
const failures = [];

for (const token of [
  'position: "absolute"',
  'pointerEvents="box-none"',
  'activeIndicator',
  'backdropFilter: "blur(22px) saturate(155%)"',
  'direction: "rtl"',
]) {
  if (!source.includes(token)) failures.push(`Navbar Glass V2 missing: ${token}`);
}

for (const forbidden of ["iconSurfaceActive", "COLORS.glassActive"]) {
  if (source.includes(forbidden)) failures.push(`Navbar Glass V2 still contains boxed active-state token: ${forbidden}`);
}
if (/focused\s*&&\s*styles\.[A-Za-z0-9_]*(?:Surface|Box|Background)/.test(source)) {
  failures.push("Focused tab must not apply a background surface behind the icon");
}
if (!/activeIndicatorHidden/.test(source)) failures.push("Inactive indicator hiding contract is missing");

if (failures.length) {
  console.error("Navbar Glass V2 check failed:\n" + failures.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}
console.log("Navbar Glass V2 check passed: no active box, floating overlay, frosted material, and slim active indicator enforced.");
