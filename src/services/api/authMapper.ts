import type { AuthenticatedAccount, AccountStatus, AccountKind } from "@/src/types/accounts";
import type { AuthAccountDto } from "./authApi";

const normalize = (value?: string | null) => (value ?? "").trim().toUpperCase();

export function authAccountDtoToSession(dto: AuthAccountDto): AuthenticatedAccount {
  const accountType = normalize(dto.accountType);
  const kind: AccountKind = accountType === "ORGANIZATION" ? "organization" : "user";
  const rawStatus = normalize(dto.accountStatus);
  let status: AccountStatus = "active";
  if (["PENDING", "PENDING_VERIFICATION", "PENDINGVERIFICATION", "NOT_REVIEWED", "NOTREVIEWED", "IN_REVIEW", "INREVIEW"].includes(rawStatus)) status = "pending";
  else if (rawStatus === "REJECTED") status = "rejected";
  else if (rawStatus === "SUSPENDED") status = "suspended";
  else if (rawStatus === "BLOCKED") status = "blocked";
  else if (rawStatus === "DEACTIVATED") status = "deactivated";
  else if (["MORE_INFO_REQUIRED", "MOREINFOREQUIRED"].includes(rawStatus)) status = "more_info_required";

  return {
    id: dto.id,
    kind,
    status,
    displayName: dto.displayName ?? undefined,
    email: dto.email ?? undefined,
    organizationId: dto.organizationId ?? undefined,
    normalUserId: dto.normalUserId ?? undefined,
    phone: dto.phone ?? undefined,
    phoneVerified: dto.phoneVerified ?? false,
  };
}
