import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => { console.error(`✖ ${message}`); process.exitCode = 1; };
const pass = (message) => console.log(`✔ ${message}`);

const policy = read("src/features/session/accessPolicy.ts");
const userLayout = read("app/(user)/(tabs)/_layout.tsx");
const userHomeLayout = read("app/(user)/(tabs)/(home)/_layout.tsx");
const home = read("src/features/home/screens/HomeScreen.tsx");
const homeHook = read("src/features/home/hooks/useHomeScreen.ts");
const searchHook = read("src/features/search/hooks/useSearchScreen.ts");
const topBar = read("src/components/ui/TopBar.tsx");
const authGate = read("src/features/session/AuthenticatedRouteGate.tsx");
const adoptionDetailsRoute = read("app/(user)/(tabs)/(adoption)/adoptions/[id].tsx");

const guestBlock = policy.match(/guest:\s*new Set\(\[([^\]]*)\]\)/s)?.[1] ?? "";
for (const forbidden of ["view-notifications", "apply-adoption", "view-personal-account", "view-personal-reports"]) {
  if (guestBlock.includes(forbidden)) fail(`Guest capability leak: ${forbidden}`);
}
for (const allowed of ['"browse"', '"create-report"', '"view-adoption"']) {
  if (!guestBlock.includes(allowed)) fail(`Guest discovery capability missing: ${allowed}`);
}
if (!process.exitCode) pass("Guest can discover adoption without receiving protected account capabilities");

if (!userLayout.includes('"(adoption)": USER_TABS["(adoption)"]')) fail("Guest tabs must expose Explore");
if (!/can\("view-notifications"\)\s*\?/.test(userHomeLayout)) fail("User home stack missing notification capability guard");
pass("Guest shell exposes discovery while keeping personal tabs hidden");

if (!home.includes("<GuestHomeIntro />")) fail("Guest home intro is not wired");
if (!home.includes("<HomeAdoptionSection")) fail("Guest home must retain adoption discovery cards");
if (!homeHook.includes("adoptionAction")) fail("Guest quick actions must retain adoption discovery");
pass("Guest home retains adoption discovery surfaces");

if (!searchHook.includes('can("view-adoption")')) fail("Search does not honor adoption discovery capability");
if (!searchHook.includes('can("view-notifications")')) fail("Search header does not honor notification capability");
pass("Search exposes adoption discovery without notification leakage");

if (!topBar.includes("{onNotificationsPress ? (")) fail("TopBar still renders notification affordance without permission");
else pass("TopBar removes unavailable notification affordance");

const capabilityGuarded = {
  "app/(user)/(tabs)/(notifications)/notifications.tsx": "view-notifications",
  "app/(user)/(tabs)/(profile)/profile.tsx": "view-personal-account",
  "app/(user)/(tabs)/(home)/reports/index.tsx": "view-personal-reports",
  "app/(user)/(tabs)/(adoption)/adoption.tsx": "view-adoption",
  "app/(user)/(tabs)/(adoption)/adoptions.tsx": "view-adoption",
  "app/profile/edit.tsx": "edit-personal-account",
  "app/(user)/(tabs)/(home)/reports/[id].tsx": "view-personal-reports",
};
for (const [file, capability] of Object.entries(capabilityGuarded)) {
  const source = read(file);
  if (!source.includes("CapabilityRouteGate") || !source.includes(`capability=\"${capability}\"`)) {
    fail(`${file} is not guarded by ${capability}`);
  }
}
if (!adoptionDetailsRoute.includes("AuthenticatedRouteGate")) fail("Adoption details must require authentication");
if (!authGate.includes("returnTo") || !authGate.includes("ROUTES.login")) fail("Authentication gate must preserve return destination");
if (!process.exitCode) pass("Protected guest actions are authentication-gated with return destination");
