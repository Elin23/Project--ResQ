import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = {
  refreshing?: boolean;
  error?: string | null;
  stale?: boolean;
  lastUpdatedAt?: number | null;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
};

function formatUpdatedAt(timestamp?: number | null) {
  if (!timestamp) return null;
  try {
    return new Intl.DateTimeFormat("ar", { hour: "numeric", minute: "2-digit" }).format(new Date(timestamp));
  } catch {
    return null;
  }
}

export default function RefreshStatus({ refreshing = false, error, stale = false, lastUpdatedAt, onRetry, style }: Props) {
  if (!refreshing && !error && !stale) return null;
  const failed = Boolean(error);
  const updatedAt = formatUpdatedAt(lastUpdatedAt);
  const message = failed
    ? `تعذر تحديث البيانات. نعرض آخر نسخة متاحة${updatedAt ? ` منذ ${updatedAt}` : ""}.`
    : refreshing
      ? "جاري تحديث البيانات…"
      : `قد تكون هذه البيانات غير محدثة${updatedAt ? ` — آخر تحديث ${updatedAt}` : ""}.`;

  return (
    <View
      accessibilityRole={failed ? "alert" : "progressbar"}
      accessibilityLabel={message}
      style={[styles.container, failed || stale ? styles.warning : styles.refreshing, style]}
    >
      <Ionicons
        name={failed || stale ? "cloud-offline-outline" : "sync-outline"}
        size={18}
        color={failed || stale ? COLORS.warning : COLORS.primaryStrong}
      />
      <AppText variant="caption" color={COLORS.textSecondary} style={styles.text}>
        {message}
      </AppText>
      {failed && onRetry ? (
        <Pressable accessibilityRole="button" accessibilityLabel="إعادة محاولة تحديث البيانات" onPress={onRetry} style={styles.retry} hitSlop={8}>
          <AppText variant="caption" weight="bold" color={COLORS.primaryStrong}>إعادة المحاولة</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.sm,
  },
  refreshing: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.divider },
  warning: { backgroundColor: COLORS.warningSoft, borderColor: COLORS.warning },
  text: { flex: 1 },
  retry: { minHeight: 44, justifyContent: "center" },
});
