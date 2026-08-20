import { describe, expect, it } from "vitest";

import { InMemoryDonationCampaignRepository } from "./inMemoryDonationCampaignRepository";
import { InMemoryDonationTransferRepository } from "./inMemoryDonationTransferRepository";

const campaignInput = {
  ownerAccountId: "organization-owner-1",
  ownerKind: "organization" as const,
  ownerDisplayName: "جمعية الرحمة",
  ownerVerified: true,
  title: "علاج حالات إنقاذ عاجلة",
  shortDescription: "تأمين تكاليف العلاج للحالات العاجلة.",
  description: "حملة لتغطية تكاليف الفحوص والعلاج الضروري للحيوانات المصابة.",
  category: "medical" as const,
  urgent: true,
  coverImageUrl: "https://picsum.photos/seed/test-donation/800/600",
  location: { governorate: "دمشق", city: "دمشق" },
  impactItems: [{ id: "medical", title: "علاج الحالات", icon: "medkit-outline" }],
  targetAmount: 100000,
  paymentRecipient: { fullName: "أحمد علي", governorate: "دمشق" },
};

describe("Donation campaign lifecycle", () => {
  it("keeps owner campaigns private until moderation approval", async () => {
    const campaigns = new InMemoryDonationCampaignRepository();
    const draft = await campaigns.createDraft(campaignInput);
    expect(draft.status).toBe("draft");
    expect((await campaigns.listPublic()).some((item) => item.id === draft.id)).toBe(false);

    const pending = await campaigns.submitForReview(draft.id, campaignInput.ownerAccountId);
    expect(pending.status).toBe("pending_review");
    expect((await campaigns.listPublic()).some((item) => item.id === draft.id)).toBe(false);

    const approved = await campaigns.review(draft.id, {
      reviewerId: "admin-web-future",
      decision: "approve",
    });
    expect(approved.status).toBe("active");
    expect((await campaigns.getPublicById(draft.id))?.id).toBe(draft.id);
  });

  it("requires a rejection reason and allows owner resubmission", async () => {
    const campaigns = new InMemoryDonationCampaignRepository();
    const draft = await campaigns.createDraft(campaignInput);
    await campaigns.submitForReview(draft.id, campaignInput.ownerAccountId);
    await expect(
      campaigns.review(draft.id, { reviewerId: "admin", decision: "reject" }),
    ).rejects.toThrow("سبب الرفض");

    const rejected = await campaigns.review(draft.id, {
      reviewerId: "admin",
      decision: "reject",
      rejectionReason: "الصورة غير واضحة.",
    });
    expect(rejected.status).toBe("rejected");
    const updated = await campaigns.updateOwned(draft.id, campaignInput.ownerAccountId, {
      ...campaignInput,
      coverImageUrl: "https://picsum.photos/seed/better-image/800/600",
    });
    expect(updated.status).toBe("draft");
    expect(updated.rejectionReason).toBeUndefined();
    expect((await campaigns.submitForReview(draft.id, campaignInput.ownerAccountId)).status).toBe("pending_review");
  });

  it("lets only the owner pause/resume/close an approved campaign", async () => {
    const campaigns = new InMemoryDonationCampaignRepository();
    const draft = await campaigns.createDraft(campaignInput);
    await campaigns.submitForReview(draft.id, campaignInput.ownerAccountId);
    await campaigns.review(draft.id, { reviewerId: "admin", decision: "approve" });

    await expect(campaigns.pauseOwned(draft.id, "another-owner")).rejects.toThrow("لا تملك");
    expect((await campaigns.pauseOwned(draft.id, campaignInput.ownerAccountId)).status).toBe("paused");
    expect((await campaigns.resumeOwned(draft.id, campaignInput.ownerAccountId)).status).toBe("active");
    expect((await campaigns.closeOwned(draft.id, campaignInput.ownerAccountId)).status).toBe("closed");
  });


  it("allows an incomplete named draft but blocks moderation submission until required data is complete", async () => {
    const campaigns = new InMemoryDonationCampaignRepository();
    const draft = await campaigns.createDraft({
      ...campaignInput,
      shortDescription: "",
      description: "",
      coverImageUrl: "",
      images: [],
      location: { governorate: "" },
      impactItems: [],
      targetAmount: 0,
      paymentRecipient: { fullName: "", governorate: "" },
      title: "مسودة حملة",
    });

    expect(draft.status).toBe("draft");
    const stillDraft = await campaigns.updateOwned(
      draft.id,
      campaignInput.ownerAccountId,
      {
        ...campaignInput,
        shortDescription: "",
        description: "",
        coverImageUrl: "",
        images: [],
        location: { governorate: "" },
        impactItems: [],
        targetAmount: 0,
        paymentRecipient: { fullName: "", governorate: "" },
        title: "مسودة حملة محدثة",
      },
    );
    expect(stillDraft.status).toBe("draft");
    expect(stillDraft.title).toBe("مسودة حملة محدثة");

    await expect(
      campaigns.submitForReview(draft.id, campaignInput.ownerAccountId),
    ).rejects.toThrow();
  });

});


describe("Donation campaign owner management", () => {
  it("isolates campaign transfer history to the campaign owner", async () => {
    const campaigns = new InMemoryDonationCampaignRepository();
    const transfers = new InMemoryDonationTransferRepository(campaigns);

    await transfers.submit({
      campaignId: "campaign-injured-animals",
      donorAccountId: "user-donor",
      senderFullName: "متبرع تجريبي",
      senderGovernorate: "دمشق",
      transferProviderId: "al-haram",
      transferProviderName: "الهرم للحوالات المالية",
      transferNumber: "OWNER-STATS-001",
      amount: 25000,
    });

    const owned = await campaigns.getPublicById("campaign-injured-animals");
    expect(owned).toBeTruthy();

    const ownerTransfers = await transfers.listByCampaignOwner(
      "campaign-injured-animals",
      owned!.ownerAccountId,
    );
    expect(ownerTransfers.length).toBeGreaterThan(0);

    await expect(
      transfers.listByCampaignOwner("campaign-injured-animals", "another-owner"),
    ).rejects.toThrow("لا تملك");
  });
});

describe("Donation transfer lifecycle", () => {
  it("keeps submitted transfers out of campaign totals until approved", async () => {
    const campaigns = new InMemoryDonationCampaignRepository();
    const transfers = new InMemoryDonationTransferRepository(campaigns);
    const before = await campaigns.getPublicById("campaign-injured-animals");
    const transfer = await transfers.submit({
      campaignId: "campaign-injured-animals",
      donorAccountId: "user-1",
      donorDisplayName: "محمد علي",
      senderFullName: "محمد علي",
      senderGovernorate: "دمشق",
      transferProviderId: "al-haram",
      transferProviderName: "الهرم للحوالات المالية",
      transferNumber: "982347510",
      amount: 50000,
    });
    expect(transfer.status).toBe("submitted");
    expect((await campaigns.getPublicById("campaign-injured-animals"))?.raisedAmount).toBe(before?.raisedAmount);

    await transfers.markVerifying(transfer.id, "admin-future");
    const approved = await transfers.review(transfer.id, {
      reviewerId: "admin-future",
      decision: "approve",
    });
    expect(approved.status).toBe("approved");
    expect((await campaigns.getPublicById("campaign-injured-animals"))?.raisedAmount).toBe((before?.raisedAmount ?? 0) + 50000);
  });

  it("blocks duplicate active transfer references", async () => {
    const campaigns = new InMemoryDonationCampaignRepository();
    const transfers = new InMemoryDonationTransferRepository(campaigns);
    const input = {
      campaignId: "campaign-injured-animals",
      senderFullName: "محمد علي",
      senderGovernorate: "دمشق",
      transferProviderId: "al-haram",
      transferProviderName: "الهرم للحوالات المالية",
      transferNumber: "TR-001",
      amount: 25000,
    };
    await transfers.submit(input);
    await expect(transfers.submit(input)).rejects.toThrow("مسبقًا");
  });
});
