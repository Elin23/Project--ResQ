export interface GovernorateLookup {
  id: string;
  name: string;
}

export interface RegionLookup {
  id: string;
  governorateId: string;
  name: string;
}

export interface LocationLookupRepository {
  listGovernorates(): Promise<GovernorateLookup[]>;
  listRegions(governorateId: string): Promise<RegionLookup[]>;
  resolveGovernorateId(name: string): Promise<string | undefined>;
  resolveRegionId(governorateId: string, name: string): Promise<string | undefined>;
}
