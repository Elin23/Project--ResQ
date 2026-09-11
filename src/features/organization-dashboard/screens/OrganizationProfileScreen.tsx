import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import ActionStack from "@/src/components/ui/ActionStack";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import ProfileMenuSection from "@/src/features/profile/components/ProfileMenuSection";
import { useDecisionDialog } from "@/src/hooks/useDecisionDialog";
import { COLORS, ICON_SIZES, LAYOUT, RADIUS, SPACING } from "@/src/theme";
import OrganizationIdentityCard from "../components/OrganizationIdentityCard";
import { useOrganizationProfile } from "../hooks/useOrganizationProfile";

export default function OrganizationProfileScreen() {
  const { name, logoUrl, locationLabel, verified, verifiedAt, sections, handleItemPress, openPublicProfile, logout } = useOrganizationProfile();
  const decision = useDecisionDialog();

  return (
    <Screen scroll padded={false} surface="app" contentContainerStyle={styles.screen}>
      <ScreenHeader
        title="حساب الجمعية"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="عرض الملف العام للجمعية"
            hitSlop={8}
            onPress={openPublicProfile}
            style={({ pressed }) => [styles.publicProfileButton, pressed && styles.pressed]}
          >
            <Ionicons name="eye-outline" size={ICON_SIZES.sm} color={COLORS.primaryStrong} />
            <AppText variant="label" weight="medium" color={COLORS.primaryStrong}>الملف العام</AppText>
          </Pressable>
        }
      />

      <OrganizationIdentityCard name={name} logoUrl={logoUrl} locationLabel={locationLabel} verified={verified} verifiedAt={verifiedAt} />

      <View style={styles.content}>
        {sections.map((section) => (
          <ProfileMenuSection key={section.title} section={section} onPress={handleItemPress} />
        ))}
        <ActionStack>
          <Button
            title="تسجيل الخروج"
            variant="ghost"
            onPress={() => decision.request(
              { title: "تسجيل الخروج", message: "هل أنت متأكد من تسجيل الخروج من حساب الجمعية؟", confirmLabel: "تسجيل الخروج", destructive: false, icon: "log-out-outline" },
              logout,
            )}
          />
        </ActionStack>
      </View>
      {decision.dialogProps ? <ConfirmDialog {...decision.dialogProps} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 0, paddingBottom: SPACING.xl },
  publicProfileButton: {
    minHeight: 38,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySoft,
  },
  pressed: { opacity: 0.65 },
  content: {
    width: "100%",
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: "center",
    paddingHorizontal: LAYOUT.screenPadding,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },
});
