import { Pressable, StyleSheet, View } from "react-native";

import { COLORS, FONT_SIZES, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: Props) {
  return (
    <View style={styles.row}>
      <AppText weight="bold" size={FONT_SIZES.title}>
        {title}
      </AppText>

      {actionLabel ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <AppText
            weight="medium"
            color={COLORS.brown}
            size={FONT_SIZES.body}
          >
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
});
