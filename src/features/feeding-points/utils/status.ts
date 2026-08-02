import { STALE_AFTER_HOURS } from '../constants';
import type { DisplayStatus, ReportedStatus } from '../types';

/**
 * بتحوّل الحالة المخزّنة لحالة العرض.
 * إذا آخر تحديث أقدم من STALE_AFTER_HOURS بتصير "غير مؤكد".
 */
export function getDisplayStatus(
  status: ReportedStatus,
  lastStatusUpdateAt: string,
  now: Date = new Date(),
): DisplayStatus {
  const updatedAt = new Date(lastStatusUpdateAt);
  if (Number.isNaN(updatedAt.getTime())) return 'unknown';

  const hoursPassed = (now.getTime() - updatedAt.getTime()) / 3_600_000;
  return hoursPassed > STALE_AFTER_HOURS ? 'unknown' : status;
}

/** "من 3 ساعات" — نسخة بسيطة، بدّلها بـ dayjs/ar لاحقاً */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const minutes = Math.floor((now.getTime() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `من ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `من ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'من يوم' : `من ${days} يوم`;
}