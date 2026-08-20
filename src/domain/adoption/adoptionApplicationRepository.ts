import type { AdoptionApplication, CreateAdoptionApplicationInput } from "./adoptionApplication";
import type { AdoptionContactAccess } from "./adoptionContact";

export interface AdoptionApplicationRepository {
  submit(input: CreateAdoptionApplicationInput): Promise<AdoptionApplication>;
  listByApplicant(applicantAccountId: string): Promise<AdoptionApplication[]>;
  getByApplicant(id: string, applicantAccountId: string): Promise<AdoptionApplication | undefined>;
  listByListing(listingId: string, listingOwnerAccountId: string): Promise<AdoptionApplication[]>;
  getForListingOwner(
    id: string,
    listingId: string,
    listingOwnerAccountId: string,
  ): Promise<AdoptionApplication | undefined>;
  acceptForListingOwner(
    id: string,
    listingId: string,
    listingOwnerAccountId: string,
  ): Promise<AdoptionApplication>;
  getAcceptedContactForApplicant(
    id: string,
    applicantAccountId: string,
  ): Promise<AdoptionContactAccess | undefined>;
  rejectForListingOwner(
    id: string,
    listingId: string,
    listingOwnerAccountId: string,
    decisionNote?: string,
  ): Promise<AdoptionApplication>;
  confirmHandoverForApplicant(
    id: string,
    applicantAccountId: string,
  ): Promise<AdoptionApplication>;
  confirmHandoverForListingOwner(
    id: string,
    listingId: string,
    listingOwnerAccountId: string,
  ): Promise<AdoptionApplication>;
}
