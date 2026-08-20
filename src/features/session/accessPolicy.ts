import type { AccountKind, AccountStatus, SessionPrincipal } from "@/src/types/accounts";

export type AppCapability =
  | "browse"
  | "create-report"
  | "create-feeding-point"
  | "create-adoption-listing"
  | "view-own-submissions"
  | "review-feeding-points"
  | "review-adoption-listings"
  | "view-notifications"
  | "view-adoption"
  | "apply-adoption"
  | "view-personal-account"
  | "edit-personal-account"
  | "view-personal-reports"
  | "manage-adoption-requests"
  | "submit-map-place-application"
  | "view-own-map-place-applications"
  | "edit-owned-map-place"
  | "manage-volunteer-requests"
  | "view-organization-dashboard"
  | "manage-rescue-tasks"
  | "manage-campaigns"
  | "manage-organization-profile";

export type AccessSubject = "guest" | AccountKind;

const CAPABILITIES: Record<AccessSubject, ReadonlySet<AppCapability>> = {
  guest: new Set(["browse", "create-report", "view-adoption"]),
  user: new Set([
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
    "submit-map-place-application",
    "view-own-map-place-applications",
    "edit-owned-map-place",
  ]),
  organization: new Set([
    "browse",
    "create-report",
    "create-feeding-point",
    "create-adoption-listing",
    "view-own-submissions",
    "view-notifications",
    "view-adoption",
    "apply-adoption",
    "manage-adoption-requests",
    "manage-volunteer-requests",
    "view-organization-dashboard",
    "manage-rescue-tasks",
    "manage-campaigns",
    "manage-organization-profile",
  ]),
};

export function subjectFromPrincipal(principal: SessionPrincipal): AccessSubject | null {
  if (principal.kind === "anonymous") return null;
  if (principal.kind === "guest") return "guest";
  return principal.account.kind;
}

export function can(principal: SessionPrincipal, capability: AppCapability): boolean {
  const subject = subjectFromPrincipal(principal);
  if (!subject) return false;

  // Organization accounts can authenticate while pending/rejected/suspended,
  // but privileged workspace capabilities are active-only.
  if (principal.kind === "authenticated" && principal.account.kind === "organization") {
    const status: AccountStatus = principal.account.status;
    const pendingAllowed = new Set<AppCapability>(["browse", "create-report", "view-notifications", "view-adoption"]);
    if (status !== "active" && !pendingAllowed.has(capability)) {
      return false;
    }
  }

  return CAPABILITIES[subject].has(capability);
}

export function hasAccountKind(principal: SessionPrincipal, ...kinds: AccountKind[]): boolean {
  return principal.kind === "authenticated" && kinds.includes(principal.account.kind);
}
