import type { ContentOwnerKind } from "../shared/ownership";

export type CampaignOwnerKind = Extract<ContentOwnerKind, "organization">;

export type DonationCampaignCategory =
  | "medical"
  | "food"
  | "shelter"
  | "rescue"
  | "supplies"
  | "other";

/**
 * Campaign moderation/publication lifecycle.
 * Owners can draft/submit and later pause/resume/close approved campaigns.
 * Only the moderation layer can move pending_review to active/rejected.
 */
export type DonationCampaignStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "paused"
  | "completed"
  | "closed"
  | "rejected";

export interface CampaignImpactItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface CampaignLocation {
  governorate: string;
  city?: string;
  address?: string;
}

export interface CampaignPaymentRecipient {
  fullName: string;
  mobile?: string;
  governorate: string;
  notes?: string;
}

export interface DonationCampaign {
  id: string;
  ownerAccountId: string;
  ownerKind: CampaignOwnerKind;
  ownerDisplayName: string;
  ownerLogoUrl?: string;
  ownerVerified: boolean;

  title: string;
  shortDescription: string;
  description: string;
  category: DonationCampaignCategory;
  urgent: boolean;
  coverImageUrl: string;
  images: string[];
  location: CampaignLocation;
  impactItems: CampaignImpactItem[];

  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  currency: "SYP";
  startsAt?: string;
  endsAt?: string;

  paymentRecipient: CampaignPaymentRecipient;

  status: DonationCampaignStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  pausedAt?: string;
  closedAt?: string;
  completedAt?: string;
}

export interface CreateDonationCampaignInput {
  ownerAccountId: string;
  ownerKind: CampaignOwnerKind;
  ownerDisplayName: string;
  ownerLogoUrl?: string;
  ownerVerified: boolean;
  title: string;
  shortDescription: string;
  description: string;
  category: DonationCampaignCategory;
  urgent: boolean;
  coverImageUrl: string;
  images?: string[];
  location: CampaignLocation;
  impactItems: CampaignImpactItem[];
  targetAmount: number;
  startsAt?: string;
  endsAt?: string;
  paymentRecipient: CampaignPaymentRecipient;
}

export type UpdateDonationCampaignInput = Omit<
  CreateDonationCampaignInput,
  "ownerAccountId" | "ownerKind" | "ownerDisplayName" | "ownerLogoUrl" | "ownerVerified"
> & {
  ownerDisplayName?: string;
  ownerLogoUrl?: string;
  ownerVerified?: boolean;
};

export interface CampaignReviewInput {
  reviewerId: string;
  decision: "approve" | "reject";
  rejectionReason?: string;
}
