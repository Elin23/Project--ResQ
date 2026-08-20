import * as Linking from "expo-linking";
import { useCallback } from "react";

import { useFeedback } from "@/src/components/ui/FeedbackProvider";

type PermissionResponseLike = {
  granted: boolean;
  canAskAgain?: boolean;
};

type PermissionCopy = {
  title: string;
  message: string;
  settingsMessage?: string;
};

export function usePermissionFeedback() {
  const { showFeedback } = useFeedback();

  const handlePermission = useCallback(
    (permission: PermissionResponseLike, copy: PermissionCopy) => {
      if (permission.granted) return true;

      const blocked = permission.canAskAgain === false;
      showFeedback({
        title: copy.title,
        message: blocked
          ? copy.settingsMessage ?? `${copy.message} يمكنك تفعيل الصلاحية من إعدادات التطبيق.`
          : copy.message,
        tone: "warning",
        durationMs: blocked ? 6500 : 4500,
        actionLabel: blocked ? "فتح الإعدادات" : undefined,
        onAction: blocked ? () => void Linking.openSettings() : undefined,
      });
      return false;
    },
    [showFeedback],
  );

  return { handlePermission };
}
