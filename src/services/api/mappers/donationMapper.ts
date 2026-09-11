import { resolveMediaUrl } from "../mediaUrl";
import type { DonationCampaign, DonationTransfer } from "@/src/domain";
import type { DonationCampaignDto, DonationTransferDto } from "@/src/contracts/backend/donations";

export function donationCampaignDtoToDomain(dto: DonationCampaignDto): DonationCampaign {
  const media = dto.media ?? [];
  const apiCategory = (dto.category ?? "OTHER").toUpperCase();
  const category: DonationCampaign["category"] = apiCategory === "MEDICAL_CARE" || apiCategory === "EMERGENCY_TREATMENT"
    ? "medical"
    : apiCategory === "FOOD_SUPPORT"
      ? "food"
      : apiCategory === "SHELTER"
        ? "shelter"
        : apiCategory === "RESCUE"
          ? "rescue"
          : apiCategory === "GENERAL"
            ? "supplies"
            : "other";
  const status: DonationCampaign["status"] = dto.status === "PUBLISHED" || dto.status === "ACTIVE" ? "active" : dto.status === "PENDING_REVIEW" ? "pending_review" : dto.status === "PAUSED" ? "paused" : dto.status === "COMPLETED" ? "completed" : dto.status === "CLOSED" || dto.status === "DELETED" ? "closed" : dto.status === "REJECTED" ? "rejected" : "draft";
  return {
    id:String(dto.id), ownerAccountId:String(dto.organizationId), ownerKind:"organization", ownerDisplayName:dto.organizationName ?? "جمعية",
    ownerVerified:true, title:dto.title ?? "حملة تبرع", shortDescription:dto.shortDescription ?? (dto.description ?? "").slice(0,120), description:dto.description ?? "",
    category, urgent:dto.urgent,
    coverImageUrl:resolveMediaUrl(media[0]?.url), images:media.map((m)=>resolveMediaUrl(m.url)).filter(Boolean), mediaIds:media.map((m)=>String(m.id)),
    targetAmount:dto.targetAmountMinor, raisedAmount:dto.raisedAmountMinor, targetAmountMinor:dto.targetAmountMinor, raisedAmountMinor:dto.raisedAmountMinor,
    donorCount:dto.donorCount, currency:"SYP", startsAt:dto.startAt ?? undefined, endsAt:dto.endAt ?? undefined,
    paymentRecipient: dto.recipientName || dto.recipientAccount || dto.transferInstructions ? {
      fullName: dto.recipientName ?? "",
      governorate: "",
      notes: [dto.recipientAccount ? `رقم المستلم/الحساب: ${dto.recipientAccount}` : "", dto.transferInstructions ?? ""].filter(Boolean).join("\n"),
    } : undefined,
    status,
    createdAt:dto.createdAt, updatedAt:dto.updatedAt, submittedAt:dto.submittedAt ?? undefined, reviewedAt:dto.publishedAt ?? undefined,
    rejectionReason:dto.rejectionReason ?? undefined, closedAt:dto.closedAt ?? undefined, completedAt:dto.completedAt ?? undefined,
  };
}

export function donationTransferDtoToDomain(dto: DonationTransferDto, campaignTitle = ""): DonationTransfer {
  const status: DonationTransfer["status"] = dto.status === "VERIFYING" ? "verifying" : dto.status === "APPROVED" ? "approved" : dto.status === "REJECTED" ? "rejected" : "submitted";
  const createdAt = dto.submittedAt ?? dto.createdAt ?? new Date().toISOString();
  return { id:String(dto.id), verificationCode:dto.verificationCode ?? String(dto.id), campaignId:String(dto.campaignId), campaignTitle: dto.campaignTitle ?? campaignTitle, donorAccountId:dto.donorAccountId ?? undefined, donorDisplayName:dto.donorDisplayName ?? undefined, senderFullName:dto.senderFullName ?? "", senderMobile:dto.senderMobile ?? undefined, senderGovernorateId:dto.senderGovernorateId != null ? String(dto.senderGovernorateId) : undefined, senderGovernorate:dto.senderGovernorateName ?? "", transferProviderId:String(dto.transferProviderId), transferProviderName:dto.transferProviderName ?? "", transferNumber:dto.transferNumber ?? "", amount:dto.amountMinor, amountMinor:dto.amountMinor, currency:"SYP", supportMessage:dto.supportMessage ?? undefined, notifyOnStatusChange:dto.notifyOnStatusChange, status, createdAt, updatedAt:dto.updatedAt ?? dto.reviewedAt ?? createdAt, reviewedAt:dto.reviewedAt ?? undefined, rejectionReason:dto.rejectionReason ?? undefined };
}
