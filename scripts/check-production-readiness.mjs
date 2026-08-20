import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
const warnings = [];
const required = [
  "src/features/session/accessPolicy.test.ts",
  "src/navigation/workspaces.test.ts",
  "src/data/repositories/__tests__/inMemoryRepositories.test.ts",
  "src/application/rescue/__tests__/RescueOperationsService.test.ts",
  "PRODUCTION-READINESS.md",
  ".github/workflows/quality.yml",
];
for (const rel of required) if (!fs.existsSync(path.join(root, rel))) errors.push(`missing production-readiness artifact: ${rel}`);

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const sourceFiles = ["src", "app"].flatMap((rel) => walk(path.join(root, rel))).filter((file) => /\.(?:ts|tsx|js|jsx)$/.test(file));
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  if (/@ts-ignore|@ts-nocheck/.test(text)) errors.push(`unsafe TypeScript suppression: ${rel}`);
  if (/console\.log\(/.test(text)) warnings.push(`console.log remains: ${rel}`);
}

for (const rel of ["src/domain", "src/data/repositories", "src/application"]) {
  for (const file of walk(path.join(root, rel)).filter((item) => /\.tsx?$/.test(item))) {
    const text = fs.readFileSync(file, "utf8");
    if (/require\(["']@\/assets\//.test(text)) errors.push(`runtime asset require leaks into domain/data/application: ${path.relative(root, file)}`);
  }
}

const button = fs.readFileSync(path.join(root, "src/components/ui/Button.tsx"), "utf8");
if (!button.includes('accessibilityRole="button"') || !button.includes("accessibilityState")) errors.push("Button accessibility contract is incomplete");
const iconButton = fs.readFileSync(path.join(root, "src/components/ui/IconButton.tsx"), "utf8");
if (!iconButton.includes("accessibilityLabel: string") || !iconButton.includes('accessibilityRole="button"')) errors.push("IconButton must require an accessibility label");
const listItem = fs.readFileSync(path.join(root, "src/components/ui/ListItem.tsx"), "utf8");
if (!listItem.includes("accessibilityLabel")) errors.push("ListItem accessibility label fallback is missing");

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
for (const name of ["typecheck", "lint", "test", "check:production"]) if (!packageJson.scripts?.[name]) errors.push(`missing npm quality script: ${name}`);
if (!packageJson.scripts?.check?.includes("check:production")) errors.push("main check pipeline does not include check:production");

if (errors.length) {
  console.error("Production readiness check failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Production readiness check passed.");
console.log("- critical flow tests: present");
console.log("- TypeScript suppression policy: clean");
console.log("- domain/data runtime assets: decoupled");
console.log("- shared interactive accessibility contracts: present");
console.log(`- non-blocking console.log warnings: ${warnings.length}`);
