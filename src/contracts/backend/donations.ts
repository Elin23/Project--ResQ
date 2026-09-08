import type { BackendId, CurrencyCode, MediaDto } from "./common";

export type DonationCampaignCategory = "MEDICAL" | "FOOD" | "SHELTER" | "RESCUE" | "SUPPLIES" | "OTHER";
export type DonationCampaignStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "PAUSED"
  | "COMPLETED"
  | "CLOSED"
  | "REJECTED"
  | "DELETED";

export interface DonationCampaignDto {
  id: BackendId;
  publisher: { id: BackendId; name: string; logoUrl?: string; verified?: boolean };
  beneficiaryOrganization: { id: BackendId; name: string };
  title: string;
  shortDescription?: string;
  description: string;
  category?: DonationCampaignCategory;
  urgent?: boolean;
  media: MediaDto[];
  targetAmountMinor?: number;
  raisedAmountMinor: number;
  currency: CurrencyCode;
  donorCount: number;
  status: DonationCampaignStatus;
  submittedAt?: string;
  reviewedAt?: string;
  publishedAt?: string;
  pausedAt?: string;
  completedAt?: string;
  closedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type DonationTransferStatus = "SUBMITTED" | "VERIFYING" | "APPROVED" | "REJECTED";

export interface DonationTransferDto {
  id: BackendId;
  verificationCode: string;
  campaignId: BackendId;
  donorAccountId?: BackendId;
  donorDisplayName?: string;
  senderFullName: string;
  senderMobile?: string;
  senderGovernorateId?: BackendId;
  transferProviderId: BackendId;
  transferNumber: string;
  amountMinor: number;
  currency: CurrencyCode;
  supportMessage?: string;
  notifyOnStatusChange: boolean;
  status: DonationTransferStatus;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}
