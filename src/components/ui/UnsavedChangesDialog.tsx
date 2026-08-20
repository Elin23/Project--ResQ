import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { COLORS, DENSITY, ICON_SIZES, RADIUS, SPACING } from "@/src/theme";
import AppText from "./AppText";
import Button from "./Button";
import { useResponsiveLayout } from "./useResponsiveLayout";

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  saveDraftLabel?: string;
  showSaveDraft?: boolean;
  loading?: boolean;
  onContinue: () => void;
  onDiscard: () => void;
  onSaveDraft?: () => void;
};

/** Global Arabic-first route-exit decision surface for dirty forms. */
export default function UnsavedChangesDialog({
  visible,
  title = "لديك تغييرات غير محفوظة",
  message = "اختر ما تريد فعله قبل مغادرة هذه الصفحة.",
  saveDraftLabel = "حفظ كمسودة والخروج",
  showSaveDraft = false,
  loading = false,
  onContinue,
  onDiscard,
  onSaveDraft,
}: Props) {
  const { isNarrow } = useResponsiveLayout();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={loading ? undefined : onContinue}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="متابعة التعديل"
        style={styles.backdrop}
        onPress={loading ? undefined : onContinue}
      >
        <Pressable
          accessibilityRole="alert"
          style={[styles.dialog, isNarrow && styles.dialogNarrow]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="document-text-outline" size={ICON_SIZES.lg} color={COLORS.warning} />
          </View>
          <AppText variant="h3" weight="bold" align="center">{title}</AppText>
          <AppText variant="body" color={COLORS.textSecondary} align="center" style={styles.message}>{message}</AppText>

          <View style={styles.actions}>
            <Button title="متابعة التعديل" variant="primary" onPress={onContinue} disabled={loading} />
            {showSaveDraft && onSaveDraft ? (
              <Button title={saveDraftLabel} variant="outline" onPress={onSaveDraft} loading={loading} disabled={loading} />
            ) : null}
            <Button title="تجاهل التغييرات" variant="danger" onPress={onDiscard} disabled={loading} />
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
    backgroundColor: COLORS.warningSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  message: { maxWidth: DENSITY.readingMaxWidth },
  actions: { width: "100%", gap: SPACING.sm, marginTop: SPACING.sm },
});
