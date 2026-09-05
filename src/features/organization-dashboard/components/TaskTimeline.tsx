import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import type { OrganizationTaskStage, OrganizationTaskTimelineItem } from "../types/organizationTask";

const ORDER: OrganizationTaskStage[] = ["accepted", "on-route", "arrived", "rescued"];

type Props = { items: OrganizationTaskTimelineItem[]; stage: OrganizationTaskStage };

export default function TaskTimeline({ items, stage }: Props) {
  const current = ORDER.indexOf(stage);
  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <View key={item.id} style={styles.row}>
            <View style={styles.textWrap}>
              <AppText weight={active ? "bold" : "regular"} color={active ? COLORS.warning : COLORS.text}>{item.label}</AppText>
              {item.time ? <AppText size={FONT_SIZES.caption} color={COLORS.textSecondary}>{item.time}</AppText> : null}
            </View>
            <View style={styles.rail}>
              <View style={[styles.dot, done && styles.doneDot, active && styles.activeDot]}>
                {done ? <Ionicons name="checkmark" size={14} color={COLORS.white} /> : active ? <View style={styles.innerDot} /> : null}
              </View>
              {index < items.length - 1 ? <View style={[styles.line, done && styles.doneLine]} /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 0 },
  row: { minHeight: 66, flexDirection: "row", direction: "rtl", justifyContent: "flex-end", alignItems: "flex-start" },
  textWrap: { flex: 1, alignItems: "stretch", paddingTop: 2, paddingStart: SPACING.md },
  rail: { width: 32, alignItems: "center" },
  dot: { width: 24, height: 24, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.rescueBorder, backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center" },
  doneDot: { borderColor: COLORS.successDark, backgroundColor: COLORS.successDarkFill },
  activeDot: { width: 30, height: 30, borderColor: COLORS.peach, backgroundColor: COLORS.rescueSoft },
  innerDot: { width: 12, height: 12, borderRadius: RADIUS.full, backgroundColor: COLORS.primaryFill },
  line: { width: 2, flex: 1, minHeight: 42, backgroundColor: COLORS.rescueBorder },
  doneLine: { backgroundColor: COLORS.successDarkFill },
});
