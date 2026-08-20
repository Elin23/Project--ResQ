export type ScreenOwner = "public" | "auth" | "user" | "organization" | "shared" | "legacy";
export type ScreenAccess = "anonymous" | "guest" | "authenticated" | "active-account" | "mixed";
export type ScreenStateRequirement = "loading" | "empty" | "error" | "content" | "success" | "permission";

export type ScreenDefinition = {
  route: string;
  owner: ScreenOwner;
  access: ScreenAccess;
  purpose: string;
  states: readonly ScreenStateRequirement[];
  legacy?: boolean;
};

const CONTENT = ["content"] as const;
const DATA = ["loading", "empty", "error", "content"] as const;

/**
 * Product-level source of truth for route ownership and expected UX states.
 * This is intentionally independent from Expo Router so product rules can be tested
 * without mounting navigation.
 */
export const SCREEN_CATALOG: readonly ScreenDefinition[] = [
  { route: "/", owner: "public", access: "mixed", purpose: "Resolve launch destination", states: CONTENT },
  { route: "/welcome", owner: "public", access: "anonymous", purpose: "Introduce ResQ before authentication", states: CONTENT },
  { route: "/onboarding", owner: "public", access: "anonymous", purpose: "Explain core product value", states: CONTENT },
  { route: "/login", owner: "auth", access: "anonymous", purpose: "Authenticate an existing account", states: ["content", "error"] },
  { route: "/choose-account", owner: "auth", access: "anonymous", purpose: "Choose registration account type", states: CONTENT },
  { route: "/register-user", owner: "auth", access: "anonymous", purpose: "Create a personal account", states: ["content", "error", "success"] },
  { route: "/register-entity", owner: "auth", access: "anonymous", purpose: "Create organization account", states: ["content", "error", "success"] },
  { route: "/verify-registration-phone", owner: "auth", access: "anonymous", purpose: "Verify registration phone", states: ["content", "error", "success"] },
  { route: "/registration-pending", owner: "auth", access: "authenticated", purpose: "Explain entity review state", states: CONTENT },
  { route: "/registration-success", owner: "auth", access: "authenticated", purpose: "Confirm successful registration", states: ["success"] },

  { route: "/(user)/(tabs)", owner: "user", access: "mixed", purpose: "Personal/guest home workspace", states: DATA },
  { route: "/reports", owner: "user", access: "mixed", purpose: "Personal reports or guest community reports", states: DATA },
  { route: "/reports/create", owner: "shared", access: "mixed", purpose: "Create a rescue report", states: ["content", "error", "success"] },
  { route: "/reports/[id]", owner: "shared", access: "mixed", purpose: "View a rescue report", states: DATA },
  { route: "/reports/success", owner: "shared", access: "mixed", purpose: "Confirm report submission", states: ["success"] },
  { route: "/map", owner: "user", access: "mixed", purpose: "Explore nearby rescue activity", states: DATA },
  { route: "/notifications", owner: "user", access: "mixed", purpose: "Personal notifications", states: DATA },
  { route: "/profile", owner: "user", access: "authenticated", purpose: "Personal profile", states: DATA },
  { route: "/map-places", owner: "user", access: "authenticated", purpose: "Manage owned map places and appearance applications", states: DATA },
  { route: "/map-places/apply", owner: "user", access: "authenticated", purpose: "Submit a map-place appearance application", states: ["content", "error", "success"] },
  { route: "/map-places/applications/[id]", owner: "user", access: "authenticated", purpose: "View an owned map-place application", states: DATA },
  { route: "/map-places/applications/[id]/edit", owner: "user", access: "authenticated", purpose: "Edit and resubmit a draft or rejected map-place application", states: ["loading", "error", "content", "permission", "success"] },
  { route: "/map-places/[id]/edit", owner: "user", access: "authenticated", purpose: "Edit an approved map place owned by the current user", states: ["loading", "error", "content", "permission", "success"] },
  { route: "/map-places/[id]/change-request", owner: "user", access: "authenticated", purpose: "Request review of sensitive map-place identity, location, or verification changes", states: ["loading", "error", "content", "permission", "success"] },
  { route: "/adoption", owner: "user", access: "mixed", purpose: "Explore adoption content", states: DATA },
  { route: "/adoptions", owner: "shared", access: "mixed", purpose: "Browse available adoption listings", states: DATA },
  { route: "/adoptions/[id]", owner: "shared", access: "mixed", purpose: "View an adoption listing", states: DATA },
  { route: "/search", owner: "user", access: "mixed", purpose: "Search animals, organizations and content", states: DATA },

  { route: "/organization", owner: "organization", access: "active-account", purpose: "Organization operating dashboard", states: DATA },
  { route: "/organization/reports", owner: "organization", access: "active-account", purpose: "Incoming rescue reports for organization triage", states: DATA },
  { route: "/organization/reports/[id]", owner: "organization", access: "active-account", purpose: "Organization triage view of a report", states: DATA },
  { route: "/organization/tasks", owner: "organization", access: "active-account", purpose: "Organization rescue tasks", states: DATA },
  { route: "/organization/tasks/[id]", owner: "organization", access: "active-account", purpose: "Operate a rescue task", states: DATA },
  { route: "/organization/tasks/[id]/completed", owner: "organization", access: "active-account", purpose: "Task completion receipt", states: ["success"] },
  { route: "/organization/map", owner: "organization", access: "active-account", purpose: "Operational organization map", states: DATA },
  { route: "/organization/notifications", owner: "organization", access: "active-account", purpose: "Organization notifications", states: DATA },
  { route: "/organization/profile", owner: "organization", access: "active-account", purpose: "Organization profile and operations settings", states: DATA },


  { route: "/organizations", owner: "shared", access: "mixed", purpose: "Browse approved organizations", states: DATA },
  { route: "/organizations/[id]", owner: "shared", access: "mixed", purpose: "View an organization profile", states: DATA },
  { route: "/feeding-points/[id]", owner: "shared", access: "mixed", purpose: "View feeding point details", states: DATA },
  { route: "/donations", owner: "shared", access: "mixed", purpose: "Donation entry point", states: DATA },
  { route: "/help-center", owner: "public", access: "mixed", purpose: "Help and support", states: CONTENT },
  { route: "/contact-us", owner: "public", access: "mixed", purpose: "Contact support", states: ["content", "error", "success"] },
  { route: "/about", owner: "public", access: "mixed", purpose: "About ResQ", states: CONTENT },
  { route: "/privacy-policy", owner: "public", access: "mixed", purpose: "Privacy policy", states: CONTENT },
  { route: "/terms-and-conditions", owner: "public", access: "mixed", purpose: "Terms and conditions", states: CONTENT },

  { route: "/organization-dashboard", owner: "legacy", access: "active-account", purpose: "Compatibility redirect", states: CONTENT, legacy: true },
  { route: "/report-details", owner: "legacy", access: "mixed", purpose: "Compatibility redirect", states: CONTENT, legacy: true },
] as const;

export function findScreenDefinition(route: string) {
  return SCREEN_CATALOG.find((screen) => screen.route === route);
}
