import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, SPACING } from "@/src/theme";

type ReportLocationMapProps = {
  latitude: number;
  longitude: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * نسخة الويب — بدون react-native-maps (ما بيدعم الويب، بيوقف الـ bundle).
 * نفس الـ props ونفس الـ API متل ReportLocationMap.tsx، Metro بياخدها
 * تلقائياً على الويب. معاينة الخريطة هون شكل ثابت فقط.
 */
export default function ReportLocationMap({ style }: ReportLocationMapProps) {
  return (
    <View style={[style, styles.placeholder]}>
      <Ionicons name="map-outline" size={40} color={COLORS.placeholder} />
      <AppText variant="caption" color={COLORS.textMuted}>معاينة الخريطة غير متاحة على الويب</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.disabledSurface,
  },
});
