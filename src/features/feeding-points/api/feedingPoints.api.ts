import {
  MOCK_CURRENT_USER,
  MOCK_DETAILS,
  MOCK_POINTS,
  MOCK_UPDATES,
} from '@/src/data/feedingPoints.mock';
import type {
  CreateFeedingPointIssueInput,
  CreateStatusUpdateInput,
  FeedingPointDetails,
  FeedingPointIssue,
  FeedingPointSummary,
  FeedingPointsQuery,
  StatusUpdate,
} from '../types';

const USE_MOCKS = true; // ← بدّلها لـ false لما يجهز الباك إند

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

/** بلاغات المشاكل المخزّنة أثناء الجلسة — مش جزء من MOCK_DETAILS لأنها كيان منفصل تماماً */
const MOCK_ISSUES: Record<string, FeedingPointIssue[]> = {};

export async function fetchFeedingPoints(
  query: FeedingPointsQuery = {},
): Promise<FeedingPointSummary[]> {
  if (USE_MOCKS) {
    await delay();
    let items = [...MOCK_POINTS];
    if (query.status) items = items.filter((p) => p.status === query.status);
    if (query.search) {
      const q = query.search.trim();
      items = items.filter((p) => p.name.includes(q) || p.address.includes(q));
    }
    return items;
  }

  // TODO: استبدلها بنداء http الحقيقي
  throw new Error('API not implemented yet');
}

export async function fetchFeedingPointDetails(id: string): Promise<FeedingPointDetails> {
  if (USE_MOCKS) {
    await delay();
    const found = MOCK_DETAILS[id];
    if (!found) throw new Error('النقطة غير موجودة');
    return found;
  }
  throw new Error('API not implemented yet');
}

export async function fetchStatusUpdates(pointId: string): Promise<StatusUpdate[]> {
  if (USE_MOCKS) {
    await delay(400);
    return MOCK_UPDATES[pointId] ?? [];
  }
  throw new Error('API not implemented yet');
}

/**
 * تحديث حالة جديد بيتطلب صورة إجبارية، وبيضل "بانتظار المراجعة"
 * لحد ما الإدارة تراجعه — ما بيغيّر حالة النقطة المعروضة فوراً.
 */
export async function createStatusUpdate(
  input: CreateStatusUpdateInput,
): Promise<StatusUpdate> {
  if (USE_MOCKS) {
    await delay(500);
    const update: StatusUpdate = {
      id: `su-${Date.now()}`,
      feedingPointId: input.feedingPointId,
      userId: MOCK_CURRENT_USER.id,
      userName: MOCK_CURRENT_USER.name,
      userAvatarUrl: null,
      reportedStatus: input.reportedStatus,
      photoUrl: input.photoUri,
      note: input.note ?? null,
      createdAt: new Date().toISOString(),
      reviewState: 'pending',
    };

    MOCK_UPDATES[input.feedingPointId] = [
      update,
      ...(MOCK_UPDATES[input.feedingPointId] ?? []),
    ];

    return update;
  }
  throw new Error('API not implemented yet');
}

/** بلاغ مشكلة بنقطة — كيان منفصل عن تحديث الحالة (لا علاقة له بـ ReportedStatus) */
export async function createFeedingPointIssue(
  input: CreateFeedingPointIssueInput,
): Promise<FeedingPointIssue> {
  if (USE_MOCKS) {
    await delay(500);
    const issue: FeedingPointIssue = {
      id: `fpi-${Date.now()}`,
      feedingPointId: input.feedingPointId,
      userId: MOCK_CURRENT_USER.id,
      userName: MOCK_CURRENT_USER.name,
      reason: input.reason,
      note: input.note ?? null,
      createdAt: new Date().toISOString(),
      reviewState: 'pending',
    };

    MOCK_ISSUES[input.feedingPointId] = [
      issue,
      ...(MOCK_ISSUES[input.feedingPointId] ?? []),
    ];

    return issue;
  }
  throw new Error('API not implemented yet');
}
