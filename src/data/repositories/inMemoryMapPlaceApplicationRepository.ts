import {
  validateMapPlaceDraft,
  type CreateMapPlaceApplicationInput,
  type MapPlaceApplication,
  type MapPlaceApplicationRepository,
  type MapPlaceReviewDecision,
  type UpdateMapPlaceApplicationInput,
} from "@/src/domain/service-places";

function clone(item: MapPlaceApplication): MapPlaceApplication {
  return {
    ...item,
    openingHours: item.openingHours?.map((day) => ({ ...day })),
  };
}

function normalized(value: string) {
  return value.trim().toLocaleLowerCase("ar").replace(/\s+/g, " ");
}

function sameRequestedPlace(a: MapPlaceApplication, b: Pick<MapPlaceApplication, "requestedType" | "name" | "address">) {
  return a.requestedType === b.requestedType
    && normalized(a.name) === normalized(b.name)
    && normalized(a.address) === normalized(b.address);
}

export class InMemoryMapPlaceApplicationRepository implements MapPlaceApplicationRepository {
  private applications: MapPlaceApplication[] = [];

  async createDraft(input: CreateMapPlaceApplicationInput) {
    const duplicate = this.applications.find((application) =>
      application.applicantUserId === input.applicantUserId
      && !["cancelled", "rejected"].includes(application.status)
      && sameRequestedPlace(application, input),
    );
    if (duplicate) throw new Error("A non-closed application already exists for this place");

    const now = new Date().toISOString();
    const application: MapPlaceApplication = {
      ...input,
      id: `map-place-application-${Date.now()}-${this.applications.length + 1}`,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    this.applications.push(application);
    return clone(application);
  }

  async getById(id: string) {
    const item = this.applications.find((application) => application.id === id);
    return item ? clone(item) : null;
  }

  async listForUser(userId: string) {
    return this.applications
      .filter((application) => application.applicantUserId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(clone);
  }

  async listPendingReview() {
    return this.applications
      .filter((application) => application.status === "pending")
      .sort((a, b) => (a.submittedAt ?? a.updatedAt).localeCompare(b.submittedAt ?? b.updatedAt))
      .map(clone);
  }

  async getForReview(id: string) {
    const item = this.applications.find((application) => application.id === id);
    return item ? clone(item) : null;
  }

  async updateOwnedDraft(id: string, userId: string, input: UpdateMapPlaceApplicationInput) {
    const index = this.findOwnedIndex(id, userId);
    const current = this.applications[index];
    if (!["draft", "rejected"].includes(current.status)) {
      throw new Error("Only draft or rejected map place applications can be edited");
    }
    const next: MapPlaceApplication = {
      ...current,
      ...input,
      status: "draft",
      rejectionReason: undefined,
      reviewedAt: undefined,
      reviewedBy: undefined,
      updatedAt: new Date().toISOString(),
    };
    this.ensureNoDuplicatePending(next, id);
    this.applications[index] = next;
    return clone(next);
  }

  async submit(id: string, userId: string) {
    const index = this.findOwnedIndex(id, userId);
    const current = this.applications[index];
    if (!["draft", "rejected"].includes(current.status)) {
      throw new Error("Map place application cannot be submitted from its current state");
    }
    this.ensureNoDuplicatePending(current, id);
    const validationError = validateMapPlaceDraft(current, { forSubmission: true });
    if (validationError) throw new Error(validationError);
    const now = new Date().toISOString();
    const next: MapPlaceApplication = {
      ...current,
      status: "pending",
      submittedAt: now,
      reviewedAt: undefined,
      reviewedBy: undefined,
      rejectionReason: undefined,
      updatedAt: now,
    };
    this.applications[index] = next;
    return clone(next);
  }

  async cancel(id: string, userId: string) {
    return this.transitionOwned(id, userId, "cancelled");
  }

  async review(id: string, decision: MapPlaceReviewDecision) {
    const index = this.applications.findIndex((application) => application.id === id);
    if (index < 0) throw new Error("Map place application not found");
    const current = this.applications[index];
    if (current.status !== "pending") throw new Error("Only pending map place applications can be reviewed");
    if (!decision.reviewerId.trim()) throw new Error("Reviewer id is required");
    if (decision.decision === "reject" && !decision.rejectionReason.trim()) {
      throw new Error("A rejection reason is required");
    }
    const reviewedAt = decision.reviewedAt ?? new Date().toISOString();
    const next: MapPlaceApplication = decision.decision === "approve"
      ? {
          ...current,
          status: "approved",
          approvedPlaceId: decision.approvedPlaceId,
          rejectionReason: undefined,
          reviewedBy: decision.reviewerId,
          reviewedAt,
          updatedAt: reviewedAt,
        }
      : {
          ...current,
          status: "rejected",
          approvedPlaceId: undefined,
          rejectionReason: decision.rejectionReason.trim(),
          reviewedBy: decision.reviewerId,
          reviewedAt,
          updatedAt: reviewedAt,
        };
    this.applications[index] = next;
    return clone(next);
  }

  private ensureNoDuplicatePending(candidate: MapPlaceApplication, ignoreId?: string) {
    const duplicate = this.applications.find((application) =>
      application.id !== ignoreId
      && application.applicantUserId === candidate.applicantUserId
      && ["draft", "pending", "approved"].includes(application.status)
      && sameRequestedPlace(application, candidate),
    );
    if (duplicate) throw new Error("Another active application already exists for this place");
  }

  private findOwnedIndex(id: string, userId: string) {
    const index = this.applications.findIndex(
      (application) => application.id === id && application.applicantUserId === userId,
    );
    if (index < 0) throw new Error("Map place application not found or not owned by current user");
    return index;
  }

  private async transitionOwned(id: string, userId: string, status: "cancelled") {
    const index = this.findOwnedIndex(id, userId);
    const current = this.applications[index];
    if (!["draft", "pending", "rejected"].includes(current.status)) {
      throw new Error("Map place application cannot be cancelled from its current state");
    }
    const next = { ...current, status, updatedAt: new Date().toISOString() } satisfies MapPlaceApplication;
    this.applications[index] = next;
    return clone(next);
  }
}
