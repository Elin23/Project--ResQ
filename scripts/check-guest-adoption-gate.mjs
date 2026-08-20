import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const fail = (m) => { console.error(`✖ ${m}`); process.exitCode = 1; };
const pass = (m) => console.log(`✔ ${m}`);

const policy = read("src/features/session/accessPolicy.ts");
const tabs = read("app/(user)/(tabs)/_layout.tsx");
const home = read("src/features/home/screens/HomeScreen.tsx");
const homeSection = read("src/features/home/sections/HomeAdoptionSection.tsx");
const gate = read("src/features/session/AuthenticatedRouteGate.tsx");
const route = read("app/(user)/(tabs)/(adoption)/adoptions/[id].tsx");
const login = read("src/features/auth/hooks/useLoginForm.ts");
const org = read("src/features/organizations/screens/OrganizationDetailsScreen.tsx");

if (!policy.includes('guest: new Set(["browse", "create-report", "view-adoption"])')) fail("Guest must have adoption discovery capability");
if (!policy.includes('"apply-adoption"')) fail("Protected adoption action capability is missing");
if (!tabs.includes('"(adoption)": USER_TABS["(adoption)"]')) fail("Explore tab is missing for guests");
if (/name="\(adoption\)"[^\n]*isGuest\s*\?\s*null/.test(tabs)) fail("Explore tab is still hidden from guests");
if (!home.includes("<HomeAdoptionSection")) fail("Home adoption section is missing");
if (!homeSection.includes("onOpenAnimal")) fail("Home adoption cards must open the selected animal");
if (!route.includes("AuthenticatedRouteGate")) fail("Adoption detail route is not authentication-gated");
if (!route.includes('capability="apply-adoption"')) fail("Adoption detail route is not restricted to personal adoption capability");
if (!gate.includes("params: { returnTo: pathname }")) fail("Auth gate does not preserve selected destination");
if (!login.includes("safeReturnTo") || !login.includes("returnTo")) fail("Login does not restore the protected destination");
if (!org.includes('can("view-adoption")') || !org.includes("adoptionDetailsRoute")) fail("Organization public profile does not expose gated adoption discovery");
if (!process.exitCode) pass("Guest adoption discovery + authentication gate contract is complete");
