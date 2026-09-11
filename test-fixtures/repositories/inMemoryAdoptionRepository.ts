import {
  applyModerationDecision,
  isPubliclyVisible,
  submitForReview,
  type AdoptionListing,
  type AdoptionRepository,
  type CreateAdoptionListingInput,
  type ModerationDecisionInput,
  type UpdateAdoptionListingInput,
} from "@/src/domain";
import { ADOPTION_SEED } from "../seeds/domainSeeds";

function clone(item: AdoptionListing): AdoptionListing {
  return {
    ...item,
    traits: [...item.traits],
    healthChecklist: item.healthChecklist.map((entry) => ({ ...entry })),
    images: [...item.images],
    location: { ...item.location },
    contact: { ...item.contact },
  };
}

function publicClone(item: AdoptionListing): AdoptionListing {
  const next = clone(item);
  return {
    ...next,
    contact: {
      name: "",
      phone: "",
      preferredMethod: next.contact.preferredMethod,
    },
  };
}

export class InMemoryAdoptionRepository implements AdoptionRepository {
  private listings = ADOPTION_SEED.map(clone);
  private idCounter = 0;

  async listAvailable() {
    return this.listings
      .filter((item) => item.status === "available" && isPubliclyVisible(item))
      .map(publicClone);
  }

  async getById(id: string) {
    const item = this.listings.find(
      (listing) =>
        listing.id === id &&
        listing.status === "available" &&
        isPubliclyVisible(listing),
    );
    return item ? publicClone(item) : undefined;
  }

  async listByOwner(ownerAccountId: string) {
    return this.listings
      .filter((item) => item.ownerAccountId === ownerAccountId)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .map(clone);
  }

  async getOwnedById(id: string, ownerAccountId: string) {
    const item = this.listings.find(
      (listing) => listing.id === id && listing.ownerAccountId === ownerAccountId,
    );
    return item ? clone(item) : undefined;
  }

  async submit(input: CreateAdoptionListingInput) {
    const now = new Date().toISOString();
    const item: AdoptionListing = {
      id: `adoption-${Date.now()}-${++this.idCounter}`,
      ...input,
      imageUrl: input.images[0],
      locationName: input.location.address,
      createdAt: now,
      updatedAt: now,
      status: "available",
      moderationStatus: "pending_review",
      submittedAt: now,
    };
    this.listings.unshift(clone(item));
    return clone(item);
  }

  async updateAndResubmit(
    id: string,
    ownerAccountId: string,
    input: UpdateAdoptionListingInput,
  ) {
    const index = this.listings.findIndex(
      (listing) => listing.id === id && listing.ownerAccountId === ownerAccountId,
    );
    if (index < 0) throw new Error("Adoption listing not found");

    const current = this.listings[index];
    if (!["rejected", "draft"].includes(current.moderationStatus)) {
      throw new Error("Only rejected or draft listings can be edited and resubmitted");
    }

    const updated = submitForReview<AdoptionListing>({
      ...current,
      ...input,
      ownerAccountId: current.ownerAccountId,
      ownerAccountKind: current.ownerAccountKind,
      organizationId: input.organizationId ?? current.organizationId,
      imageUrl: input.images[0],
      locationName: input.location.address,
      status: "available",
      updatedAt: new Date().toISOString(),
    });

    this.listings[index] = clone(updated);
    return clone(updated);
  }

  async closeOwned(id: string, ownerAccountId: string) {
    const index = this.listings.findIndex(
      (listing) => listing.id === id && listing.ownerAccountId === ownerAccountId,
    );
    if (index < 0) throw new Error("Adoption listing not found");

    const current = this.listings[index];
    if (current.moderationStatus !== "approved") {
      throw new Error("Only approved listings can be closed");
    }

    const next: AdoptionListing = {
      ...current,
      status: "closed",
      moderationStatus: "archived",
      updatedAt: new Date().toISOString(),
    };
    this.listings[index] = clone(next);
    return clone(next);
  }

  async reserveOwned(id: string, ownerAccountId: string) {
    const index = this.listings.findIndex(
      (listing) => listing.id === id && listing.ownerAccountId === ownerAccountId,
    );
    if (index < 0) throw new Error("Adoption listing not found");

    const current = this.listings[index];
    if (current.moderationStatus !== "approved" || current.status !== "available") {
      throw new Error("Only an approved available listing can be reserved");
    }

    const next: AdoptionListing = {
      ...current,
      status: "reserved",
      updatedAt: new Date().toISOString(),
    };
    this.listings[index] = clone(next);
    return clone(next);
  }

  async markAdoptedOwned(id: string, ownerAccountId: string) {
    const index = this.listings.findIndex(
      (listing) => listing.id === id && listing.ownerAccountId === ownerAccountId,
    );
    if (index < 0) throw new Error("Adoption listing not found");

    const current = this.listings[index];
    if (current.moderationStatus !== "approved" || current.status !== "reserved") {
      throw new Error("Only a reserved approved listing can be completed");
    }

    const next: AdoptionListing = {
      ...current,
      status: "adopted",
      updatedAt: new Date().toISOString(),
    };
    this.listings[index] = clone(next);
    return clone(next);
  }

  async review(id: string, input: ModerationDecisionInput) {
    const index = this.listings.findIndex((listing) => listing.id === id);
    if (index < 0) throw new Error("Adoption listing not found");
    const reviewed = applyModerationDecision(this.listings[index], input);
    const next = {
      ...reviewed,
      updatedAt: reviewed.reviewedAt ?? new Date().toISOString(),
    };
    this.listings[index] = clone(next);
    return clone(next);
  }
}
