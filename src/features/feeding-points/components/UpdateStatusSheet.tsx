import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";

import AppText from "../../../components/ui/AppText";
import Button from "../../../components/ui/Button";
import Chip from "../../../components/ui/Chip";
import Input from "../../../components/ui/Input";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "../../../theme/index";

import { STATUS_META } from "../constants";
import type { ReportedStatus } from "../types";

type Props = {
  visible: boolean;
  initialStatus?: ReportedStatus;
  onClose: () => void;
  onSubmit: (input: {
    reportedStatus: ReportedStatus;
    photoUri: string;
    note?: string;
  }) => Promise<void> | void;
};

const STATUS_OPTIONS: ReportedStatus[] = ["stocked", "needsFood"];

/** رفع صورة إجباري — التحديث بيضل "بانتظار المراجعة" لحد ما الإدارة توثقه */
export default function UpdateStatusSheet({
  visible,
  initialStatus = "stocked",
  onClose,
  onSubmit,
}: Props) {
  const [status, setStatus] = useState<ReportedStatus>(initialStatus);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setStatus(initialStatus);
    setPhotoUri(null);
    setNote("");
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (result.canceled) return;
    const uri = result.assets[0]?.uri;
    if (uri) setPhotoUri(uri);
  };

  const handleSubmit = async () => {
    if (!photoUri || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ reportedStatus: status, photoUri, note: note.trim() || undefined });
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
            تسجيل تغذية
          </AppText>
          <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>
            اختر حالة الأكل بالنقطة هلق وأرفق صورة — التحديث بيضل بانتظار المراجعة
            لحد ما الإدارة توثّقه.
          </AppText>

          <View style={styles.chipRow}>
            {STATUS_OPTIONS.map((option) => {
              const meta = STATUS_META[option];
              return (
                <Chip
                  key={option}
                  label={meta.label}
                  icon={meta.icon}
                  color={meta.color}
                  selected={status === option}
                  onPress={() => setStatus(option)}
                />
              );
            })}
          </View>

          <Pressable
            onPress={pickPhoto}
            style={[styles.photoBox, photoUri && styles.photoBoxFilled]}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={26} color={COLORS.textSecondary} />
                <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>
                  أضف صورة (إجباري)
                </AppText>
              </>
            )}
          </Pressable>

          <Input
            value={note}
            onChangeText={setNote}
            placeholder="ملاحظة (اختياري)"
            multiline
            containerStyle={styles.noteInput}
          />

          <Button
            title="إرسال التحديث"
            onPress={handleSubmit}
            disabled={!photoUri || submitting}
            loading={submitting}
            backgroundColor={COLORS.textgreen}
            borderColor={COLORS.textgreen}
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
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  photoBox: {
    width: "100%",
    height: 140,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    backgroundColor: COLORS.lightgray,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    overflow: "hidden",
  },
  photoBoxFilled: {
    borderStyle: "solid",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
  },
  noteInput: {
    marginBottom: 0,
  },
});
