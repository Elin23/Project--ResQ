export type BackendId = string;
export type NumericBackendId = number;

export type MediaType = "IMAGE" | "VIDEO";

export interface MediaDto {
  id: number;
  type?: string | null;
  url?: string | null;
  thumbnailUrl?: string | null;
  altText?: string | null;
  caption?: string | null;
}

export type CurrencyCode = "SYP" | string;

export interface PagedResultDto<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export function toBackendId(value: string | number | null | undefined): string {
  return value == null ? "" : String(value);
}
