import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "@/src/theme";
import type { FavoriteKind } from "./types";

type FavoriteKindMeta = {
  /** يستعمل بفلاتر شاشة المفضلة */
  label: string;
  /** يستعمل تحت اسم العنصر بالبطاقة */
  singular: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

export const FAVORITE_KIND_META: Record<FavoriteKind, FavoriteKindMeta> = {
  "feeding-point": {
    label: "نقاط الإطعام",
    singular: "نقطة إطعام",
    icon: "restaurant-outline",
    color: COLORS.textgreen,
  },
  campaign: {
    label: "حملات التبرع",
    singular: "حملة تبرع",
    icon: "heart-circle-outline",
    color: COLORS.brown,
  },
  organization: {
    label: "الجمعيات",
    singular: "جمعية",
    icon: "business-outline",
    color: COLORS.bgblue,
  },
  adoption: {
    label: "حالات التبني",
    singular: "حالة تبني",
    icon: "paw-outline",
    color: COLORS.successDark,
  },
};

export const FAVORITE_KIND_ORDER: FavoriteKind[] = [
  "feeding-point",
  "campaign",
  "organization",
  "adoption",
];
