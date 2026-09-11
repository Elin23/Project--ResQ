export interface DonationCampaignMediaDto {
  id: number;
  type?: string | null;
  url?: string | null;
  thumbnailUrl?: string | null;
}

export interface DonationCampaignDto {
  id: number;
  code?: string | null;
  organizationId: number;
  organizationName?: string | null;

  beneficiaryOrganizationId?: number | null;
  beneficiaryOrganizationName?: string | null;

  title?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  category?: string | null;
  urgent: boolean;

  targetAmountMinor: number;
  raisedAmountMinor: number;
  donorCount: number;
  currency?: string | null;
  status?: string | null;

  startAt?: string | null;
  endAt?: string | null;
  submittedAt?: string | null;
  publishedAt?: string | null;
  completedAt?: string | null;
  closedAt?: string | null;
  rejectionReason?: string | null;

  /**
   * Optional payment-recipient metadata returned by some campaign API responses.
   * These fields are intentionally optional because older/other endpoints may
   * omit them completely.
   */
  recipientName?: string | null;
  recipientAccount?: string | null;
  transferInstructions?: string | null;

  media?: DonationCampaignMediaDto[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface DonationTransferDto {
  id: number;
  verificationCode?: string | null;
  campaignId: number;
  campaignTitle?: string | null;
  donorAccountId?: string | null;
  donorDisplayName?: string | null;
  senderFullName?: string | null;
  senderMobile: string;
  senderGovernorateId?: number | null;
  senderGovernorateName?: string | null;
  transferProviderId: number;
  transferProviderName?: string | null;
  transferNumber?: string | null;
  amountMinor: number;
  currency?: string | null;
  supportMessage?: string | null;
  notifyOnStatusChange: boolean;
  status?: string | null;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
}

export type DonationTransferStatus =
  | "SUBMITTED"
  | "VERIFYING"
  | "APPROVED"
  | "REJECTED";

export type DonationCampaignCategory =
  | "MEDICAL"
  | "FOOD"
  | "SHELTER"
  | "RESCUE"
  | "SUPPLIES"
  | "OTHER";

export type DonationCampaignStatus = string;

export interface TransferProviderDto {
  id: number;
  code: string;
  name: string;
  nameEn?: string | null;
  instructions?: string | null;
  recipientName?: string | null;
  recipientAccount?: string | null;
}
