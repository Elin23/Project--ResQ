export type BackendId = string;

export type MediaType = "IMAGE" | "VIDEO";

export interface MediaDto {
  id: BackendId;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  createdAt?: string;
}

export type CurrencyCode = "SYP";

export interface MoneyDto {
  amountMinor: number;
  currency: CurrencyCode;
}

export interface GeoLocationDto {
  governorateId: BackendId;
  governorateName: string;
  regionId?: BackendId;
  regionName?: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface PagedResultDto<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}
