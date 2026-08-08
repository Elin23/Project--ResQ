import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, SPACING } from "@/src/theme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  onNotificationsPress?: () => void;
  onSearchPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function TopBar({ onNotificationsPress, onSearchPress, style }: Props) {
  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, style]}>
      <View style={styles.container}>
        <View style={styles.logo} accessibilityRole="header" accessibilityLabel="ResQ">
          <AppText weight="bold" style={styles.logoText}>
            Res<AppText weight="bold" style={[styles.logoText, styles.logoAccent]}>Q</AppText>
          </AppText>
          <Ionicons name="paw" size={24} color={COLORS.black} />
        </View>

        <View style={styles.iconGroup}>
          <IconButton icon="search-outline" onPress={onSearchPress ?? (() => undefined)} accessibilityLabel="فتح البحث" disabled={!onSearchPress} size={22} style={styles.iconButton} />
          <IconButton icon="notifications-off-outline" onPress={onNotificationsPress ?? (() => undefined)} accessibilityLabel="فتح الإشعارات" disabled={!onNotificationsPress} size={22} style={styles.iconButton} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { width: "100%", backgroundColor: COLORS.background },
  container: { minHeight: 72, paddingHorizontal: SPACING.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
  logoText: { fontSize: 28, lineHeight: 44 },
  logoAccent: { color: COLORS.primary },
  iconGroup: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  iconButton: { width: 40, height: 40, borderRadius: 20 },
});
