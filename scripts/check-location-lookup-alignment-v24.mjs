import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => { console.error(`✖ ${message}`); process.exitCode = 1; };
const pass = (message) => console.log(`✔ ${message}`);

const entityNative = read("src/features/auth/components/register-entity/EntityLocationSection.tsx");
const entityWeb = read("src/features/auth/components/register-entity/EntityLocationSection.web.tsx");
const entityHook = read("src/features/auth/hooks/useRegisterEntityForm.tsx");
const entityPayload = read("src/features/auth/utils/registerEntityForm.ts");
const feeding = read("src/features/feeding-points/screens/CreateFeedingPointScreen.tsx");
const userHook = read("src/features/auth/hooks/useRegisterUserForm.tsx");
const loginFooter = read("src/features/auth/components/login/LoginFooter.tsx");
const welcome = read("src/features/public/components/welcome/WelcomeSections.tsx");
const policy = read("src/features/session/accessPolicy.ts");

for (const [name, source] of [["entity native", entityNative], ["entity web", entityWeb]]) {
  if (!source.includes('label="المحافظة"') || !source.includes('label="المنطقة / الحي"')) fail(`${name}: location selectors missing`);
  if (!source.includes("LocationLookupSelect")) fail(`${name}: not using dashboard-backed lookup selector`);
  if (source.includes('placeholder="المنطقة / الحي"') && source.includes("TextInput")) fail(`${name}: region is still free text`);
}

for (const token of ["serviceGovernorateId", "serviceRegionId", "useLocationLookups"]) {
  if (!entityHook.includes(token)) fail(`entity registration missing ${token}`);
}
for (const token of ["governorateId", "regionId", "governorateName", "regionName"]) {
  if (!entityPayload.includes(token)) fail(`entity payload missing ${token}`);
}
if (!process.exitCode) pass("Organization registration uses governorate/region IDs from location lookups");

for (const token of ['label="المحافظة"', 'label="المنطقة / الحي"', "governorateId,", "regionId,", "useLocationLookups"]) {
  if (!feeding.includes(token)) fail(`feeding point form missing ${token}`);
}
if (/label="المنطقة[^\n]*onChangeText/.test(feeding)) fail("Feeding point region is still a free-text input");
if (!process.exitCode) pass("Feeding-point creation uses controlled governorate/region selectors and submits IDs");

if (!userHook.includes("governorateId") || !userHook.includes("useLocationLookups")) fail("User registration governorate is not dashboard-lookup ready");
else pass("User registration governorate is sourced from the same lookup repository");

if (!loginFooter.includes('title="المتابعة كزائر"')) fail("Login guest button copy is not exact");
if (!welcome.includes('title="المتابعة كزائر"')) fail("Welcome guest button copy is not exact");
const guestBlock = policy.match(/guest:\s*new Set\(\[([^\]]*)\]\)/s)?.[1] ?? "";
if (guestBlock.includes("create-report")) fail("Guest still has report creation capability");
if (!process.exitCode) pass("Guest CTA copy and guest report restriction are correct");

if (!process.exitCode) console.log("Location lookup / guest alignment V24 passed.");
