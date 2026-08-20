import type {
  CreateDonationTransferInput,
  DonationTransfer,
  DonationTransferReviewInput,
} from "./transfer";

export interface DonationTransferRepository {
  submit(input: CreateDonationTransferInput): Promise<DonationTransfer>;
  listByDonor(donorAccountId: string): Promise<DonationTransfer[]>;
  getByDonor(id: string, donorAccountId: string): Promise<DonationTransfer | undefined>;
  getByVerificationCode(code: string): Promise<DonationTransfer | undefined>;
  listByCampaignOwner(
    campaignId: string,
    ownerAccountId: string,
  ): Promise<DonationTransfer[]>;

  /** Reserved for the future Admin Web Dashboard. */
  markVerifying(id: string, reviewerId: string): Promise<DonationTransfer>;
  review(id: string, input: DonationTransferReviewInput): Promise<DonationTransfer>;
}
