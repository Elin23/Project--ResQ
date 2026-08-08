import { ScrollView, StyleSheet, View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { COLORS, FONT_SIZES, SPACING } from "@/src/theme";
import type { EmergencyRescueCase } from "../types/organizationDashboard";
import EmergencyCaseCard from "./EmergencyCaseCard";

type Props = {
  items: EmergencyRescueCase[];
  acceptedIds: string[];
  onOpenCase: (id: string) => void;
  onAcceptCase: (id: string) => void;
};

export default function EmergencyCasesSection({ items, acceptedIds, onOpenCase, onAcceptCase }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText size={FONT_SIZES.label} color={COLORS.brown}>عرض الكل</AppText>
        <AppText size={FONT_SIZES.headline} weight="medium">حالات طارئة بالقرب منك</AppText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {items.map((item) => (
          <EmergencyCaseCard
            key={item.id}
            item={item}
            accepted={acceptedIds.includes(item.id)}
            onOpen={() => onOpenCase(item.id)}
            onAccept={() => onAcceptCase(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: SPACING.lg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  list: { gap: SPACING.md, paddingHorizontal: 1 },
});
