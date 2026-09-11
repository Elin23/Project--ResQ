import type { PagedResultDto } from "@/src/contracts/backend/common";
import type { FeedingPointDto } from "@/src/contracts/backend/feedingPoints";
import { apiRequest } from "@/src/services/api/client";
import { API_ENDPOINTS } from "@/src/services/api/endpoints";
import { feedingPointDtoToDetails, feedingPointDtoToSummary, ISSUE_REASON_TO_BACKEND } from "@/src/services/api/mappers/feedingPointMapper";
import { resolveMediaUrl } from "@/src/services/api/mediaUrl";
import { pageItems, withQuery } from "@/src/services/api/query";
import { uploadLocalMediaUris } from "@/src/services/api/uploadsApi";

import type {
  CreateFeedingPointIssueInput,
  CreateStatusUpdateInput,
  FeedingPointDetails,
  FeedingPointIssue,
  FeedingPointIssueReason,
  FeedingPointSummary,
  FeedingPointsQuery,
  StatusUpdate,
} from "../types";

type RefillDto = {
  id: number;
  feedingPointId: number;
  submittedByAccountId: string;
  foodLevelAfter?: string | null;
  waterAvailableAfter: boolean;
  note?: string | null;
  occurredAt: string;
  reviewStatus?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
  photoUrl?: string | null;
};

type IssueDto = {
  id: number;
  feedingPointId: number;
  submittedByAccountId: string;
  type?: string | null;
  description?: string | null;
  status?: string | null;
  createdAt: string;
};

const ISSUE_DEFAULT_DESCRIPTION: Record<FeedingPointIssueReason, string> = {
  empty: "النقطة فارغة",
  noWater: "لا يوجد ماء في النقطة",
  damaged: "النقطة متضررة",
  dirty: "النقطة بحاجة إلى تنظيف",
  missing: "النقطة غير موجودة",
  unsafeLocation: "موقع النقطة غير آمن",
  other: "تم الإبلاغ عن مشكلة في نقطة الإطعام",
};

const refillToStatusUpdate = (dto: RefillDto): StatusUpdate => ({
  id: String(dto.id),
  feedingPointId: String(dto.feedingPointId),
  userId: dto.submittedByAccountId,
  userName: "مستخدم ResQ",
  userAvatarUrl: null,
  reportedStatus: dto.foodLevelAfter === "EMPTY" || dto.foodLevelAfter === "LOW" ? "needsFood" : "stocked",
  photoUrl: resolveMediaUrl(dto.photoUrl) ?? "",
  note: dto.note ?? null,
  createdAt: dto.occurredAt || dto.createdAt,
  reviewState: dto.reviewStatus === "VERIFIED" ? "verified" : dto.reviewStatus === "REJECTED" ? "rejected" : "pending",
});

export async function fetchFeedingPoints(query: FeedingPointsQuery = {}): Promise<FeedingPointSummary[]> {
  const status = query.status === "needsFood" ? "ACTIVE" : undefined;
  const payload = await apiRequest<PagedResultDto<FeedingPointDto> | FeedingPointDto[]>(
    withQuery(API_ENDPOINTS.feedingPoints.list, { Search: query.search, Status: status, Page: 1, PageSize: 100 }),
  );
  let items = pageItems(payload).map(feedingPointDtoToSummary);
  if (query.status) items = items.filter((item) => item.status === query.status);
  return items;
}

export async function fetchFeedingPointDetails(id: string): Promise<FeedingPointDetails> {
  return feedingPointDtoToDetails(await apiRequest<FeedingPointDto>(API_ENDPOINTS.feedingPoints.byId(id)));
}

export async function fetchStatusUpdates(pointId: string): Promise<StatusUpdate[]> {
  const items = await apiRequest<RefillDto[]>(API_ENDPOINTS.feedingPoints.refills(pointId));
  return items.map(refillToStatusUpdate);
}

export async function createStatusUpdate(input: CreateStatusUpdateInput): Promise<StatusUpdate> {
  const uploads = await uploadLocalMediaUris([input.photoUri]);
  const dto = await apiRequest<RefillDto>(API_ENDPOINTS.feedingPoints.refills(input.feedingPointId), {
    method: "POST",
    body: JSON.stringify({
      foodLevelAfter: input.reportedStatus === "needsFood" ? "LOW" : "FULL",
      waterAvailableAfter: true,
      note: input.note?.trim() || null,
      occurredAt: new Date().toISOString(),
      mediaUploadIds: uploads.map((item) => item.id),
    }),
  });
  const mapped = refillToStatusUpdate(dto);
  return { ...mapped, userName: "أنت", photoUrl: mapped.photoUrl || input.photoUri };
}

export async function createFeedingPointIssue(input: CreateFeedingPointIssueInput): Promise<FeedingPointIssue> {
  // UI intentionally makes the free-text note optional. Always send a valid
  // backend description so selecting a reason alone cannot produce a 422.
  const description = input.note?.trim() || ISSUE_DEFAULT_DESCRIPTION[input.reason];
  const dto = await apiRequest<IssueDto>(API_ENDPOINTS.feedingPoints.issues(input.feedingPointId), {
    method: "POST",
    body: JSON.stringify({
      type: ISSUE_REASON_TO_BACKEND[input.reason],
      description,
      mediaUploadIds: [],
    }),
  });
  return {
    id: String(dto.id),
    feedingPointId: String(dto.feedingPointId),
    userId: dto.submittedByAccountId,
    userName: "أنت",
    reason: input.reason,
    note: dto.description ?? description,
    createdAt: dto.createdAt,
    reviewState: dto.status === "RESOLVED" ? "verified" : dto.status === "REJECTED" ? "rejected" : "pending",
  };
}
