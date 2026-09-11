import type { LocationLookupRepository } from "@/src/domain/lookups/locationLookup";
import { apiRequest } from "./client";
import { API_ENDPOINTS } from "./endpoints";

type GovernorateLookupDto = { id?: string | number | null; name?: string | null; nameEn?: string | null };
type RegionLookupDto = { id?: string | number | null; governorateId?: string | number | null; name?: string | null; nameEn?: string | null };

export class ApiLocationLookupRepository implements LocationLookupRepository {
  async listGovernorates() {
    const items = await apiRequest<GovernorateLookupDto[]>(API_ENDPOINTS.lookups.governorates, { skipAuth: true });
    return items
      .filter((item) => Boolean(item.id && item.name))
      .map((item) => ({ id: String(item.id), name: item.name! }));
  }

  async listRegions(governorateId: string) {
    const items = await apiRequest<RegionLookupDto[]>(API_ENDPOINTS.lookups.regions(governorateId), { skipAuth: true });
    return items
      .filter((item) => Boolean(item.id && item.governorateId && item.name))
      .map((item) => ({ id: String(item.id), governorateId: String(item.governorateId), name: item.name! }));
  }

  async resolveGovernorateId(name: string) {
    return (await this.listGovernorates()).find((item) => item.name === name)?.id;
  }

  async resolveRegionId(governorateId: string, name: string) {
    return (await this.listRegions(governorateId)).find((item) => item.name === name)?.id;
  }
}
