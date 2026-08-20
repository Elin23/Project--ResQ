import type {
  CampaignReviewInput,
  CreateDonationCampaignInput,
  DonationCampaign,
  UpdateDonationCampaignInput,
} from "./campaign";

export interface DonationCampaignRepository {
  listPublic(): Promise<DonationCampaign[]>;
  getPublicById(id: string): Promise<DonationCampaign | undefined>;
  listByOwner(ownerAccountId: string): Promise<DonationCampaign[]>;
  getOwnedById(id: string, ownerAccountId: string): Promise<DonationCampaign | undefined>;

  createDraft(input: CreateDonationCampaignInput): Promise<DonationCampaign>;
  updateOwned(
    id: string,
    ownerAccountId: string,
    input: UpdateDonationCampaignInput,
  ): Promise<DonationCampaign>;
  submitForReview(id: string, ownerAccountId: string): Promise<DonationCampaign>;

  /** Reserved for the future Admin Web Dashboard. */
  review(id: string, input: CampaignReviewInput): Promise<DonationCampaign>;

  pauseOwned(id: string, ownerAccountId: string): Promise<DonationCampaign>;
  resumeOwned(id: string, ownerAccountId: string): Promise<DonationCampaign>;
  closeOwned(id: string, ownerAccountId: string): Promise<DonationCampaign>;

  /** Internal accounting operation called only by verified donation review. */
  recordVerifiedDonation(id: string, amount: number): Promise<DonationCampaign>;
}
