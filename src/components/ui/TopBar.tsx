import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, SPACING } from "@/src/theme";
import AppText from "./AppText";

type Props = {
  onNotificationsPress?: () => void;
  onSearchPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

function IconButton({ icon, onPress }: IconButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={!onPress}
      hitSlop={8}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.iconButton,
        hovered && onPress && styles.iconHovered,
        pressed && onPress && styles.iconPressed,
        !onPress && styles.iconDisabled,
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color={hovered && onPress ? COLORS.primary : COLORS.text}
      />
    </Pressable>
  );
}

export default function TopBar({
  onNotificationsPress,
  onSearchPress,
  style,
}: Props) {
  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, style]}>
      <View style={styles.container}>
        <View style={styles.logo}>
          <AppText weight="bold" style={styles.logoText}>
            Res
            <AppText weight="bold" style={[styles.logoText, styles.logoAccent]}>
              Q
            </AppText>
          </AppText>

          <Ionicons name="paw" size={24} color={COLORS.black} />
        </View>

        <View style={styles.iconGroup}>
          <IconButton icon="search-outline" onPress={onSearchPress} />

          <IconButton
            icon="notifications-off-outline"
            onPress={onNotificationsPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    width: "100%",
    backgroundColor: COLORS.background,
  },
  container: {
    minHeight: 72,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  logoText: {
    fontSize: 28,
    lineHeight: 44,
  },
  logoAccent: {
    color: COLORS.primary,
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  iconHovered: {
    backgroundColor: COLORS.primary + "14",
    transform: [{ translateY: -2 }],
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  iconPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.92 }],
  },
  iconDisabled: {
    opacity: 0.45,
  },
});
