import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, RADIUS, SPACING } from "@/src/theme";

export type FeedingPointLocationValue = {
  latitude: number;
  longitude: number;
};

type Props = {
  value: FeedingPointLocationValue;
  onChange: (value: FeedingPointLocationValue) => void;
};

export default function FeedingPointLocationPicker({ value }: Props) {
  return (
    <View style={styles.box}>
      <AppText variant="label" weight="medium">الموقع المحدد</AppText>
      <AppText variant="bodySmall" color={COLORS.textSecondary}>
        {value.latitude.toFixed(6)}، {value.longitude.toFixed(6)}
      </AppText>
      <AppText variant="caption" color={COLORS.textMuted}>
        اختيار الموقع بالسحب متاح داخل تطبيق iOS وAndroid. يمكنك استخدام زر «موقعي الحالي» على الويب.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    minHeight: 150,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: "stretch",
    justifyContent: "center",
    gap: SPACING.sm,
  },
});
