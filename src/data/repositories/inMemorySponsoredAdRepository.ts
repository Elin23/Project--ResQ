import type { SponsoredAd } from "@/src/domain/advertising/sponsoredAd";
import type { SponsoredAdRepository } from "@/src/domain/advertising/sponsoredAdRepository";
import { SPONSORED_ADS_SEED } from "@/src/data/sponsoredAds.seed";

function clone(item: SponsoredAd): SponsoredAd {
  return { ...item };
}

export class InMemorySponsoredAdRepository implements SponsoredAdRepository {
  private readonly items = SPONSORED_ADS_SEED.map(clone);

  async listActive(now = new Date().toISOString(), placement?: SponsoredAd["placement"]): Promise<SponsoredAd[]> {
    const current = Date.parse(now);
    return this.items
      .filter((item) => {
        if (!item.active) return false;
        if (placement && item.placement !== placement) return false;
        if (Date.parse(item.startsAt) > current) return false;
        if (item.endsAt && Date.parse(item.endsAt) < current) return false;
        return true;
      })
      .map(clone);
  }
}
