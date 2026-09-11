/** Canonical account model used by authentication, authorization and navigation. */
export type AccountType = "user" | "organization";
export type AccountKind = AccountType;

/**
 * UI/session compatibility status. Kept stable so existing screens do not break.
 * Backend values are mapped into this compact navigation status.
 */
export type AccountStatus = "active" | "pending" | "rejected" | "suspended" | "blocked" | "deactivated" | "more_info_required";

/** Backend-facing user lifecycle aligned with the administration dashboard. */
export type UserAccountStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED" | "DEACTIVATED";
export type UserVerificationStatus = "UNVERIFIED" | "PHONE_VERIFIED" | "VERIFIED";

/** Backend-facing organization lifecycle aligned with the administration dashboard. */
export type OrganizationAccountStatus = "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "REJECTED";
export type OrganizationVerificationStatus =
  | "NOT_REVIEWED"
  | "IN_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "MORE_INFO_REQUIRED";

export type AuthenticatedAccount = {
  id: string;
  kind: AccountKind;
  status: AccountStatus;
  displayName?: string;
  email?: string;
  organizationId?: number;
  normalUserId?: number;
  phone?: string;
  phoneVerified?: boolean;
  userAccountStatus?: UserAccountStatus;
  userVerificationStatus?: UserVerificationStatus;
  organizationAccountStatus?: OrganizationAccountStatus;
  organizationVerificationStatus?: OrganizationVerificationStatus;
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

export function mapUserAccountStatusToSession(status: UserAccountStatus): AccountStatus {
  switch (status) {
    case "ACTIVE": return "active";
    case "SUSPENDED": return "suspended";
    case "BLOCKED": return "blocked";
    case "DEACTIVATED": return "deactivated";
  }
}

export function mapOrganizationStatusToSession(
  status: OrganizationAccountStatus,
  verificationStatus?: OrganizationVerificationStatus,
): AccountStatus {
  if (verificationStatus === "MORE_INFO_REQUIRED") return "more_info_required";
  switch (status) {
    case "ACTIVE": return "active";
    case "PENDING_VERIFICATION": return "pending";
    case "REJECTED": return "rejected";
    case "SUSPENDED": return "suspended";
  }
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
