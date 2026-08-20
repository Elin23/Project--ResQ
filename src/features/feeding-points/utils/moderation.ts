import type { ModerationStatus } from "@/src/domain";
import { COLORS } from "@/src/theme";

export const MODERATION_STATUS_META: Record<ModerationStatus, { label: string; color: string; icon: "time-outline" | "checkmark-circle-outline" | "close-circle-outline" | "archive-outline" | "create-outline" }> = {
  draft: { label: "مسودة", color: COLORS.textMuted, icon: "create-outline" },
  pending_review: { label: "قيد المراجعة", color: COLORS.warning, icon: "time-outline" },
  approved: { label: "تمت الموافقة", color: COLORS.success, icon: "checkmark-circle-outline" },
  rejected: { label: "مرفوض", color: COLORS.danger, icon: "close-circle-outline" },
  archived: { label: "مؤرشف", color: COLORS.textMuted, icon: "archive-outline" },
};
