import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "app/(user)/_layout.tsx",
  "app/(user)/(tabs)/_layout.tsx",
  "app/(user)/(tabs)/(home)/_layout.tsx",
  "app/(user)/(tabs)/(home)/index.tsx",
  "app/(user)/(tabs)/(home)/reports/index.tsx",
  "app/(user)/(tabs)/(home)/reports/[id].tsx",
  "app/(user)/(tabs)/(home)/search/index.tsx",
  "app/(user)/(tabs)/(home)/organizations/index.tsx",
  "app/(user)/(tabs)/(adoption)/_layout.tsx",
  "app/(user)/(tabs)/(adoption)/adoption.tsx",
  "app/(user)/(tabs)/(adoption)/adoptions/[id].tsx",
  "app/(user)/(tabs)/(map)/map.tsx",
  "app/(user)/(tabs)/(notifications)/notifications.tsx",
  "app/(user)/(tabs)/(profile)/profile.tsx",
  "app/reports/create.tsx",
  "app/reports/success.tsx",
  "app/profile/edit.tsx",
  "app/organization/_layout.tsx",
  "app/organization/(tabs)/_layout.tsx",
  "app/organization/(tabs)/(home)/index.tsx",
  "app/organization/(tabs)/(home)/reports/index.tsx",
  "app/organization/(tabs)/(home)/reports/[id].tsx",
  "app/organization/(tabs)/(tasks)/tasks/index.tsx",
  "app/organization/tasks/[id].tsx",
  "app/organization/(tabs)/(tasks)/tasks/[id]/completed.tsx",
  "app/organization/(tabs)/(map)/map.tsx",
  "app/organization/(tabs)/(notifications)/notifications.tsx",
  "app/organization/(tabs)/(profile)/profile.tsx",
];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error("Navigation architecture check failed. Missing routes:\n" + missing.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

// Read-only/browse routes must stay under a tab-owned Stack so floating navigation persists.
const forbiddenOutsideShell = [
  "app/reports/index.tsx", "app/reports/[id].tsx", "app/search/index.tsx", "app/search/[id].tsx",
  "app/organizations/index.tsx", "app/organizations/[id].tsx", "app/adoptions.tsx", "app/adoptions/[id].tsx",
  "app/organization/reports/index.tsx", "app/organization/reports/[id].tsx",
];
const leaked = forbiddenOutsideShell.filter((file) => fs.existsSync(path.join(root, file)));
if (leaked.length) {
  console.error("Persistent-navigation check failed. Read/detail routes escaped their tab-owned stacks:\n" + leaked.map((x) => `- ${x}`).join("\n"));
  process.exit(1);
}

// Data-entry/focus flows intentionally remain outside Tabs.
for (const file of ["app/reports/create.tsx", "app/reports/success.tsx", "app/profile/edit.tsx", "app/contact-us.tsx"]) {
  if (!fs.existsSync(path.join(root, file))) {
    console.error(`Focus-flow route missing outside persistent shell: ${file}`);
    process.exit(1);
  }
}

const userTabs = fs.readFileSync(path.join(root, "app/(user)/(tabs)/_layout.tsx"), "utf8");
const organizationTabs = fs.readFileSync(path.join(root, "app/organization/(tabs)/_layout.tsx"), "utf8");
for (const [label, source, groups] of [
  ["user", userTabs, ["(home)", "(adoption)", "(map)", "(notifications)", "(profile)"]],
  ["organization", organizationTabs, ["(home)", "(tasks)", "(map)", "(notifications)", "(profile)"]],
]) {
  for (const group of groups) if (!source.includes(`name=\"${group}\"`)) {
    console.error(`Navigation architecture check failed. ${label} tabs missing ${group} stack root.`);
    process.exit(1);
  }
}

const routeRegistry = fs.readFileSync(path.join(root, "src/navigation/routes.ts"), "utf8");
for (const [key, value] of [
  ["organizationDashboard", '"/organization"'], ["organizationTasks", '"/organization/tasks"'],
  ["userHome", '"/(user)/(tabs)/(home)"'], ["reports", '"/reports"'], ["search", '"/search"'],
]) {
  if (!routeRegistry.includes(`${key}: ${value}`)) {
    console.error(`Navigation architecture check failed. Route registry missing ${key}.`);
    process.exit(1);
  }
}

console.log("Navigation architecture check passed: browse/detail routes live in tab-owned Stacks; only focus/data-entry flows leave the persistent navbar shell.");
