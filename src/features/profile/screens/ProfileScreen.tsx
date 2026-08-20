import { StyleSheet, View } from "react-native";
import Button from "@/src/components/ui/Button";
import ActionStack from "@/src/components/ui/ActionStack";
import Screen from "@/src/components/ui/Screen";
import { LAYOUT, COLORS, SPACING } from "@/src/theme";
import ProfileHeader from "../components/ProfileHeader";
import ProfileMenuSection from "../components/ProfileMenuSection";
import ProfileStatsGrid from "../components/ProfileStatsGrid";
import { PROFILE_SECTIONS, PROFILE_STATS } from "../constants/profile";
import { useSession } from "@/src/features/session/SessionContext";
import { useRouter } from "expo-router";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useDecisionDialog } from "@/src/hooks/useDecisionDialog";
import { ROUTES } from "@/src/navigation/routes";
import GuestAccountGate from "@/src/features/session/GuestAccountGate";
import { useProfile } from "../hooks/useProfile";

export default function ProfileScreen() {
  const router = useRouter();
  const { isGuest, signOut } = useSession();
  const { showFeedback } = useFeedback();
  const decision = useDecisionDialog();
  const { profile, handleItemPress, edit } = useProfile();
  if (isGuest) return <GuestAccountGate />;

  return (
    <Screen scroll padded={false} surface="app" contentContainerStyle={styles.screen}>
      <ProfileHeader avatarUri={profile.avatarUri} name={`${profile.firstName} ${profile.lastName}`} onEdit={edit} />
      <View style={styles.content}>
        <ProfileStatsGrid stats={PROFILE_STATS} />
        {PROFILE_SECTIONS.map((section) => (
          <ProfileMenuSection key={section.title} section={section} onPress={handleItemPress} />
        ))}
        <ActionStack>
          <Button title="تسجيل الخروج" variant="ghost" onPress={() => decision.request(
            { title: "تسجيل الخروج", message: "هل أنت متأكد من تسجيل الخروج من حسابك؟", confirmLabel: "تسجيل الخروج", destructive: false, icon: "log-out-outline" },
            async () => { await signOut(); router.replace(ROUTES.welcome); },
          )} />
          <Button
            title="حذف الحساب"
            variant="outline"
            onPress={() => decision.request(
              { title: "حذف الحساب", message: "حذف الحساب إجراء نهائي. خدمة الحذف غير متاحة في النسخة المحلية الحالية ولن يتم تنفيذ أي حذف دون ربط آمن بالخادم.", confirmLabel: "فهمت", cancelLabel: "تراجع", destructive: true, icon: "trash-outline" },
              () => showFeedback({ title: "الحذف غير متاح حاليًا", message: "لن يتم حذف أي بيانات من النسخة المحلية.", tone: "info" }),
            )}
            textColor={COLORS.danger}
          />
        </ActionStack>
      </View>
      {decision.dialogProps ? <ConfirmDialog {...decision.dialogProps} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 0, paddingBottom: SPACING.xl },
  content: {
    width: "100%",
    maxWidth: LAYOUT.contentMaxWidth,
    alignSelf: "center",
    paddingHorizontal: LAYOUT.screenPadding,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },
});
