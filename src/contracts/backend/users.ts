import type { BackendId } from "./common";

export type UserAccountStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED" | "DEACTIVATED";
export type UserVerificationStatus = "UNVERIFIED" | "PHONE_VERIFIED" | "VERIFIED";

export interface UserProfileDto {
  id: BackendId;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  governorateId?: BackendId;
  governorateName?: string;
  regionId?: BackendId;
  regionName?: string;
  birthDate?: string;
  profileBio?: string;
  accountStatus: UserAccountStatus;
  verificationStatus: UserVerificationStatus;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
}
