import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "../../../components/ui/AppText";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "../../../theme/index";

import type { FeedingPointSummary } from "../types";
type Props = {
  point: FeedingPointSummary;
  distanceLabel: string | null;
  onPress: () => void;
};

/** أقرب نقطة وصلها بلاغ "تحتاج تعبئة" — تنبيه عاجل فوق الخريطة. ألوان وقياسات مطابقة للفيغما */
export default function UrgentRefillCard({ point, distanceLabel, onPress }: Props) {
  return (
    <Card
      disabled
      backgroundColor={COLORS.primarySoft}
      borderColor="rgba(255,140,66,0.3)"
      borderWidth={2}
      radius={RADIUS.md}
      shadow={false}
      style={styles.card}
    >
      {/* دائرة زخرفية 96×96 نصفها خارج الكارت — FF8C42 بشفافية 10% */}
      <View style={styles.decorCircle} pointerEvents="none" />

      <View style={styles.topRow}>
        <View style={styles.badge}>
          <AppText size={FONT_SIZES.caption} color={COLORS.white} weight="medium">
            هام جداً
          </AppText>
        </View>

        <MaterialCommunityIcons name="exclamation-thick" size={15} color={COLORS.urgent} />
      </View>

      <AppText weight="bold" size={FONT_SIZES.body} color={COLORS.brownDark}>
        أقرب نقطة تحتاج إلى إعادة تعبئة
      </AppText>

      <AppText size={FONT_SIZES.label} color={COLORS.textSecondary} numberOfLines={2}>
        {point.address}
        {distanceLabel ? ` - ${distanceLabel}` : ""}
      </AppText>

      <View style={styles.foodRow}>
        <Ionicons name="restaurant-outline" size={18} color={COLORS.urgent} />
        <AppText size={FONT_SIZES.label} color={COLORS.urgent} weight="medium">
          مستوى الطعام: فارغ
        </AppText>
      </View>

      <Button
        title="المساعدة الآن"
        onPress={onPress}
        variant="custom"
        size="medium"
        icon="hand-left-outline"
        iconPosition="start"
        fullWidth
        backgroundColor={COLORS.primaryFill}
        borderColor={COLORS.primary}
        textColor={COLORS.white}
        radius={RADIUS.md}
        style={styles.button}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
    gap: SPACING.xs,
    paddingHorizontal: 18,
    paddingVertical: SPACING.md,
    overflow: "hidden",
  },
  decorCircle: {
  position: "absolute",
  top: -46,
  end: -46,          // مع forceRTL = يسار فيزيائي
  width: 96,
  height: 96,
  borderRadius: RADIUS["2xl"],
  backgroundColor: "rgba(255,140,66,0.1)",
},
  topRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  badge: {
    backgroundColor: COLORS.urgent,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  foodRow: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.xs,
    height: 40,
    paddingTop: SPACING.xs,
  },
  button: {
    alignSelf: "stretch",
    marginTop: SPACING.sm,
    height: 48,
  },
});
