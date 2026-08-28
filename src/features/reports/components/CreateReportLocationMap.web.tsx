import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, SPACING } from "@/src/theme";

type CreateReportLocationMapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type CreateReportLocationMapProps = {
  region: CreateReportLocationMapRegion;
  onRegionChange: (region: CreateReportLocationMapRegion) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * نسخة الويب — بدون react-native-maps (ما بيدعم الويب، بيوقف الـ bundle).
 * نفس الـ props ونفس الـ API متل CreateReportLocationMap.tsx، Metro بياخدها
 * تلقائياً على الويب. زر "حدد الموقع الحالي" بالشاشة الأم بيضل شغال لأنه
 * ما إله علاقة بمكوّن الخريطة نفسه.
 */
export default function CreateReportLocationMap({ style }: CreateReportLocationMapProps) {
  return (
    <View style={[style, styles.placeholder]}>
      <Ionicons name="map-outline" size={40} color={COLORS.placeholder} />
      <AppText variant="caption" color={COLORS.textMuted} align="center">
        معاينة الخريطة غير متاحة على الويب
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.disabledSurface,
    paddingHorizontal: SPACING.md,
  },
});
