import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { AccessibilityInfo, Modal, Pressable, StyleSheet, View } from "react-native";

import { COLORS, DENSITY, ICON_SIZES, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";
import Button from "./Button";
import { useResponsiveLayout } from "./useResponsiveLayout";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
  loading?: boolean;
};

/** Accessible confirmation surface for destructive or high-impact actions. */
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "إلغاء",
  onConfirm,
  onCancel,
  icon = "alert-circle-outline",
  destructive = true,
  loading = false,
}: Props) {
  const { isNarrow } = useResponsiveLayout();

  useEffect(() => {
    if (visible) void AccessibilityInfo.announceForAccessibility(`${title}. ${message}`);
  }, [message, title, visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={loading ? undefined : onCancel}>
      <Pressable
        accessible={false}
        style={styles.backdrop}
        onPress={loading ? undefined : onCancel}
      >
        <Pressable
          accessible={false}
          accessibilityViewIsModal
          style={[styles.dialog, isNarrow && styles.dialogNarrow]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={[styles.iconCircle, !destructive && styles.iconCircleNeutral]}>
            <Ionicons name={icon} size={ICON_SIZES.lg} color={destructive ? COLORS.danger : COLORS.primaryStrong} />
          </View>
          <AppText accessibilityRole="header" variant="h3" weight="bold" align="center">{title}</AppText>
          <AppText variant="body" color={COLORS.textSecondary} align="center" style={styles.message}>{message}</AppText>
          <View style={[styles.actions, isNarrow && styles.actionsNarrow]}>
            <View style={styles.actionButton}>
              <Button title={confirmLabel} variant={destructive ? "danger" : "primary"} onPress={onConfirm} loading={loading} disabled={loading} />
            </View>
            <View style={styles.actionButton}>
              <Button title={cancelLabel} variant="outline" onPress={onCancel} disabled={loading} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.backdrop,
    justifyContent: "center",
    padding: SPACING.lg,
  },
  dialog: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: "center",
    gap: SPACING.sm,
  },
  dialogNarrow: { padding: SPACING.md },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.dangerSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleNeutral: { backgroundColor: COLORS.primarySoft },
  message: { maxWidth: DENSITY.readingMaxWidth },
  actions: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionsNarrow: { flexDirection: "column" },
  actionButton: { flex: 1, minWidth: 0 },
});
