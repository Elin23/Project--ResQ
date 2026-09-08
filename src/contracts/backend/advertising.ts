import type { BackendId } from "./common";

export type AdvertisementPlacement = "HOME_BANNER" | "ADOPTION" | "ORGANIZATIONS" | "MAP" | "SEARCH";

/** Mobile receives only publishable fields. Contract/payment data stays admin-only. */
export interface SponsoredAdvertisementDto {
  id: BackendId;
  title: string;
  description?: string;
  imageUrl: string;
  galleryUrls?: string[];
  altText: string;
  callToActionLabel?: string;
  targetUrl?: string;
  placement: AdvertisementPlacement;
  startAt?: string;
  endAt?: string;
}
