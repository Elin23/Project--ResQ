import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const failures = [];

function must(file, token, label = token) {
  if (!exists(file) || !read(file).includes(token)) {
    failures.push(`${file}: missing ${label}`);
  }
}
function subjectBlock(subject) {
  const source = read("src/features/session/accessPolicy.ts");
  const re = new RegExp(`${subject}:\\s*new Set\\(\\[([\\s\\S]*?)\\]\\)`);
  return re.exec(source)?.[1] ?? "";
}
function expectCapability(subject, capability, expected = true) {
  const block = subjectBlock(subject);
  const has = block.includes(`"${capability}"`);
  if (has !== expected) {
    failures.push(`accessPolicy: ${subject} ${expected ? "must have" : "must not have"} ${capability}`);
  }
}

// Guest: browse/report only; no adoption action, notifications, account or creation flows.
for (const capability of ["browse", "create-report", "view-adoption"]) {
  expectCapability("guest", capability, true);
}
for (const capability of [
  "apply-adoption",
  "create-adoption-listing",
  "create-feeding-point",
  "view-notifications",
  "view-personal-account",
  "manage-campaigns",
]) {
  expectCapability("guest", capability, false);
}
must("app/(user)/(tabs)/_layout.tsx", 'const GUEST_TABS', "guest-specific navbar");
must("app/(user)/(tabs)/_layout.tsx", 'href: isGuest ? null : undefined', "guest notifications/profile hidden");
must("app/(user)/(tabs)/(adoption)/adoptions/[id].tsx", "AuthenticatedRouteGate", "guest adoption detail login boundary");
must("app/adoptions/[id]/apply.tsx", 'capability="apply-adoption"', "adoption apply capability boundary");
must("app/adoptions/create.tsx", 'capability="create-adoption-listing"', "adoption listing create boundary");
must("app/feeding-points/create.tsx", 'capability="create-feeding-point"', "feeding point create boundary");

// Normal user: full personal/community lifecycle.
for (const capability of [
  "browse",
  "create-report",
  "create-feeding-point",
  "create-adoption-listing",
  "view-own-submissions",
  "view-notifications",
  "view-adoption",
  "apply-adoption",
  "view-personal-account",
  "edit-personal-account",
  "view-personal-reports",
  "manage-adoption-requests",
]) {
  expectCapability("user", capability, true);
}
expectCapability("user", "manage-campaigns", false);
expectCapability("user", "manage-rescue-tasks", false);

// Organization: rescue operations + campaign/entity management + adoption ownership/applicant lifecycle.
for (const capability of [
  "browse",
  "create-report",
  "create-feeding-point",
  "create-adoption-listing",
  "view-own-submissions",
  "view-notifications",
  "view-adoption",
  "apply-adoption",
  "manage-adoption-requests",
  "view-organization-dashboard",
  "manage-rescue-tasks",
  "manage-campaigns",
  "manage-organization-profile",
]) {
  expectCapability("organization", capability, true);
}
must("app/organization/_layout.tsx", 'principal.account.kind !== "organization"', "organization workspace account-kind guard");
must("app/organization/(tabs)/(home)/adoptions/index.tsx", 'capability="view-adoption"', "organization public adoption discovery");
must("app/organization/(tabs)/(home)/adoptions/[id].tsx", 'capability="apply-adoption"', "organization adoption details");

// Owner-only adoption request routes must be protected in all workspaces.
for (const file of [
  "app/(user)/(tabs)/(adoption)/adoptions/my-listings/[id]/applications/index.tsx",
  "app/(user)/(tabs)/(adoption)/adoptions/my-listings/[id]/applications/[applicationId].tsx",
  "app/organization/(tabs)/(home)/adoptions/my-listings/[id]/applications/index.tsx",
  "app/organization/(tabs)/(home)/adoptions/my-listings/[id]/applications/[applicationId].tsx",
]) {
  must(file, "AuthenticatedRouteGate", "authenticated owner boundary");
  must(file, 'capability="manage-adoption-requests"', "adoption-request management capability");
}

// Campaign creation/editing is restricted to organizations at the focused-route boundary.
must("app/campaigns/create.tsx", "CampaignManagerRouteGate", "campaign creation gate");
must("app/campaigns/[id]/edit.tsx", "CampaignManagerRouteGate", "campaign edit gate");
must("src/features/donations/CampaignManagerRouteGate.tsx", 'principal.account.kind !== "organization"', "campaign organization-only boundary");
must("src/features/donations/CampaignManagerRouteGate.tsx", 'can("manage-campaigns")', "campaign capability check");

// Focus/data-entry routes must retain explicit authentication/capability checks.
for (const [file, token] of [
  ["app/adoptions/[id]/apply.tsx", "AuthenticatedRouteGate"],
  ["app/adoptions/create.tsx", "AuthenticatedRouteGate"],
  ["app/adoptions/my-listings/[id]/edit.tsx", "AuthenticatedRouteGate"],
  ["app/feeding-points/create.tsx", "AuthenticatedRouteGate"],
]) {
  must(file, token, "focused-route authentication");
}

// Shared screens must preserve the active workspace rather than jumping into the user shell.
must("src/features/explore/screens/ExploreScreen.tsx", "adoptionRoute(browseKind)", "explore adoption workspace routing");
must("src/features/explore/screens/ExploreScreen.tsx", "adoptionDetailsRoute(listing.id, browseKind)", "explore detail workspace routing");
must("src/features/adoption/screens/AdoptionScreen.tsx", "adoptionMyApplicationsRoute(accountKind)", "adoption applicant history workspace routing");
must("src/features/adoption/screens/MyAdoptionApplicationsScreen.tsx", "adoptionApplicationDetailsRoute(application.id, accountKind)", "application detail workspace routing");
must("src/features/reports/screens/ReportsScreen.tsx", "reportDetailsRoute(report.id, accountKind)", "reports workspace routing");
must("src/features/reports/components/ReportSuccessView.tsx", 'reportDetailsRoute("1", accountKind)', "post-report workspace routing");
must("src/features/notifications/screens/NotificationsScreen.tsx", "adoptionApplicationDetailsRoute(t.applicationId,browseKind)", "notification adoption routing");
must("src/features/notifications/screens/NotificationsScreen.tsx", "reportDetailsRoute(t.reportId,browseKind)", "notification report routing");

// Workspace route helpers must preserve user/organization workspaces.
for (const token of [
  "export function adoptionRoute",
  "export function adoptionDetailsRoute",
  "export function adoptionMyApplicationsRoute",
  "export function adoptionApplicationDetailsRoute",
  "export function reportDetailsRoute",
  "export function feedingPointsRoute",
  "export function donationsRoute",
  "export function veterinaryClinicsRoute",
]) {
  must("src/navigation/routes.ts", token, `workspace helper ${token}`);
}

if (failures.length) {
  console.error("Roles/E2E audit failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(
  "Roles/E2E audit passed: Guest/User/Organization capability matrices, workspace guards, adoption ownership, focused data-entry gates, campaign restrictions, notification/report deep links, and workspace-aware adoption flows are coherent.",
);
