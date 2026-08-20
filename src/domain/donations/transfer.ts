export type DonationTransferStatus = "submitted" | "verifying" | "approved" | "rejected";

export interface DonationTransfer {
  id: string;
  verificationCode: string;
  campaignId: string;
  campaignTitle: string;
  donorAccountId?: string;
  donorDisplayName?: string;
  senderFullName: string;
  senderMobile?: string;
  senderGovernorate: string;
  transferProviderId: string;
  transferProviderName: string;
  transferNumber: string;
  amount: number;
  currency: "SYP";
  supportMessage?: string;
  notifyOnStatusChange: boolean;
  status: DonationTransferStatus;
  createdAt: string;
  updatedAt: string;
  verifyingAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface CreateDonationTransferInput {
  campaignId: string;
  donorAccountId?: string;
  donorDisplayName?: string;
  senderFullName: string;
  senderMobile?: string;
  senderGovernorate: string;
  transferProviderId: string;
  transferProviderName: string;
  transferNumber: string;
  amount: number;
  supportMessage?: string;
  notifyOnStatusChange?: boolean;
}

export interface DonationTransferReviewInput {
  reviewerId: string;
  decision: "approve" | "reject";
  rejectionReason?: string;
}
