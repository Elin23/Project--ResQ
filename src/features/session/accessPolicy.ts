export type AppCapability =
  | "browse"
  | "create-report"
  | "view-account"
  | "edit-account"
  | "view-personal-reports"
  | "manage-adoption-requests"
  | "manage-volunteer-requests";

export type SessionMode = "guest" | "member";

const GUEST_CAPABILITIES = new Set<AppCapability>(["browse", "create-report"]);

export function can(mode: SessionMode, capability: AppCapability) {
  return mode === "member" || GUEST_CAPABILITIES.has(capability);
}
