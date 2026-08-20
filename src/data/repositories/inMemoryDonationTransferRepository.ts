import type {
  CreateDonationTransferInput,
  DonationCampaignRepository,
  DonationTransfer,
  DonationTransferRepository,
  DonationTransferReviewInput,
} from "@/src/domain";

function clone(item: DonationTransfer): DonationTransfer {
  return { ...item };
}

function verificationCode(index: number) {
  return `RSQ-TR-${String(10482 + index).padStart(5, "0")}`;
}

export class InMemoryDonationTransferRepository implements DonationTransferRepository {
  private transfers: DonationTransfer[] = [];

  constructor(private readonly campaigns: DonationCampaignRepository) {}

  async submit(input: CreateDonationTransferInput) {
    const campaign = await this.campaigns.getPublicById(input.campaignId);
    if (!campaign || campaign.status !== "active") {
      throw new Error("هذه الحملة لا تستقبل التبرعات حاليًا.");
    }
    if (!input.senderFullName.trim()) throw new Error("الاسم الكامل للمرسل مطلوب.");
    if (!input.transferNumber.trim()) throw new Error("رقم الحوالة مطلوب.");
    if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error("مبلغ الحوالة غير صالح.");

    const duplicate = this.transfers.find(
      (item) =>
        item.transferProviderId === input.transferProviderId &&
        item.transferNumber.trim().toLowerCase() === input.transferNumber.trim().toLowerCase() &&
        item.status !== "rejected",
    );
    if (duplicate) throw new Error("تم إرسال هذه الحوالة للمراجعة مسبقًا.");

    const now = new Date().toISOString();
    const transfer: DonationTransfer = {
      id: `donation-transfer-${Date.now()}-${this.transfers.length}`,
      verificationCode: verificationCode(this.transfers.length),
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      donorAccountId: input.donorAccountId,
      donorDisplayName: input.donorDisplayName?.trim() || undefined,
      senderFullName: input.senderFullName.trim(),
      senderMobile: input.senderMobile?.trim() || undefined,
      senderGovernorate: input.senderGovernorate.trim(),
      transferProviderId: input.transferProviderId,
      transferProviderName: input.transferProviderName.trim(),
      transferNumber: input.transferNumber.trim(),
      amount: input.amount,
      currency: "SYP",
      supportMessage: input.supportMessage?.trim() || undefined,
      notifyOnStatusChange: input.notifyOnStatusChange ?? true,
      status: "submitted",
      createdAt: now,
      updatedAt: now,
    };
    this.transfers.unshift(transfer);
    return clone(transfer);
  }

  async listByDonor(donorAccountId: string) {
    return this.transfers
      .filter((item) => item.donorAccountId === donorAccountId)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .map(clone);
  }

  async getByDonor(id: string, donorAccountId: string) {
    const item = this.transfers.find(
      (transfer) => transfer.id === id && transfer.donorAccountId === donorAccountId,
    );
    return item ? clone(item) : undefined;
  }

  async getByVerificationCode(code: string) {
    const item = this.transfers.find(
      (transfer) => transfer.verificationCode.toLowerCase() === code.trim().toLowerCase(),
    );
    return item ? clone(item) : undefined;
  }

  async listByCampaignOwner(campaignId: string, ownerAccountId: string) {
    const campaign = await this.campaigns.getOwnedById(campaignId, ownerAccountId);
    if (!campaign) throw new Error("الحملة غير موجودة أو لا تملك صلاحية الوصول إلى حوالاتها.");
    return this.transfers
      .filter((transfer) => transfer.campaignId === campaignId)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .map(clone);
  }

  async markVerifying(id: string, reviewerId: string) {
    const index = this.transfers.findIndex((transfer) => transfer.id === id);
    if (index < 0) throw new Error("طلب التحقق غير موجود.");
    const current = this.transfers[index];
    if (current.status !== "submitted") throw new Error("طلب التحقق ليس في مرحلة الاستلام.");
    const now = new Date().toISOString();
    const next: DonationTransfer = {
      ...current,
      status: "verifying",
      verifyingAt: now,
      reviewedBy: reviewerId,
      updatedAt: now,
    };
    this.transfers[index] = next;
    return clone(next);
  }

  async review(id: string, input: DonationTransferReviewInput) {
    const index = this.transfers.findIndex((transfer) => transfer.id === id);
    if (index < 0) throw new Error("طلب التحقق غير موجود.");
    const current = this.transfers[index];
    if (current.status !== "verifying") throw new Error("يجب بدء التحقق من الحوالة قبل اعتماد القرار.");
    if (input.decision === "reject" && !input.rejectionReason?.trim()) {
      throw new Error("سبب رفض الحوالة مطلوب.");
    }

    // Campaign accounting happens before the transfer becomes approved, so a
    // failed campaign update cannot leave an approved transfer without accounting.
    if (input.decision === "approve") {
      await this.campaigns.recordVerifiedDonation(current.campaignId, current.amount);
    }

    const now = new Date().toISOString();
    const next: DonationTransfer = {
      ...current,
      status: input.decision === "approve" ? "approved" : "rejected",
      reviewedAt: now,
      reviewedBy: input.reviewerId,
      rejectionReason: input.decision === "reject" ? input.rejectionReason!.trim() : undefined,
      updatedAt: now,
    };
    this.transfers[index] = next;
    return clone(next);
  }
}
