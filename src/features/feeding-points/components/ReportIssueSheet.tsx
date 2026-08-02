import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import AppText from "../../../components/ui/AppText";
import Button from "../../../components/ui/Button";
import Chip from "../../../components/ui/Chip";
import Input from "../../../components/ui/Input";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "../../../theme/index";

import { ISSUE_REASON_META } from "../constants";
import type { FeedingPointIssueReason } from "../types";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: {
    reason: FeedingPointIssueReason;
    note?: string;
  }) => Promise<void> | void;
};

const REASONS: FeedingPointIssueReason[] = [
  "brokenContainer",
  "contaminatedWater",
  "injuredAnimal",
  "pointMissing",
  "other",
];

/** بلاغ منفصل تماماً عن تحديث حالة الأكل — سببه مشكلة بالنقطة نفسها */
export default function ReportIssueSheet({ visible, onClose, onSubmit }: Props) {
  const [reason, setReason] = useState<FeedingPointIssueReason | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setReason(null);
    setNote("");
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ reason, note: note.trim() || undefined });
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <AppText weight="bold" size={FONT_SIZES.title}>
            الإبلاغ عن مشكلة
          </AppText>
          <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>
            شو المشكلة يلي لاحظتها بهالنقطة؟
          </AppText>

          <View style={styles.reasonList}>
            {REASONS.map((key) => {
              const meta = ISSUE_REASON_META[key];
              return (
                <Chip
                  key={key}
                  label={meta.label}
                  icon={meta.icon}
                  color={COLORS.danger}
                  selected={reason === key}
                  onPress={() => setReason(key)}
                />
              );
            })}
          </View>

          <Input
            value={note}
            onChangeText={setNote}
            placeholder="تفاصيل إضافية (اختياري)"
            multiline
            containerStyle={styles.noteInput}
          />

          <Button
            title="إرسال البلاغ"
            onPress={handleSubmit}
            disabled={!reason || submitting}
            loading={submitting}
            variant="danger"
          />
          <Button title="إلغاء" onPress={handleClose} variant="text" size="small" />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopStartRadius: RADIUS.xl,
    borderTopEndRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  reasonList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  noteInput: {
    marginBottom: 0,
  },
});
