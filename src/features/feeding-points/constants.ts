import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/src/theme';
import type { DisplayStatus, FacilityKey, FeedingPointIssueReason, FoodLevel } from './types';

export const STALE_AFTER_HOURS = 48;

/** شفافيات هيكس — نفس اتفاقية Chip.tsx */
const ALPHA_SOFT = '22';

interface StatusMeta {
  label: string;
  color: string;
  background: string;
  icon: 'checkmark-circle' | 'alert-circle' | 'help-circle';
}

export const STATUS_META: Record<DisplayStatus, StatusMeta> = {
  stocked: {
    label: 'متوفر طعام',
    color: COLORS.textgreen,
    background: COLORS.textgreen + ALPHA_SOFT,
    icon: 'checkmark-circle',
  },
  needsFood: {
    label: 'تحتاج تعبئة',
    color: COLORS.danger,
    background: COLORS.danger + ALPHA_SOFT,
    icon: 'alert-circle',
  },
  unknown: {
    label: 'غير مؤكد',
    color: COLORS.textSecondary,
    background: COLORS.lightgray,
    icon: 'help-circle',
  },
};

/** ألوان دبابيس الخريطة — نفس الألوان بدون شفافية */
export const MARKER_COLORS: Record<DisplayStatus, string> = {
  stocked: COLORS.textgreen,
  needsFood: COLORS.danger,
  unknown: COLORS.placeholder,
};

interface FacilityMeta {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

/** وسوم مرافق النقطة — تُعرض بشاشة التفاصيل كـ Chip غير قابلة للضغط */
export const FACILITY_META: Record<FacilityKey, FacilityMeta> = {
  water: {
    label: 'مصدر مياه',
    icon: 'water-outline',
    color: COLORS.accent,
  },
  shade: {
    label: 'مكان مظلل',
    icon: 'leaf-outline',
    color: COLORS.textgreen,
  },
};

interface WaterMeta {
  label: string;
  icon: 'water' | 'water-outline';
  color: string;
}

/** حالة توفر الماء بالنقطة — تُعرض كشارة بجانب حالة الطعام ببطاقة النقطة */
export const WATER_META: Record<'available' | 'unavailable', WaterMeta> = {
  available: {
    label: 'متوفر',
    icon: 'water',
    color: COLORS.successDark,
  },
  unavailable: {
    label: 'غير متوفر',
    icon: 'water-outline',
    color: COLORS.urgent,
  },
};

interface FoodLevelMeta {
  label: string;
  icon: 'restaurant' | 'restaurant-outline';
  color: string;
  /** خلفية مخصصة — وإلا بتنشتق من color بشفافية (نفس اتفاقية STATUS_META) */
  background?: string;
}

/** مستوى الطعام بالنقطة — مستقل عن STATUS_META (اللي بيعكس آخر بلاغ حالة) */
export const FOOD_LEVEL_META: Record<FoodLevel, FoodLevelMeta> = {
  good: {
    label: 'ممتاز',
    icon: 'restaurant',
    color: COLORS.successDark,
  },
  medium: {
    label: 'متوسط',
    icon: 'restaurant-outline',
    color: COLORS.brownMuted,
    background: COLORS.tan,
  },
  empty: {
    label: 'فارغ',
    icon: 'restaurant-outline',
    color: COLORS.urgent,
  },
};

/** أسباب البلاغ عن مشكلة بنقطة — منفصلة عن STATUS_META تماماً */
export const ISSUE_REASON_META: Record<FeedingPointIssueReason, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  brokenContainer: { label: 'وعاء مكسور', icon: 'archive-outline' },
  contaminatedWater: { label: 'مياه غير صالحة', icon: 'water-outline' },
  injuredAnimal: { label: 'حيوان مصاب', icon: 'medkit-outline' },
  pointMissing: { label: 'النقطة غير موجودة', icon: 'help-buoy-outline' },
  other: { label: 'سبب آخر', icon: 'ellipsis-horizontal-circle-outline' },
};