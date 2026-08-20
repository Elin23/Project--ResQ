const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function pluralAr(count: number, singular: string, dual: string, plural: string) {
  if (count === 1) return singular;
  if (count === 2) return dual;
  if (count >= 3 && count <= 10) return `${count} ${plural}`;
  return `${count} ${singular}`;
}

export function formatRelativeTimeAr(dateIso: string): string {
  const diffMs = Date.now() - new Date(dateIso).getTime();

  if (diffMs < HOUR_MS) return "منذ قليل";

  const hours = Math.floor(diffMs / HOUR_MS);
  if (hours < 24) return `منذ ${pluralAr(hours, "ساعة", "ساعتين", "ساعات")}`;

  const days = Math.floor(diffMs / DAY_MS);
  return `منذ ${pluralAr(days, "يوم", "يومين", "أيام")}`;
}
