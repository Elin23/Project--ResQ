import type { BackendId } from "./common";

export interface GovernorateLookupDto {
  id: BackendId;
  name: string;
  active: boolean;
}

export interface RegionLookupDto {
  id: BackendId;
  governorateId: BackendId;
  name: string;
  active: boolean;
}
