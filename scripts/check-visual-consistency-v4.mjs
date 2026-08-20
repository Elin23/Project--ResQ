import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const roots = ["src/features", "src/components"];
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
};
for (const rel of roots) walk(path.join(root, rel));

const failures = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  if (/["']#[0-9A-Fa-f]{3,8}["']/.test(text)) failures.push(`${rel}: hardcoded hex color`);
  if (/\bfontSize:\s*\d+/.test(text)) failures.push(`${rel}: literal fontSize`);
  if (/\bborder(?:TopLeft|TopRight|BottomLeft|BottomRight)?Radius:\s*\d+/.test(text)) failures.push(`${rel}: literal radius`);
  if (/row-reverse/.test(text)) failures.push(`${rel}: row-reverse RTL workaround`);
}

const activeQa = [
  "scripts/check-rc-ui.mjs",
  "scripts/check-workspace-experience.mjs",
  "scripts/check-data-domain-architecture.mjs",
  "scripts/check-campaign-management.mjs",
  "scripts/check-create-donation-campaign.mjs",
  "scripts/check-veterinary-clinics.mjs",
  "scripts/check-adoption-owner-status.mjs",
  "scripts/check-feeding-point-submission-flow.mjs",
  "scripts/check-donation-tracking.mjs",
];
for (const rel of activeQa) {
  const text = fs.readFileSync(path.join(root, rel), "utf8");
  if (text.includes("app/clinic/") || text.includes("src/features/clinic-dashboard")) {
    failures.push(`${rel}: stale clinic-account QA contract`);
  }
}

if (failures.length) {
  console.error("Visual consistency V4 failed:\n" + failures.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}
console.log(`Visual consistency V4 passed: ${files.length} feature/component files use centralized color, type-size and radius contracts; no row-reverse or active clinic-era QA contracts remain.`);
