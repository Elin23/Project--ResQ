import { Image, StyleSheet, View } from "react-native";

import { COLORS, FONT_SIZES, RADIUS, SPACING } from "@/src/theme";
import AppText from "@/src/components/ui/AppText";

type Props = {
  name: string;
  avatarUrl?: string;
};

export default function UserWelcomeHeader({ name, avatarUrl }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <AppText
              weight="bold"
              size={FONT_SIZES.title}
              color={COLORS.white}
              align="center"
            >
              {name.trim().charAt(0)}
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <AppText size={FONT_SIZES.label} color={COLORS.textSecondary}>
          مرحباً،
        </AppText>

        <View style={styles.nameRow}>
          <AppText weight="bold" size={FONT_SIZES.title}>
            {name}
          </AppText>

          <AppText size={FONT_SIZES.title}>👋</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    flexShrink: 0,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: RADIUS.full,
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.brown,
  },
  content: {
    flex: 1,
    alignItems: "flex-start",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
});
