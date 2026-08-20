import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const required = ["AppText","Button","Card","Chip","IconButton","Input","Screen","SectionHeader","StatusBadge","ActionRow","ListItem","MetaRow"];
const errors=[];
for (const name of required) {
  const file=path.join(root,"src/components/ui",`${name}.tsx`);
  if (!fs.existsSync(file)) errors.push(`missing shared UI component: ${name}`);
}
const barrel=fs.readFileSync(path.join(root,"src/components/ui/index.ts"),"utf8");
for (const name of ["ActionRow","ListItem","MetaRow"]) if(!barrel.includes(name)) errors.push(`UI barrel does not export ${name}`);
const migrated=[
  "src/features/notifications/components/NotificationCard.tsx",
  "src/features/reports/components/ReportCard.tsx",
  "src/features/organizations/components/OrganizationCard.tsx",
  "src/features/profile/components/ProfileMenuSection.tsx",
];
for (const rel of migrated) {
  const src=fs.readFileSync(path.join(root,rel),"utf8");
  if(!/components\/ui\/(?:Card|MetaRow|ActionRow|StatusBadge|ListItem|DirectionalIcon)/.test(src)) errors.push(`${rel} is not using shared primitives`);
}
if(errors.length){console.error("Component library check failed:\n");errors.forEach(e=>console.error(`- ${e}`));process.exit(1)}
console.log("Component library check passed.");
console.log(`- shared primitives: ${required.length}`);
console.log(`- migrated representative domain cards: ${migrated.length}`);
