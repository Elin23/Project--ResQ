/** Canonical account model used by authentication, authorization and navigation. */
export type AccountType = "user" | "organization";
export type AccountKind = AccountType;
export type AccountStatus = "active" | "pending" | "rejected" | "suspended";

export type AuthenticatedAccount = {
  id: string;
  kind: AccountKind;
  status: AccountStatus;
  displayName?: string;
  email?: string;
};

export type SessionPrincipal =
  | { kind: "anonymous" }
  | { kind: "guest" }
  | { kind: "authenticated"; account: AuthenticatedAccount };

/**
 * Public users are activated after identity verification. Organizations are
 * privileged operational accounts and must be explicitly approved.
 */
export function initialAccountStatus(kind: AccountKind): AccountStatus {
  return kind === "organization" ? "pending" : "active";
}

/**
 * Volunteering is intentionally not an account type. A normal user can submit
 * a volunteer application to an organization and keep the same user account.
 */
export interface VolunteerApplication {
  id: string;
  userId: string;
  organizationId: string;
  motivation?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
