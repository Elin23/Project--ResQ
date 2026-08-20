export type AdoptionApplicationStatus =
  | "pending"
  | "accepted"
  | "completed"
  | "rejected"
  | "not_selected"
  | "withdrawn";

export type ApplicantHousing = "apartment" | "house" | "farm" | "other";

export interface AdoptionApplication {
  id: string;
  listingId: string;
  listingOwnerAccountId: string;
  applicantAccountId: string;
  applicantName: string;
  phone: string;
  city: string;
  housing: ApplicantHousing;
  hasOtherPets: boolean;
  experience: string;
  reason: string;
  notes?: string;
  status: AdoptionApplicationStatus;
  createdAt: string;
  updatedAt: string;
  decidedAt?: string;
  decisionNote?: string;
  applicantHandoverConfirmedAt?: string;
  ownerHandoverConfirmedAt?: string;
  completedAt?: string;
}

export interface CreateAdoptionApplicationInput {
  listingId: string;
  applicantAccountId: string;
  applicantName: string;
  phone: string;
  city: string;
  housing: ApplicantHousing;
  hasOtherPets: boolean;
  experience: string;
  reason: string;
  notes?: string;
}
