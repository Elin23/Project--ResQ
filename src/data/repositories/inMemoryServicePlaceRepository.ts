import type {
  ApplySensitiveServicePlaceChangesInput,
  CreateServicePlaceInput,
  ServicePlace,
  ServicePlaceModerationStatusInput,
  ServicePlaceQuery,
  ServicePlaceRepository,
  UpdateOwnedServicePlaceInput,
} from "@/src/domain/service-places";
import { SERVICE_PLACES_SEED } from "@/src/data/servicePlaces.seed";

function clonePlace(place: ServicePlace): ServicePlace {
  return { ...place, openingHours: place.openingHours.map((item) => ({ ...item })) };
}

function isPublic(place: ServicePlace) {
  return place.status === "active" || place.status === "temporarily_closed";
}

export class InMemoryServicePlaceRepository implements ServicePlaceRepository {
  private places = SERVICE_PLACES_SEED.map(clonePlace);

  async list(query: ServicePlaceQuery = {}) {
    const search = query.search?.trim().toLowerCase();
    return this.places
      .filter(isPublic)
      .filter((place) => !query.type || place.type === query.type)
      .filter((place) => !search || [place.name, place.address, place.description].some((value) => value?.toLowerCase().includes(search)))
      .map(clonePlace);
  }

  async getById(id: string) {
    const place = this.places.find((item) => item.id === id && isPublic(item));
    return place ? clonePlace(place) : null;
  }

  async getForModeration(id: string) {
    const place = this.places.find((item) => item.id === id);
    return place ? clonePlace(place) : null;
  }

  async listOwnedByUser(userId: string) {
    return this.places.filter((item) => item.ownerUserId === userId && item.status !== "archived").map(clonePlace);
  }

  async getOwnedByUser(placeId: string, userId: string) {
    const place = this.places.find((item) => item.id === placeId && item.ownerUserId === userId && item.status !== "archived");
    return place ? clonePlace(place) : null;
  }

  async create(input: CreateServicePlaceInput) {
    const place: ServicePlace = {
      ...input,
      id: `service-place-${Date.now()}-${this.places.length + 1}`,
      openingHours: input.openingHours.map((item) => ({ ...item })),
    };
    this.places.unshift(place);
    return clonePlace(place);
  }

  async remove(id: string) {
    this.places = this.places.filter((item) => item.id !== id);
  }

  async updateOwnedByUser(placeId: string, userId: string, input: UpdateOwnedServicePlaceInput) {
    const index = this.places.findIndex((item) => item.id === placeId && item.ownerUserId === userId && item.status !== "archived");
    if (index < 0) throw new Error("Service place not found or not owned by current user");
    const next: ServicePlace = { ...this.places[index], ...input };
    this.places[index] = next;
    return clonePlace(next);
  }

  async applySensitiveChanges(placeId: string, input: ApplySensitiveServicePlaceChangesInput) {
    const index = this.places.findIndex((item) => item.id === placeId);
    if (index < 0) throw new Error("Service place not found");
    const next: ServicePlace = { ...this.places[index], ...input };
    this.places[index] = next;
    return clonePlace(next);
  }

  async setModerationStatus(placeId: string, input: ServicePlaceModerationStatusInput) {
    const index = this.places.findIndex((item) => item.id === placeId);
    if (index < 0) throw new Error("Service place not found");
    if (!input.reviewerId.trim()) throw new Error("Reviewer id is required");
    if (input.status === "suspended" && !input.reason?.trim()) throw new Error("A suspension reason is required");
    if (this.places[index].status === "archived" && input.status !== "archived") throw new Error("Archived service places cannot be restored");
    const next: ServicePlace = {
      ...this.places[index],
      status: input.status,
      statusReason: input.reason?.trim() || undefined,
      statusChangedAt: input.changedAt ?? new Date().toISOString(),
      statusChangedBy: input.reviewerId,
    };
    this.places[index] = next;
    return clonePlace(next);
  }
}
