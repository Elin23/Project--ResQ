import type { AdoptionContact, AdoptionLocation } from "./adoption";

export interface AdoptionContactAccess {
  applicationId: string;
  listingId: string;
  applicantAccountId: string;
  listingOwnerAccountId: string;
  contact: AdoptionContact;
  location: AdoptionLocation;
}
