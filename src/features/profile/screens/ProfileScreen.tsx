import { StyleSheet, View } from "react-native";
import Button from "@/src/components/ui/Button";
import ActionStack from "@/src/components/ui/ActionStack";
import Screen from "@/src/components/ui/Screen";
import { LAYOUT, COLORS, SPACING } from "@/src/theme";
import ProfileHeader from "../components/ProfileHeader";
import ProfileMenuSection from "../components/ProfileMenuSection";
import { PROFILE_SECTIONS } from "../constants/profile";
import { useSession } from "@/src/features/session/SessionContext";
import { useRouter } from "expo-router";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import { useFeedback } from "@/src/components/ui/FeedbackProvider";
import { useDecisionDialog } from "@/src/hooks/useDecisionDialog";
import { ROUTES } from "@/src/navigation/routes";
import GuestAccountGate from "@/src/features/session/GuestAccountGate";
import LoadingState from "@/src/components/ui/LoadingState";
import ErrorState from "@/src/components/ui/ErrorState";
import { useFavorites } from "@/src/features/favorites/FavoritesContext";
import { useProfile } from "../hooks/useProfile";

export default function ProfileScreen() {
  const router = useRouter();
  const { isGuest, signOut, deleteAccount } = useSession();
  const { showFeedback } = useFeedback();
  const decision = useDecisionDialog();
  const { clearFavorites } = useFavorites();
  const { profile, loading, error, reload, handleItemPress, edit } = useProfile();
  if (isGuest) return <GuestAccountGate />;
  if (loading) return <Screen surface="app"><LoadingState label="جاري تحميل ملفك الشخصي..." /></Screen>;
  if (error) return <Screen surface="app"><ErrorState description={error} onRetry={() => { void reload(); }} /></Screen>;

  return (
    <Screen scroll padded={false} surface="app" contentContainerStyle={styles.screen}>
      <ProfileHeader avatarUri={profile.avatarUri} name={`${profile.firstName} ${profile.lastName}`} onEdit={edit} />
      <View style={styles.content}>
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
              { title: "حذف الحساب", message: "سيتم تعطيل حسابك على الخادم وتسجيل خروجك من التطبيق. هل تريد المتابعة؟", confirmLabel: "حذف نهائيًا", cancelLabel: "تراجع", destructive: true, icon: "trash-outline" },
              async () => {
                try {
                  await deleteAccount();
                  clearFavorites();
                  showFeedback({ title: "تم تعطيل الحساب", message: "تم تعطيل الحساب وتسجيل خروجك بنجاح.", tone: "success" });
                  router.replace(ROUTES.welcome);
                } catch (error) {
                  showFeedback({ title: "تعذر حذف الحساب", message: error instanceof Error ? error.message : "حاول مرة أخرى.", tone: "error" });
                }
              },
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
