import { GOVERNORATE_LOOKUPS } from "@/src/data/seeds/locationLookups.seed";

/**
 * Mock-mode display list. In real API mode these values must come from
 * GET /api/lookups/governorates so mobile and dashboard use the same catalog.
 */
export const SYRIAN_GOVERNORATES = GOVERNORATE_LOOKUPS.map((item) => item.name);
