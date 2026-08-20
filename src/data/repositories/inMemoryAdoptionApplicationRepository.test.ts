import { describe, expect, it } from "vitest";

import { InMemoryAdoptionApplicationRepository } from "./inMemoryAdoptionApplicationRepository";
import { InMemoryAdoptionRepository } from "./inMemoryAdoptionRepository";

const baseInput = {
  listingId: "adoption-lolo",
  applicantAccountId: "user-applicant-1",
  applicantName: "مستخدم تجريبي",
  phone: "+963900123456",
  city: "دمشق",
  housing: "apartment" as const,
  hasOtherPets: false,
  experience: "لدي خبرة سابقة في رعاية القطط داخل المنزل.",
  reason: "أبحث عن حيوان أليف وسأوفر له الرعاية المناسبة.",
};

describe("InMemoryAdoptionApplicationRepository", () => {
  it("creates a pending application only for an approved public listing", async () => {
    const adoption = new InMemoryAdoptionRepository();
    const applications = new InMemoryAdoptionApplicationRepository(adoption);
    const item = await applications.submit(baseInput);

    expect(item.status).toBe("pending");
    expect(item.listingOwnerAccountId).toBe("resq-syria");
    expect(item.applicantAccountId).toBe("user-applicant-1");
  });

  it("prevents duplicate active applications for the same animal", async () => {
    const adoption = new InMemoryAdoptionRepository();
    const applications = new InMemoryAdoptionApplicationRepository(adoption);
    await applications.submit(baseInput);
    await expect(applications.submit(baseInput)).rejects.toThrow("طلب نشط");
  });

  it("keeps applicant requests isolated by account id", async () => {
    const adoption = new InMemoryAdoptionRepository();
    const applications = new InMemoryAdoptionApplicationRepository(adoption);
    const created = await applications.submit(baseInput);

    expect(await applications.getByApplicant(created.id, "another-user")).toBeUndefined();
    expect(await applications.listByApplicant("another-user")).toHaveLength(0);
    expect(await applications.listByApplicant("user-applicant-1")).toHaveLength(1);
  });

  it("redacts owner contact from public adoption listing reads", async () => {
    const adoption = new InMemoryAdoptionRepository();
    const publicListing = await adoption.getById("adoption-lolo");
    const ownerListing = await adoption.getOwnedById("adoption-lolo", "resq-syria");

    expect(publicListing?.contact.phone).toBe("");
    expect(publicListing?.contact.name).toBe("");
    expect(ownerListing?.contact.phone).toBe("+963900000001");
  });

  it("accepts one applicant, reserves the listing, and marks other pending applicants not selected", async () => {
    const adoption = new InMemoryAdoptionRepository();
    const applications = new InMemoryAdoptionApplicationRepository(adoption);
    const first = await applications.submit(baseInput);
    const second = await applications.submit({
      ...baseInput,
      applicantAccountId: "user-applicant-2",
      applicantName: "متقدم ثانٍ",
      phone: "+963900654321",
    });

    const accepted = await applications.acceptForListingOwner(
      first.id,
      first.listingId,
      first.listingOwnerAccountId,
    );

    expect(accepted.status).toBe("accepted");
    expect((await applications.getByApplicant(second.id, "user-applicant-2"))?.status).toBe("not_selected");
    expect((await adoption.getOwnedById(first.listingId, first.listingOwnerAccountId))?.status).toBe("reserved");
    expect(await adoption.getById(first.listingId)).toBeUndefined();
  });

  it("lets the listing owner reject a pending application without closing the listing", async () => {
    const adoption = new InMemoryAdoptionRepository();
    const applications = new InMemoryAdoptionApplicationRepository(adoption);
    const created = await applications.submit(baseInput);

    const rejected = await applications.rejectForListingOwner(
      created.id,
      created.listingId,
      created.listingOwnerAccountId,
      "لا يناسب متطلبات الرعاية الحالية.",
    );

    expect(rejected.status).toBe("rejected");
    expect(rejected.decisionNote).toContain("متطلبات");
    expect((await adoption.getOwnedById(created.listingId, created.listingOwnerAccountId))?.status).toBe("available");
  });

  it("unlocks owner contact only for the accepted applicant", async () => {
    const adoption = new InMemoryAdoptionRepository();
    const applications = new InMemoryAdoptionApplicationRepository(adoption);
    const created = await applications.submit(baseInput);
    expect(await applications.getAcceptedContactForApplicant(created.id, created.applicantAccountId)).toBeUndefined();
    await applications.acceptForListingOwner(created.id, created.listingId, created.listingOwnerAccountId);
    const access = await applications.getAcceptedContactForApplicant(created.id, created.applicantAccountId);
    expect(access?.contact.phone).toBe("+963900000001");
    expect(access?.location.address).toBe("دمشق");
    expect(await applications.getAcceptedContactForApplicant(created.id, "another-user")).toBeUndefined();
  });


  it("completes adoption only after both applicant and owner confirm handover", async () => {
    const adoption = new InMemoryAdoptionRepository();
    const applications = new InMemoryAdoptionApplicationRepository(adoption);
    const created = await applications.submit(baseInput);
    await applications.acceptForListingOwner(
      created.id,
      created.listingId,
      created.listingOwnerAccountId,
    );

    const applicantConfirmed = await applications.confirmHandoverForApplicant(
      created.id,
      created.applicantAccountId,
    );
    expect(applicantConfirmed.status).toBe("accepted");
    expect(applicantConfirmed.applicantHandoverConfirmedAt).toBeTruthy();
    expect(applicantConfirmed.ownerHandoverConfirmedAt).toBeUndefined();
    expect((await adoption.getOwnedById(created.listingId, created.listingOwnerAccountId))?.status).toBe("reserved");

    const completed = await applications.confirmHandoverForListingOwner(
      created.id,
      created.listingId,
      created.listingOwnerAccountId,
    );
    expect(completed.status).toBe("completed");
    expect(completed.ownerHandoverConfirmedAt).toBeTruthy();
    expect(completed.completedAt).toBeTruthy();
    expect((await adoption.getOwnedById(created.listingId, created.listingOwnerAccountId))?.status).toBe("adopted");
  });

  it("does not allow handover confirmation before application acceptance", async () => {
    const adoption = new InMemoryAdoptionRepository();
    const applications = new InMemoryAdoptionApplicationRepository(adoption);
    const created = await applications.submit(baseInput);

    await expect(
      applications.confirmHandoverForApplicant(created.id, created.applicantAccountId),
    ).rejects.toThrow("قبل قبول");

    await expect(
      applications.confirmHandoverForListingOwner(
        created.id,
        created.listingId,
        created.listingOwnerAccountId,
      ),
    ).rejects.toThrow("قبل قبول");
  });

});
