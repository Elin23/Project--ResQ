import type { DonationCampaign, DonationTransfer } from "@/src/domain";
import type { DonationCampaignDto, DonationTransferDto } from "@/src/contracts/backend/donations";

export function donationCampaignDtoToDomain(dto: DonationCampaignDto): DonationCampaign {
  const category = dto.category?.toLowerCase() as DonationCampaign["category"] | undefined;
  return {
    id: dto.id,
    ownerAccountId: dto.publisher.id,
    ownerKind: "organization",
    ownerDisplayName: dto.publisher.name,
    ownerLogoUrl: dto.publisher.logoUrl,
    ownerVerified: dto.publisher.verified ?? true,
    title: dto.title,
    shortDescription: dto.shortDescription ?? dto.description.slice(0, 120),
    description: dto.description,
    category: category ?? "other",
    urgent: dto.urgent ?? false,
    coverImageUrl: dto.media[0]?.url ?? "",
    images: dto.media.map((item) => item.url),
    location: { governorate: "", city: undefined },
    impactItems: [],
    targetAmount: dto.targetAmountMinor ?? 0,
    raisedAmount: dto.raisedAmountMinor,
    donorCount: dto.donorCount,
    currency: dto.currency,
    startsAt: dto.publishedAt,
    paymentRecipient: { fullName: dto.beneficiaryOrganization.name, governorate: "" },
    status: dto.status === "PUBLISHED" ? "active" : dto.status === "PENDING_REVIEW" ? "pending_review" : dto.status === "PAUSED" ? "paused" : dto.status === "COMPLETED" ? "completed" : dto.status === "CLOSED" || dto.status === "DELETED" ? "closed" : dto.status === "REJECTED" ? "rejected" : "draft",
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    submittedAt: dto.submittedAt,
    reviewedAt: dto.reviewedAt,
    rejectionReason: dto.rejectionReason,
    pausedAt: dto.pausedAt,
    closedAt: dto.closedAt,
    completedAt: dto.completedAt,
  };
}

export function donationTransferDtoToDomain(dto: DonationTransferDto, campaignTitle = ""): DonationTransfer {
  return {
    id: dto.id,
    verificationCode: dto.verificationCode,
    campaignId: dto.campaignId,
    campaignTitle,
    donorAccountId: dto.donorAccountId,
    donorDisplayName: dto.donorDisplayName,
    senderFullName: dto.senderFullName,
    senderMobile: dto.senderMobile,
    senderGovernorate: "",
    transferProviderId: dto.transferProviderId,
    transferProviderName: "",
    transferNumber: dto.transferNumber,
    amount: dto.amountMinor,
    currency: dto.currency,
    supportMessage: dto.supportMessage,
    notifyOnStatusChange: dto.notifyOnStatusChange,
    status: dto.status === "VERIFYING" ? "verifying" : dto.status === "APPROVED" ? "approved" : dto.status === "REJECTED" ? "rejected" : "submitted",
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    rejectionReason: dto.rejectionReason,
  };
}
