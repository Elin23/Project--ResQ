import { describe, expect, it } from "vitest";
import { InMemoryMapPlaceApplicationRepository } from "@/src/data/repositories/inMemoryMapPlaceApplicationRepository";
import { InMemoryServicePlaceRepository } from "@/src/data/repositories/inMemoryServicePlaceRepository";
import { MapPlaceReviewService } from "../MapPlaceReviewService";

function input(overrides: Partial<Parameters<InMemoryMapPlaceApplicationRepository["createDraft"]>[0]> = {}) {
  return {
    applicantUserId: "user-review-test",
    requestedType: "clinic" as const,
    name: "عيادة الاختبار",
    address: "دمشق - المزة",
    latitude: 33.5,
    longitude: 36.2,
    phone: "+963900000000",
    responsiblePerson: "د. اختبار",
    licenseNumber: "VET-TEST-001",
    supportingDocumentUri: "file://license-test.jpg",
    ...overrides,
  };
}

describe("MapPlaceReviewService", () => {
  it("materializes an approved application into an owned verified service place", async () => {
    const applications = new InMemoryMapPlaceApplicationRepository();
    const places = new InMemoryServicePlaceRepository();
    const service = new MapPlaceReviewService(applications, places);
    const draft = await applications.createDraft(input());
    await applications.submit(draft.id, draft.applicantUserId);

    const result = await service.approve(draft.id, { reviewerId: "admin-1" });

    expect(result.application.status).toBe("approved");
    expect(result.application.approvedPlaceId).toBe(result.place.id);
    expect(result.application.reviewedBy).toBe("admin-1");
    expect(result.place.ownerUserId).toBe("user-review-test");
    expect(result.place.type).toBe("clinic");
    expect(result.place.verified).toBe(true);
    expect((await places.listOwnedByUser("user-review-test")).some((place) => place.id === result.place.id)).toBe(true);
  });

  it("requires a rejection reason and allows rejected applications to be edited and resubmitted", async () => {
    const applications = new InMemoryMapPlaceApplicationRepository();
    const places = new InMemoryServicePlaceRepository();
    const service = new MapPlaceReviewService(applications, places);
    const draft = await applications.createDraft(input({ name: "عيادة مرفوضة" }));
    await applications.submit(draft.id, draft.applicantUserId);

    await expect(service.reject(draft.id, { reviewerId: "admin-1", reason: "   " })).rejects.toThrow();
    const rejected = await service.reject(draft.id, { reviewerId: "admin-1", reason: "يرجى إرفاق معلومات أوضح" });
    expect(rejected.status).toBe("rejected");
    expect(rejected.rejectionReason).toBe("يرجى إرفاق معلومات أوضح");

    const edited = await applications.updateOwnedDraft(draft.id, draft.applicantUserId, { phone: "+963911111111" });
    expect(edited.status).toBe("draft");
    expect(edited.rejectionReason).toBeUndefined();
    const resubmitted = await applications.submit(draft.id, draft.applicantUserId);
    expect(resubmitted.status).toBe("pending");
  });

  it("prevents reviewing non-pending applications twice", async () => {
    const applications = new InMemoryMapPlaceApplicationRepository();
    const places = new InMemoryServicePlaceRepository();
    const service = new MapPlaceReviewService(applications, places);
    const draft = await applications.createDraft(input({ name: "عيادة مرة واحدة" }));
    await applications.submit(draft.id, draft.applicantUserId);
    await service.approve(draft.id, { reviewerId: "admin-1" });
    await expect(service.approve(draft.id, { reviewerId: "admin-2" })).rejects.toThrow("Only pending");
  });

  it("keeps moderation status outside owner edits and hides suspended places from public discovery", async () => {
    const applications = new InMemoryMapPlaceApplicationRepository();
    const places = new InMemoryServicePlaceRepository();
    const service = new MapPlaceReviewService(applications, places);
    const draft = await applications.createDraft(input({ name: "عيادة التعليق" }));
    await applications.submit(draft.id, draft.applicantUserId);
    const approved = await service.approve(draft.id, { reviewerId: "admin-1" });

    await service.suspendPlace(approved.place.id, "admin-2", "بيانات الاعتماد تحتاج مراجعة");
    expect(await places.getById(approved.place.id)).toBeNull();
    expect((await places.list()).some((place) => place.id === approved.place.id)).toBe(false);
    expect((await places.getOwnedByUser(approved.place.id, draft.applicantUserId))?.status).toBe("suspended");

    await places.updateOwnedByUser(approved.place.id, draft.applicantUserId, {
      name: "اسم محدث",
      phone: approved.place.phone,
      secondaryPhone: approved.place.secondaryPhone,
      whatsapp: approved.place.whatsapp,
      website: approved.place.website,
      responsiblePerson: approved.place.responsiblePerson,
      emergency24h: approved.place.emergency24h,
      openingHours: approved.place.openingHours,
      description: approved.place.description,
    });
    expect((await places.getForModeration(approved.place.id))?.status).toBe("suspended");

    await service.restorePlace(approved.place.id, "admin-2");
    expect((await places.getById(approved.place.id))?.status).toBe("active");
    await service.archivePlace(approved.place.id, "admin-2", "إغلاق دائم");
    await expect(service.restorePlace(approved.place.id, "admin-2")).rejects.toThrow("cannot be restored");
  });

  it("prevents duplicate active applications for the same user/place target", async () => {
    const applications = new InMemoryMapPlaceApplicationRepository();
    const first = await applications.createDraft(input({ name: "عيادة مكررة" }));
    await applications.submit(first.id, first.applicantUserId);
    await expect(applications.createDraft(input({ name: "  عيادة   مكررة  " }))).rejects.toThrow("already exists");
  });
});
