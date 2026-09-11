import type { SponsoredAd } from "@/src/domain/advertising/sponsoredAd";

/**
 * Mock data only. In production this list comes from the backend after the admin
 * has completed the external advertising contract/payment process.
 */
export const SPONSORED_ADS_SEED: SponsoredAd[] = [
  {
    id: "sponsored-ad-1",
    sponsorName: "PetCare",
    title: "كل ما يحتاجه حيوانك الأليف في مكان واحد",
    description: "خصومات وعروض مختارة على مستلزمات ورعاية الحيوانات الأليفة.",
    placement: "HOME_BANNER",
    callToActionLabel: "اكتشف المزيد",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80",
    startsAt: "2026-01-01T00:00:00.000Z",
    endsAt: "2027-01-01T00:00:00.000Z",
    active: true,
  },
];
