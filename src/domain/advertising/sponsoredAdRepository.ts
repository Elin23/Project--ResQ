import type { SponsoredAd } from "./sponsoredAd";

/** Mobile read model only. No create/update/delete methods by design. */
export interface SponsoredAdRepository {
  listActive(now?: string, placement?: SponsoredAd["placement"]): Promise<SponsoredAd[]>;
}
