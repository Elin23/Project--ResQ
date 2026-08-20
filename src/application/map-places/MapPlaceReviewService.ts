import type {
  MapPlaceApplication,
  MapPlaceApplicationRepository,
  ServicePlace,
  ServicePlaceRepository,
} from "@/src/domain/service-places";

export type RejectMapPlaceApplicationInput = {
  reviewerId: string;
  reason: string;
  reviewedAt?: string;
};

export type ApproveMapPlaceApplicationInput = {
  reviewerId: string;
  reviewedAt?: string;
};

function closedWeek(): ServicePlace["openingHours"] {
  return [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    day: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    open: null,
    close: null,
  }));
}

/**
 * Trusted moderation boundary for map-place applications.
 * This service belongs behind an admin/backend authorization layer; it is not
 * a mobile account role. It coordinates application review and place creation.
 */
export class MapPlaceReviewService {
  constructor(
    private readonly applications: MapPlaceApplicationRepository,
    private readonly places: ServicePlaceRepository,
  ) {}

  listPending() {
    return this.applications.listPendingReview();
  }

  getForReview(id: string) {
    return this.applications.getForReview(id);
  }

  async reject(applicationId: string, input: RejectMapPlaceApplicationInput) {
    const reason = input.reason.trim();
    if (!reason) throw new Error("A rejection reason is required");
    return this.applications.review(applicationId, {
      decision: "reject",
      reviewerId: input.reviewerId,
      reviewedAt: input.reviewedAt,
      rejectionReason: reason,
    });
  }

  async approve(applicationId: string, input: ApproveMapPlaceApplicationInput) {
    const application = await this.requirePending(applicationId);
    this.assertReviewer(input.reviewerId);
    await this.assertNotAlreadyMaterialized(application);

    const place = await this.places.create({
      type: application.requestedType,
      name: application.name,
      address: application.address,
      latitude: application.latitude,
      longitude: application.longitude,
      phone: application.phone,
      secondaryPhone: application.secondaryPhone,
      whatsapp: application.whatsapp,
      website: application.website,
      responsiblePerson: application.responsiblePerson,
      licenseNumber: application.licenseNumber,
      supportingDocumentUri: application.supportingDocumentUri,
      emergency24h: application.emergency24h,
      acceptsFreeCases: application.acceptsFreeCases,
      ownerUserId: application.applicantUserId,
      status: "active",
      openingHours: application.openingHours?.map((item) => ({ ...item })) ?? closedWeek(),
      description: application.description,
      verified: true,
    });

    try {
      const reviewed = await this.applications.review(application.id, {
        decision: "approve",
        reviewerId: input.reviewerId,
        reviewedAt: input.reviewedAt,
        approvedPlaceId: place.id,
      });
      return { application: reviewed, place };
    } catch (error) {
      // Compensating rollback for the in-memory prototype. Production should
      // execute place creation + application approval in one DB transaction.
      await this.places.remove(place.id);
      throw error;
    }
  }


  async suspendPlace(placeId: string, reviewerId: string, reason: string) {
    if (!reason.trim()) throw new Error("A suspension reason is required");
    return this.places.setModerationStatus(placeId, { status: "suspended", reviewerId, reason });
  }

  async restorePlace(placeId: string, reviewerId: string) {
    return this.places.setModerationStatus(placeId, { status: "active", reviewerId });
  }

  async archivePlace(placeId: string, reviewerId: string, reason?: string) {
    return this.places.setModerationStatus(placeId, { status: "archived", reviewerId, reason });
  }

  private async requirePending(id: string) {
    const application = await this.applications.getForReview(id);
    if (!application) throw new Error("Map place application not found");
    if (application.status !== "pending") throw new Error("Only pending map place applications can be reviewed");
    return application;
  }

  private assertReviewer(reviewerId: string) {
    if (!reviewerId.trim()) throw new Error("Reviewer id is required");
  }

  private async assertNotAlreadyMaterialized(application: MapPlaceApplication) {
    const ownedPlaces = await this.places.listOwnedByUser(application.applicantUserId);
    const duplicate = ownedPlaces.some((place) =>
      place.type === application.requestedType
      && place.name.trim().toLocaleLowerCase("ar") === application.name.trim().toLocaleLowerCase("ar")
      && place.address.trim().toLocaleLowerCase("ar") === application.address.trim().toLocaleLowerCase("ar"),
    );
    if (duplicate) throw new Error("An approved service place already exists for this application target");
  }
}
