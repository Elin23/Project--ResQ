import type { LocationLookupRepository } from "@/src/domain/lookups/locationLookup";
import { GOVERNORATE_LOOKUPS, REGION_LOOKUPS } from "@/test-fixtures/seeds/locationLookups.seed";

export class InMemoryLocationLookupRepository implements LocationLookupRepository {
  async listGovernorates() {
    return GOVERNORATE_LOOKUPS.map((item) => ({ ...item }));
  }

  async listRegions(governorateId: string) {
    return REGION_LOOKUPS.filter((item) => item.governorateId === governorateId).map((item) => ({ ...item }));
  }

  async resolveGovernorateId(name: string) {
    return GOVERNORATE_LOOKUPS.find((item) => item.name === name)?.id;
  }

  async resolveRegionId(governorateId: string, name: string) {
    return REGION_LOOKUPS.find((item) => item.governorateId === governorateId && item.name === name)?.id;
  }
}
