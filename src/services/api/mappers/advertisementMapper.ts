import { resolveMediaUrl } from "../mediaUrl";
import type { SponsoredAd } from "@/src/domain";
import type { SponsoredAdvertisementDto } from "@/src/contracts/backend/advertising";
export function sponsoredAdvertisementDtoToDomain(dto:SponsoredAdvertisementDto):SponsoredAd { return { id:String(dto.id),sponsorName:"إعلان ممول",title:dto.title ?? "إعلان",description:dto.description ?? undefined,imageUrl:resolveMediaUrl(dto.imageUrl),altText:dto.altText ?? dto.title ?? "إعلان ممول",callToActionLabel:dto.callToActionLabel ?? undefined,placement:(dto.placement ?? "HOME_BANNER") as SponsoredAd["placement"],targetUrl:dto.targetUrl ?? undefined,startsAt:dto.startAt ?? dto.createdAt,endsAt:dto.endAt ?? undefined,active:dto.status == null || dto.status === "ACTIVE" }; }
