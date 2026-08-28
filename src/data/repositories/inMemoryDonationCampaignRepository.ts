import type {
  CampaignReviewInput,
  CreateDonationCampaignInput,
  DonationCampaign,
  DonationCampaignRepository,
  UpdateDonationCampaignInput,
} from "@/src/domain";
import { DONATION_CAMPAIGN_SEED } from "../donationCampaigns.seed";

function clone(item: DonationCampaign): DonationCampaign {
  return {
    ...item,
    images: [...item.images],
    location: { ...item.location },
    impactItems: item.impactItems.map((impact) => ({ ...impact })),
    paymentRecipient: { ...item.paymentRecipient },
  };
}

function validateDraftInput(input: Pick<CreateDonationCampaignInput, "title">) {
  if (!input.title.trim()) throw new Error("اسم الحملة مطلوب لحفظ المسودة.");
}

function validateCampaignInput(
  input: Pick<
    CreateDonationCampaignInput,
    | "title"
    | "shortDescription"
    | "description"
    | "targetAmount"
    | "impactItems"
    | "coverImageUrl"
    | "location"
    | "paymentRecipient"
  >,
) {
  if (!input.title.trim()) throw new Error("اسم الحملة مطلوب.");
  if (!input.shortDescription.trim()) throw new Error("الوصف المختصر مطلوب.");
  if (!input.description.trim()) throw new Error("تفاصيل الحملة مطلوبة.");
  if (!input.coverImageUrl.trim()) throw new Error("صورة الحملة مطلوبة.");
  if (!Number.isFinite(input.targetAmount) || input.targetAmount <= 0) {
    throw new Error("المبلغ المستهدف يجب أن يكون أكبر من صفر.");
  }
  if (!input.location.governorate.trim()) throw new Error("محافظة الحملة مطلوبة.");
  if (!input.impactItems.length) throw new Error("أضف هدفًا واحدًا على الأقل لاستخدام التبرعات.");
  if (!input.paymentRecipient.fullName.trim()) throw new Error("اسم مستلم الحوالات مطلوب.");
  if (!input.paymentRecipient.governorate.trim()) throw new Error("محافظة مستلم الحوالات مطلوبة.");
}

export class InMemoryDonationCampaignRepository implements DonationCampaignRepository {
  private campaigns = DONATION_CAMPAIGN_SEED.map(clone);
  private idCounter = 0;

  async listPublic() {
    return this.campaigns
      .filter((campaign) => ["active", "completed"].includes(campaign.status))
      .sort((a, b) => Number(b.urgent) - Number(a.urgent) || Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .map(clone);
  }

  async getPublicById(id: string) {
    const campaign = this.campaigns.find(
      (item) => item.id === id && ["active", "completed"].includes(item.status),
    );
    return campaign ? clone(campaign) : undefined;
  }

  async listByOwner(ownerAccountId: string) {
    return this.campaigns
      .filter((campaign) => campaign.ownerAccountId === ownerAccountId)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .map(clone);
  }

  async getOwnedById(id: string, ownerAccountId: string) {
    const campaign = this.campaigns.find(
      (item) => item.id === id && item.ownerAccountId === ownerAccountId,
    );
    return campaign ? clone(campaign) : undefined;
  }

  async createDraft(input: CreateDonationCampaignInput) {
    validateDraftInput(input);
    const now = new Date().toISOString();
    const campaign: DonationCampaign = {
      ...input,
      id: `campaign-${Date.now()}-${++this.idCounter}`,
      title: input.title.trim(),
      shortDescription: input.shortDescription.trim(),
      description: input.description.trim(),
      images: input.images?.length
        ? [...input.images]
        : input.coverImageUrl.trim()
          ? [input.coverImageUrl]
          : [],
      impactItems: input.impactItems.map((impact) => ({ ...impact })),
      location: { ...input.location },
      paymentRecipient: { ...input.paymentRecipient },
      raisedAmount: 0,
      donorCount: 0,
      currency: "SYP",
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    this.campaigns.unshift(clone(campaign));
    return clone(campaign);
  }

  async updateOwned(id: string, ownerAccountId: string, input: UpdateDonationCampaignInput) {
    const index = this.campaigns.findIndex(
      (campaign) => campaign.id === id && campaign.ownerAccountId === ownerAccountId,
    );
    if (index < 0) throw new Error("الحملة غير موجودة أو لا تملك صلاحية تعديلها.");
    const current = this.campaigns[index];
    if (["pending_review", "completed", "closed"].includes(current.status)) {
      throw new Error("لا يمكن تعديل الحملة في حالتها الحالية.");
    }
    if (["draft", "rejected"].includes(current.status)) {
      validateDraftInput(input);
    } else {
      validateCampaignInput(input);
    }
    if (
      Number.isFinite(input.targetAmount) &&
      input.targetAmount > 0 &&
      input.targetAmount < current.raisedAmount
    ) {
      throw new Error("لا يمكن جعل الهدف المالي أقل من المبلغ المحقق.");
    }

    const updated: DonationCampaign = {
      ...current,
      ...input,
      ownerAccountId: current.ownerAccountId,
      ownerKind: current.ownerKind,
      ownerDisplayName: input.ownerDisplayName ?? current.ownerDisplayName,
      ownerLogoUrl: input.ownerLogoUrl ?? current.ownerLogoUrl,
      ownerVerified: input.ownerVerified ?? current.ownerVerified,
      title: input.title.trim(),
      shortDescription: input.shortDescription.trim(),
      description: input.description.trim(),
      images: input.images?.length
        ? [...input.images]
        : input.coverImageUrl.trim()
          ? [input.coverImageUrl]
          : [],
      impactItems: input.impactItems.map((impact) => ({ ...impact })),
      location: { ...input.location },
      paymentRecipient: { ...input.paymentRecipient },
      updatedAt: new Date().toISOString(),
      rejectionReason: current.status === "rejected" ? undefined : current.rejectionReason,
      reviewedAt: current.status === "rejected" ? undefined : current.reviewedAt,
      reviewedBy: current.status === "rejected" ? undefined : current.reviewedBy,
      status: current.status === "rejected" ? "draft" : current.status,
    };
    this.campaigns[index] = clone(updated);
    return clone(updated);
  }

  async submitForReview(id: string, ownerAccountId: string) {
    const index = this.campaigns.findIndex(
      (campaign) => campaign.id === id && campaign.ownerAccountId === ownerAccountId,
    );
    if (index < 0) throw new Error("الحملة غير موجودة أو لا تملك صلاحية إدارتها.");
    const current = this.campaigns[index];
    if (!['draft', 'rejected'].includes(current.status)) {
      throw new Error("يمكن إرسال الحملات المسودة أو المرفوضة فقط للمراجعة.");
    }
    validateCampaignInput(current);
    const now = new Date().toISOString();
    const next: DonationCampaign = {
      ...current,
      status: "pending_review",
      submittedAt: now,
      updatedAt: now,
      reviewedAt: undefined,
      reviewedBy: undefined,
      rejectionReason: undefined,
    };
    this.campaigns[index] = clone(next);
    return clone(next);
  }

  async review(id: string, input: CampaignReviewInput) {
    const index = this.campaigns.findIndex((campaign) => campaign.id === id);
    if (index < 0) throw new Error("الحملة غير موجودة.");
    const current = this.campaigns[index];
    if (current.status !== "pending_review") throw new Error("الحملة ليست قيد المراجعة.");
    if (input.decision === "reject" && !input.rejectionReason?.trim()) {
      throw new Error("سبب الرفض مطلوب.");
    }
    const now = new Date().toISOString();
    const next: DonationCampaign = {
      ...current,
      status: input.decision === "approve" ? "active" : "rejected",
      reviewedAt: now,
      reviewedBy: input.reviewerId,
      rejectionReason: input.decision === "reject" ? input.rejectionReason!.trim() : undefined,
      updatedAt: now,
    };
    this.campaigns[index] = clone(next);
    return clone(next);
  }

  async pauseOwned(id: string, ownerAccountId: string) {
    return this.transitionOwned(id, ownerAccountId, "active", "paused", "pausedAt");
  }

  async resumeOwned(id: string, ownerAccountId: string) {
    return this.transitionOwned(id, ownerAccountId, "paused", "active");
  }

  async closeOwned(id: string, ownerAccountId: string) {
    const index = this.campaigns.findIndex(
      (campaign) => campaign.id === id && campaign.ownerAccountId === ownerAccountId,
    );
    if (index < 0) throw new Error("الحملة غير موجودة أو لا تملك صلاحية إدارتها.");
    const current = this.campaigns[index];
    if (!["active", "paused", "completed"].includes(current.status)) {
      throw new Error("لا يمكن إغلاق الحملة في حالتها الحالية.");
    }
    const now = new Date().toISOString();
    const next = { ...current, status: "closed" as const, closedAt: now, updatedAt: now };
    this.campaigns[index] = clone(next);
    return clone(next);
  }

  async recordVerifiedDonation(id: string, amount: number) {
    const index = this.campaigns.findIndex((campaign) => campaign.id === id);
    if (index < 0) throw new Error("الحملة غير موجودة.");
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("مبلغ التبرع غير صالح.");
    const current = this.campaigns[index];
    if (current.status !== "active") throw new Error("الحملة لا تستقبل التبرعات حاليًا.");
    const now = new Date().toISOString();
    const raisedAmount = current.raisedAmount + amount;
    const reachedGoal = raisedAmount >= current.targetAmount;
    const next: DonationCampaign = {
      ...current,
      raisedAmount,
      donorCount: current.donorCount + 1,
      status: reachedGoal ? "completed" : current.status,
      completedAt: reachedGoal ? now : current.completedAt,
      updatedAt: now,
    };
    this.campaigns[index] = clone(next);
    return clone(next);
  }

  private async transitionOwned(
    id: string,
    ownerAccountId: string,
    from: DonationCampaign["status"],
    to: DonationCampaign["status"],
    timestampKey?: "pausedAt",
  ) {
    const index = this.campaigns.findIndex(
      (campaign) => campaign.id === id && campaign.ownerAccountId === ownerAccountId,
    );
    if (index < 0) throw new Error("الحملة غير موجودة أو لا تملك صلاحية إدارتها.");
    const current = this.campaigns[index];
    if (current.status !== from) throw new Error("لا يمكن تغيير حالة الحملة بهذه الطريقة.");
    const now = new Date().toISOString();
    const next: DonationCampaign = {
      ...current,
      status: to,
      updatedAt: now,
      ...(timestampKey ? { [timestampKey]: now } : {}),
    };
    this.campaigns[index] = clone(next);
    return clone(next);
  }
}
