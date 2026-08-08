import type { RegisterEntityChipOption } from "../types/registerEntity";

export const ENTITY_ORGANIZATION_TYPES = [
  "جمعية مرخصة",
  "منظمة غير ربحية",
  "فريق إنقاذ مسجل",
  "مأوى حيوانات",
  "مبادرة مجتمعية",
];

export const ENTITY_CLINIC_TYPES = [
  "عيادة بيطرية عامة",
  "مشفى بيطري",
  "مركز لقاحات ورعاية",
  "عيادة تخصصية",
  "مركز إسعاف بيطري",
];

export const ENTITY_ORGANIZATION_ACTIVITIES: RegisterEntityChipOption[] = [
  { id: "rescue", label: "إنقاذ ميداني", icon: "paw-outline" },
  { id: "shelter", label: "إيواء", icon: "home-outline" },
  { id: "adoption", label: "تبنّي", icon: "heart-outline" },
  { id: "awareness", label: "توعية", icon: "megaphone-outline" },
  { id: "treatment", label: "علاج", icon: "medkit-outline" },
];

export const ENTITY_CLINIC_SERVICES: RegisterEntityChipOption[] = [
  { id: "emergency", label: "إسعاف", icon: "medical-outline" },
  { id: "examination", label: "فحص", icon: "search-outline" },
  { id: "vaccination", label: "لقاحات", icon: "shield-checkmark-outline" },
  { id: "surgery", label: "جراحة", icon: "cut-outline" },
  { id: "laboratory", label: "تحاليل", icon: "flask-outline" },
  { id: "imaging", label: "تصوير", icon: "scan-outline" },
];

export const ENTITY_ORGANIZATION_ANIMALS: RegisterEntityChipOption[] = [
  { id: "cats", label: "قطط", icon: "paw-outline" },
  { id: "dogs", label: "كلاب", icon: "paw-outline" },
  { id: "birds", label: "طيور", icon: "leaf-outline" },
  { id: "other", label: "أخرى", icon: "add-circle-outline" },
];

export const ENTITY_CLINIC_ANIMALS: RegisterEntityChipOption[] = [
  { id: "pets", label: "حيوانات أليفة", icon: "paw-outline" },
  { id: "birds", label: "طيور", icon: "leaf-outline" },
  { id: "farm", label: "حيوانات مزرعة", icon: "nutrition-outline" },
  { id: "other", label: "أخرى", icon: "add-circle-outline" },
];
