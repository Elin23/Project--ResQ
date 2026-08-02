export function formatDistance(meters?: number): string | null {
  if (meters == null) return null;
  if (meters < 1000) return `${Math.round(meters / 10) * 10} م`;
  return `${(meters / 1000).toFixed(1)} كم`;
}