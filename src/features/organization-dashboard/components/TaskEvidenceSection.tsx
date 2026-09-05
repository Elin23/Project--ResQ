import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";

type Props = { images: string[]; onCamera: () => void; onGallery: () => void };

function Action({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
    <Ionicons name={icon} size={26} color={COLORS.brownMuted} />
    <AppText size={FONT_SIZES.caption}>{label}</AppText>
  </Pressable>;
}

export default function TaskEvidenceSection({ images, onCamera, onGallery }: Props) {
  return <>
    <View style={styles.actions}><Action icon="camera-outline" label="الكاميرا" onPress={onCamera} /><Action icon="images-outline" label="المعرض" onPress={onGallery} /></View>
    {images.length ? <View style={styles.previewRow}>{images.slice(0, 4).map((uri, index) => <Image key={`${uri}-${index}`} source={{ uri }} style={styles.preview} />)}</View> : null}
  </>;
}

const styles = StyleSheet.create({
  actions: { flexDirection: "row", direction: "rtl", gap: SPACING.md },
  action: { flex: 1, minHeight: 96, borderWidth: 1.5, borderStyle: "dashed", borderColor: COLORS.rescueBorder, borderRadius: RADIUS.md, alignItems: "center", justifyContent: "center", gap: SPACING.xs, backgroundColor: COLORS.surface },
  previewRow: { flexDirection: "row", direction: "rtl", gap: SPACING.sm, marginTop: SPACING.sm },
  preview: { width: 58, height: 58, borderRadius: RADIUS.sm },
  pressed: { opacity: 0.72 },
});
