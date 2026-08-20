import { usePreventRemove } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { useUnsavedChangesDecision } from "@/src/components/ui/UnsavedChangesDecisionProvider";

type Options = {
  title?: string;
  message?: string;
  saveDraftLabel?: string;
  onSaveDraft?: () => Promise<boolean | void> | boolean | void;
};

/**
 * Prevents accidental loss of user-entered form data across header back,
 * Android system back, gestures and programmatic navigation actions.
 * Uses the global Arabic decision surface instead of a native Alert.
 */
export function useUnsavedChangesGuard(enabled: boolean, options: Options = {}) {
  const navigation = useNavigation();
  const { requestUnsavedChangesDecision } = useUnsavedChangesDecision();
  const [bypass, setBypass] = useState(false);
  const pendingActionRef = useRef<Parameters<typeof navigation.dispatch>[0] | null>(null);

  const continuePendingNavigation = useCallback(() => {
    const action = pendingActionRef.current;
    if (!action) return;
    pendingActionRef.current = null;
    setBypass(true);
    requestAnimationFrame(() => navigation.dispatch(action));
  }, [navigation]);

  usePreventRemove(enabled && !bypass, ({ data }) => {
    pendingActionRef.current = data.action;
    requestUnsavedChangesDecision({
      title: options.title,
      message: options.message,
      saveDraftLabel: options.saveDraftLabel,
      onSaveDraft: options.onSaveDraft,
      onDiscard: continuePendingNavigation,
    });
  });

  const allowNextNavigation = useCallback(() => {
    pendingActionRef.current = null;
    setBypass(true);
  }, []);

  return { allowNextNavigation };
}
