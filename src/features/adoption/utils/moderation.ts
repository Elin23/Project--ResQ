import type { ModerationStatus } from "@/src/domain";
import { COLORS } from "@/src/theme";

export const ADOPTION_MODERATION_META: Record<
  ModerationStatus,
  {
    label: string;
    color: string;
    background: string;
    icon:
      | "create-outline"
      | "time-outline"
      | "checkmark-circle-outline"
      | "close-circle-outline"
      | "archive-outline";
  }
> = {
  draft: {
    label: "مسودة",
    color: COLORS.textMuted,
    background: COLORS.surfaceSubtle,
    icon: "create-outline",
  },
  pending_review: {
    label: "قيد المراجعة",
    color: COLORS.warning,
    background: COLORS.warningSoft,
    icon: "time-outline",
  },
  approved: {
    label: "منشور",
    color: COLORS.success,
    background: COLORS.successSoft,
    icon: "checkmark-circle-outline",
  },
  rejected: {
    label: "مرفوض",
    color: COLORS.danger,
    background: COLORS.dangerSoft,
    icon: "close-circle-outline",
  },
  archived: {
    label: "مغلق",
    color: COLORS.textMuted,
    background: COLORS.surfaceSubtle,
    icon: "archive-outline",
  },
};
