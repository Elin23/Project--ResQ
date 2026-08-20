import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, ICON_SIZES, RADIUS, SHADOWS, SPACING } from "@/src/theme";
import AppText from "./AppText";

export type FeedbackTone = "success" | "error" | "warning" | "info";

type FeedbackOptions = {
  title: string;
  message?: string;
  tone?: FeedbackTone;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
};

type FeedbackContextValue = {
  showFeedback: (options: FeedbackOptions) => void;
  hideFeedback: () => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

const toneConfig: Record<FeedbackTone, {
  icon: keyof typeof Ionicons.glyphMap;
  foreground: string;
  background: string;
  border: string;
}> = {
  success: {
    icon: "checkmark-circle-outline",
    foreground: COLORS.success,
    background: COLORS.successSoft,
    border: COLORS.success,
  },
  error: {
    icon: "alert-circle-outline",
    foreground: COLORS.danger,
    background: COLORS.dangerSoft,
    border: COLORS.danger,
  },
  warning: {
    icon: "warning-outline",
    foreground: COLORS.warning,
    background: COLORS.warningSoft,
    border: COLORS.warning,
  },
  info: {
    icon: "information-circle-outline",
    foreground: COLORS.info,
    background: COLORS.infoSoft,
    border: COLORS.info,
  },
};

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [feedback, setFeedback] = useState<FeedbackOptions | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hideFeedback = useCallback(() => {
    clearTimer();
    Animated.timing(progress, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setFeedback(null);
    });
  }, [clearTimer, progress]);

  const showFeedback = useCallback((options: FeedbackOptions) => {
    clearTimer();
    setFeedback({ ...options, tone: options.tone ?? "info" });
    progress.stopAnimation();
    progress.setValue(0);
    Animated.spring(progress, {
      toValue: 1,
      damping: 18,
      stiffness: 230,
      mass: 0.8,
      useNativeDriver: true,
    }).start();

    const durationMs = options.durationMs ?? (options.tone === "error" ? 4500 : 3200);
    timerRef.current = setTimeout(hideFeedback, durationMs);
  }, [clearTimer, hideFeedback, progress]);

  useEffect(() => clearTimer, [clearTimer]);

  const value = useMemo(() => ({ showFeedback, hideFeedback }), [hideFeedback, showFeedback]);
  const tone = feedback?.tone ?? "info";
  const config = toneConfig[tone];

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {feedback ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.overlay,
            {
              top: insets.top + SPACING.sm,
              opacity: progress,
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-18, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={[styles.banner, { backgroundColor: config.background, borderColor: config.border }]}
          >
            <Ionicons name={config.icon} size={ICON_SIZES.md} color={config.foreground} />
            <View style={styles.copy}>
              <AppText variant="body" weight="bold" color={COLORS.text}>{feedback.title}</AppText>
              {feedback.message ? (
                <AppText variant="bodySmall" color={COLORS.textSecondary} style={styles.message}>
                  {feedback.message}
                </AppText>
              ) : null}
            </View>
            {feedback.actionLabel && feedback.onAction ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={feedback.actionLabel}
                hitSlop={8}
                onPress={() => {
                  feedback.onAction?.();
                  hideFeedback();
                }}
                style={({ pressed }) => [styles.action, pressed && styles.pressed]}
              >
                <AppText variant="label" weight="bold" color={config.foreground}>{feedback.actionLabel}</AppText>
              </Pressable>
            ) : (
              <Pressable accessibilityRole="button" accessibilityLabel="إغلاق الرسالة" hitSlop={8} onPress={hideFeedback} style={styles.close}>
                <Ionicons name="close" size={ICON_SIZES.sm} color={COLORS.iconMuted} />
              </Pressable>
            )}
          </View>
        </Animated.View>
      ) : null}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const value = useContext(FeedbackContext);
  if (!value) throw new Error("useFeedback must be used within FeedbackProvider");
  return value;
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 1000,
    alignItems: "center",
  },
  banner: {
    width: "100%",
    maxWidth: 640,
    minHeight: 56,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.sm,
    ...SHADOWS.sm,
    ...(Platform.OS === "android" ? { elevation: 5 } : null),
  },
  copy: { flex: 1, minWidth: 0 },
  message: { marginTop: SPACING.xxs },
  action: { minHeight: 44, justifyContent: "center", paddingHorizontal: SPACING.sm },
  close: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.72 },
});
