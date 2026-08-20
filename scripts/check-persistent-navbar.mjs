import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const exists = (f) => fs.existsSync(path.join(root, f));
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const failures = [];

const visibleRoutes = [
  "app/(user)/(tabs)/(home)/reports/index.tsx",
  "app/(user)/(tabs)/(home)/reports/[id].tsx",
  "app/(user)/(tabs)/(home)/search/index.tsx",
  "app/(user)/(tabs)/(home)/search/[id].tsx",
  "app/(user)/(tabs)/(home)/organizations/index.tsx",
  "app/(user)/(tabs)/(home)/organizations/[id].tsx",
  "app/(user)/(tabs)/(home)/feeding-points/[id].tsx",
  "app/(user)/(tabs)/(adoption)/adoptions.tsx",
  "app/(user)/(tabs)/(adoption)/adoptions/[id].tsx",
  "app/organization/(tabs)/(home)/reports/index.tsx",
  "app/organization/(tabs)/(home)/reports/[id].tsx",
  "app/organization/(tabs)/(tasks)/tasks/[id]/completed.tsx",
];
for (const file of visibleRoutes) if (!exists(file)) failures.push(`persistent-navbar route escaped tab stack: ${file}`);

const hiddenFocusRoutes = [
  "app/reports/create.tsx",
  "app/reports/success.tsx",
  "app/profile/edit.tsx",
  "app/contact-us.tsx",
  "app/organization/tasks/[id].tsx",
];
for (const file of hiddenFocusRoutes) if (!exists(file)) failures.push(`focus/data-entry route leaked into tab shell: ${file}`);

for (const file of ["app/(user)/(tabs)/(home)/_layout.tsx","app/(user)/(tabs)/(adoption)/_layout.tsx","app/organization/(tabs)/(home)/_layout.tsx","app/organization/(tabs)/(tasks)/_layout.tsx"]) {
  if (!exists(file) || !read(file).includes("<Stack")) failures.push(`tab root is not Stack-backed: ${file}`);
}

const policy = read("src/navigation/shellVisibilityPolicy.ts");
for (const token of ["reports\\/create", "profile\\/edit", "contact-us", "organization\\/tasks"] ) if (!policy.includes(token)) failures.push(`shell visibility policy missing ${token}`);

if (failures.length) {
  console.error("Persistent navbar check failed:\n" + failures.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}
console.log(`Persistent navbar check passed: ${visibleRoutes.length} representative browse/detail routes stay inside tab-owned Stacks; ${hiddenFocusRoutes.length} focus flows intentionally leave the shell.`);
