import { describe, expect, it } from "vitest";

import { InMemoryAdoptionRepository } from "../inMemoryAdoptionRepository";
import { InMemoryFeedingPointSubmissionRepository } from "../inMemoryFeedingPointSubmissionRepository";

const adoptionInput = {
  ownerAccountId: "user-1",
  ownerAccountKind: "user" as const,
  animalName: "بندق",
  animalType: "كلب",
  age: 2,
  ageUnit: "years" as const,
  gender: "male" as const,
  traits: ["هادئ", "ودود"],
  description: "كلب هادئ يبحث عن منزل مناسب.",
  color: "بني",
  size: "medium" as const,
  healthCondition: "بحالة مستقرة",
  healthChecklist: [
    { id: "vaccinated", label: "مطعّم", checked: true },
  ],
  images: ["file://dog.jpg"],
  location: {
    latitude: 33.51,
    longitude: 36.29,
    address: "دمشق",
  },
  contact: {
    name: "أحمد",
    phone: "0912345678",
    preferredMethod: "phone" as const,
  },
};

describe("moderated content repositories", () => {
  it("keeps new adoption listings private until approval", async () => {
    const repository = new InMemoryAdoptionRepository();
    const listing = await repository.submit(adoptionInput);

    expect(listing.moderationStatus).toBe("pending_review");
    expect(await repository.getById(listing.id)).toBeUndefined();
    expect((await repository.listByOwner("user-1")).some((item) => item.id === listing.id)).toBe(true);

    await repository.review(listing.id, {
      decision: "approve",
      reviewerId: "admin-1",
    });
    expect((await repository.getById(listing.id))?.moderationStatus).toBe("approved");
  });

  it("lets the owner edit a rejected listing and resets moderation on resubmit", async () => {
    const repository = new InMemoryAdoptionRepository();
    const listing = await repository.submit(adoptionInput);

    await repository.review(listing.id, {
      decision: "reject",
      reviewerId: "admin-1",
      rejectionReason: "الصورة غير واضحة",
    });

    const resubmitted = await repository.updateAndResubmit(
      listing.id,
      "user-1",
      {
        ...adoptionInput,
        images: ["file://clear-dog.jpg"],
        description: "تم تحديث الصور والوصف.",
      },
    );

    expect(resubmitted.moderationStatus).toBe("pending_review");
    expect(resubmitted.rejectionReason).toBeUndefined();
    expect(resubmitted.reviewedBy).toBeUndefined();
    expect(resubmitted.imageUrl).toBe("file://clear-dog.jpg");
  });

  it("prevents another account from editing an owner listing", async () => {
    const repository = new InMemoryAdoptionRepository();
    const listing = await repository.submit(adoptionInput);

    await repository.review(listing.id, {
      decision: "reject",
      reviewerId: "admin-1",
      rejectionReason: "بحاجة لتعديل",
    });

    await expect(
      repository.updateAndResubmit(listing.id, "other-user", {
        ...adoptionInput,
        description: "تعديل غير مصرح",
      }),
    ).rejects.toThrow("not found");
  });

  it("allows an owner to close an approved adoption listing", async () => {
    const repository = new InMemoryAdoptionRepository();
    const listing = await repository.submit(adoptionInput);
    await repository.review(listing.id, {
      decision: "approve",
      reviewerId: "admin-1",
    });

    const closed = await repository.closeOwned(listing.id, "user-1");
    expect(closed.status).toBe("closed");
    expect(closed.moderationStatus).toBe("archived");
    expect(await repository.getById(listing.id)).toBeUndefined();
  });

  it("isolates feeding point submissions by owner", async () => {
    const repository = new InMemoryFeedingPointSubmissionRepository();
    const submission = await repository.submit({
      ownerAccountId: "user-1",
      ownerAccountKind: "user",
      name: "نقطة مستخدم",
      address: "دمشق",
      latitude: 33.51,
      longitude: 36.29,
      photoUri: "file://point.jpg",
      initialStatus: "stocked",
      facilities: ["water"],
    });

    expect(submission.moderationStatus).toBe("pending_review");
    expect(await repository.getOwnedById(submission.id, "user-1")).toBeDefined();
    expect(await repository.getOwnedById(submission.id, "user-2")).toBeUndefined();
    expect(await repository.listPendingReview()).toHaveLength(1);
  });
});
