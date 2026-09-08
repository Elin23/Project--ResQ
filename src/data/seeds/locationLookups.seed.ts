import type { GovernorateLookup, RegionLookup } from "@/src/domain/lookups/locationLookup";

export const GOVERNORATE_LOOKUPS: GovernorateLookup[] = [
  ["gov-damascus", "دمشق"],
  ["gov-rif-dimashq", "ريف دمشق"],
  ["gov-aleppo", "حلب"],
  ["gov-homs", "حمص"],
  ["gov-hama", "حماة"],
  ["gov-latakia", "اللاذقية"],
  ["gov-tartous", "طرطوس"],
  ["gov-idlib", "إدلب"],
  ["gov-daraa", "درعا"],
  ["gov-suwayda", "السويداء"],
  ["gov-quneitra", "القنيطرة"],
  ["gov-deir-ez-zor", "دير الزور"],
  ["gov-raqqa", "الرقة"],
  ["gov-hasakah", "الحسكة"],
].map(([id, name]) => ({ id, name }));

/**
 * Mock lookup values only. In real API mode these records come exclusively
 * from the locations managed by the dashboard. Forms never accept a free-text
 * governorate/region value.
 */
export const REGION_LOOKUPS: RegionLookup[] = [
  { id: "reg-mazzeh", governorateId: "gov-damascus", name: "المزة" },
  { id: "reg-shaalaan", governorateId: "gov-damascus", name: "الشعلان" },
  { id: "reg-malki", governorateId: "gov-damascus", name: "المالكي" },
  { id: "reg-midan", governorateId: "gov-damascus", name: "الميدان" },
  { id: "reg-jaramana", governorateId: "gov-rif-dimashq", name: "جرمانا" },
  { id: "reg-sahnaya", governorateId: "gov-rif-dimashq", name: "صحنايا" },
  { id: "reg-douma", governorateId: "gov-rif-dimashq", name: "دوما" },
  { id: "reg-aleppo-center", governorateId: "gov-aleppo", name: "مركز حلب" },
  { id: "reg-hamdaniyah", governorateId: "gov-aleppo", name: "الحمدانية" },
  { id: "reg-homs-center", governorateId: "gov-homs", name: "مركز حمص" },
  { id: "reg-waer", governorateId: "gov-homs", name: "الوعر" },
  { id: "reg-hama-center", governorateId: "gov-hama", name: "مركز حماة" },
  { id: "reg-latakia-center", governorateId: "gov-latakia", name: "مركز اللاذقية" },
  { id: "reg-jableh", governorateId: "gov-latakia", name: "جبلة" },
  { id: "reg-tartous-center", governorateId: "gov-tartous", name: "مركز طرطوس" },
  { id: "reg-baniyas", governorateId: "gov-tartous", name: "بانياس" },
  { id: "reg-idlib-center", governorateId: "gov-idlib", name: "مركز إدلب" },
  { id: "reg-daraa-center", governorateId: "gov-daraa", name: "مركز درعا" },
  { id: "reg-suwayda-center", governorateId: "gov-suwayda", name: "مركز السويداء" },
  { id: "reg-quneitra-center", governorateId: "gov-quneitra", name: "مركز القنيطرة" },
  { id: "reg-deir-center", governorateId: "gov-deir-ez-zor", name: "مركز دير الزور" },
  { id: "reg-raqqa-center", governorateId: "gov-raqqa", name: "مركز الرقة" },
  { id: "reg-hasakah-center", governorateId: "gov-hasakah", name: "مركز الحسكة" },
  { id: "reg-qamishli", governorateId: "gov-hasakah", name: "القامشلي" },
];
