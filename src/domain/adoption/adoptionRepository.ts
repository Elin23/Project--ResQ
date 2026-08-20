import type { ModerationDecisionInput } from "../moderation/moderation";
import type {
  AdoptionListing,
  CreateAdoptionListingInput,
  UpdateAdoptionListingInput,
} from "./adoption";

export interface AdoptionRepository {
  listAvailable(): Promise<AdoptionListing[]>;
  getById(id: string): Promise<AdoptionListing | undefined>;
  listByOwner(ownerAccountId: string): Promise<AdoptionListing[]>;
  getOwnedById(id: string, ownerAccountId: string): Promise<AdoptionListing | undefined>;
  submit(input: CreateAdoptionListingInput): Promise<AdoptionListing>;
  updateAndResubmit(
    id: string,
    ownerAccountId: string,
    input: UpdateAdoptionListingInput,
  ): Promise<AdoptionListing>;
  closeOwned(id: string, ownerAccountId: string): Promise<AdoptionListing>;
  reserveOwned(id: string, ownerAccountId: string): Promise<AdoptionListing>;
  markAdoptedOwned(id: string, ownerAccountId: string): Promise<AdoptionListing>;
  review(id: string, input: ModerationDecisionInput): Promise<AdoptionListing>;
}
