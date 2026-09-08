import type { SponsoredAd } from "@/src/domain";
import type { SponsoredAdvertisementDto } from "@/src/contracts/backend/advertising";

export function sponsoredAdvertisementDtoToDomain(dto: SponsoredAdvertisementDto): SponsoredAd {
  return {
    id: dto.id,
    sponsorName: "إعلان ممول",
    title: dto.title,
    description: dto.description,
    imageUrl: dto.imageUrl,
    altText: dto.altText,
    callToActionLabel: dto.callToActionLabel,
    placement: dto.placement,
    targetUrl: dto.targetUrl,
    startsAt: dto.startAt ?? new Date(0).toISOString(),
    endsAt: dto.endAt,
    active: true,
  };
}
