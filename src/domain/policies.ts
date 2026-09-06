import type { CreateDonationCampaignInput } from "./donations/campaign";

/**
 * Business rules shared by mock repositories and future API adapters.
 * Server-side enforcement is still mandatory after backend integration.
 */
export function assertOrganizationCampaignOwner(input: Pick<CreateDonationCampaignInput, "ownerKind">) {
  if (input.ownerKind !== "organization") {
    throw new Error("إنشاء حملات التبرع متاح للجمعيات فقط.");
  }
}

/**
 * Commercial advertisements and public editorial content are intentionally
 * read-only in the mobile client. Their mutations belong to the admin dashboard/backend.
 */
export const MOBILE_BUSINESS_RULES = {
  donationCampaignCreation: "organization-only",
  donationCampaignPublication: "admin-approval-required",
  commercialAdsMutation: "admin-only-external-contract",
  publicContentMutation: "admin-only",
} as const;
