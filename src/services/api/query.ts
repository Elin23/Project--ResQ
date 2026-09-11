import type { PagedResultDto } from "@/src/contracts/backend/common";

export function withQuery(path: string, params: Record<string, string | number | boolean | null | undefined>) {
  const search = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
  return search ? `${path}${path.includes("?") ? "&" : "?"}${search}` : path;
}

export function pageItems<T>(payload: PagedResultDto<T> | T[] | null | undefined): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload.items) ? payload.items : [];
}
