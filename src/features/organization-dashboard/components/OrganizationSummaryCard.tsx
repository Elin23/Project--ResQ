import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import Card from "@/src/components/ui/Card";
import { COLORS, RADIUS, SPACING } from "@/src/theme";

export default function OrganizationSummaryCard() {
  return (
    <Card
      disabled
      shadow={false}
      padding={SPACING.md}
      radius={RADIUS.lg}
      backgroundColor={COLORS.orgDashboardHeroBg}
      borderColor={COLORS.orgDashboardHeroBorder}
      borderWidth={1}
      style={styles.card}
    >
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name="paw-outline" size={30} color={COLORS.white} />
        </View>
        <View style={styles.textWrap}>
          <AppText variant="label" color={COLORS.brown}>إجمالي عمليات الإنقاذ</AppText>
          <AppText variant="h1" weight="bold" color={COLORS.brownDark}>146 عملية</AppText>
        </View>
      </View>
      <Ionicons name="paw" size={92} color={COLORS.orgDashboardHeroMark} style={styles.mark} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 92, overflow: "hidden" },
  content: {
    flexDirection: "row", direction: "rtl",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryFill,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: { alignItems: "stretch" },
  mark: { position: "absolute", right: 4, bottom: -22, opacity: 0.55 },
});
