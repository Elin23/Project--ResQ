import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root,p),"utf8");
for (const file of ["src/product/screenCatalog.ts","src/product/flows.ts","src/navigation/routes.ts","SCREEN-INVENTORY.md"]) {
  if (!fs.existsSync(path.join(root,file))) throw new Error(`Missing product architecture file: ${file}`);
}
const catalog=read("src/product/screenCatalog.ts"), flows=read("src/product/flows.ts"), routes=read("src/navigation/routes.ts");
for (const route of ['/(user)/(tabs)','/reports','/organization','/organization/reports','/organization/reports/[id]','/organization/tasks','/organization/tasks/[id]']) {
  if (!catalog.includes(`route: "${route}"`)) throw new Error(`Screen catalog missing ${route}`);
}
for (const flow of ["user-registration","entity-registration","rescue-report","organization-triage"]) if (!flows.includes(`id: "${flow}"`)) throw new Error(`Product flow missing ${flow}`);
if (!routes.includes('pathname: "/organization/reports/[id]"')) throw new Error("Organization report details route helper is missing");
for (const file of ["app/organization/(tabs)/(home)/reports/index.tsx","app/organization/(tabs)/(home)/reports/[id].tsx"]) if (!fs.existsSync(path.join(root,file))) throw new Error(`Missing organization triage route: ${file}`);
console.log("Product architecture check passed: product URLs are stable while browse/detail screens remain inside persistent workspace shells.");
