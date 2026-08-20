import type { AccountKind } from "@/src/types/accounts";

/** Content can be created by authenticated product accounts. Administrative
 * reviewers are intentionally not modeled as content owners. */
export type ContentOwnerKind = AccountKind;

export interface ContentOwner {
  ownerAccountId: string;
  ownerAccountKind: ContentOwnerKind;
}

export function isOwnedBy(
  content: ContentOwner,
  accountId: string | null | undefined,
): boolean {
  return Boolean(accountId) && content.ownerAccountId === accountId;
}
