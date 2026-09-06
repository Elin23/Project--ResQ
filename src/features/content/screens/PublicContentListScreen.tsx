import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import EmptyState from "@/src/components/ui/EmptyState";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import type { PublicContentKind } from "@/src/domain/content/content";
import { useSession } from "@/src/features/session/SessionContext";
import { goBackOrReplace } from "@/src/navigation/helpers";
import { articleDetailsRoute, articlesRoute, ROUTES, successStoriesRoute, successStoryDetailsRoute } from "@/src/navigation/routes";
import { COLORS, SPACING } from "@/src/theme";
import ContentCard from "../components/ContentCard";
import { usePublicContentList } from "../hooks/usePublicContent";

type Props = { kind: PublicContentKind };

export default function PublicContentListScreen({ kind }: Props) {
  const router = useRouter();
  const { accountKind } = useSession();
  const { items, loading, error, reload } = usePublicContentList(kind);
  const isArticle = kind === "article";
  const title = isArticle ? "المقالات" : "قصص النجاح";
  const subtitle = isArticle ? "معلومات ونصائح تساعدك على رعاية الحيوانات بصورة أفضل" : "قصص حقيقية من جهود الإنقاذ والرعاية والتبني";
  const fallback = accountKind === "organization" ? ROUTES.organizationDashboard : ROUTES.userHome;

  return (
    <Screen scroll safeAreaEdges={["top", "left", "right", "bottom"]}>
      <ScreenHeader title={title} subtitle={subtitle} onBack={() => goBackOrReplace(router, fallback)} />
      <View style={styles.content}>
        <View style={styles.switchRow}>
          <Button title="المقالات" size="small" fullWidth={false} variant={isArticle ? "primary" : "outline"} onPress={() => router.replace(articlesRoute(accountKind))} />
          <Button title="قصص النجاح" size="small" fullWidth={false} variant={!isArticle ? "primary" : "outline"} onPress={() => router.replace(successStoriesRoute(accountKind))} />
        </View>

        {loading ? <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} /> : null}
        {!loading && error ? <EmptyState title="تعذر تحميل المحتوى" description={error} icon="cloud-offline-outline" actionTitle="إعادة المحاولة" onActionPress={() => void reload()} /> : null}
        {!loading && !error && items.length === 0 ? <EmptyState title="لا يوجد محتوى حاليًا" description="سيظهر المحتوى المنشور هنا عند توفره." icon="document-text-outline" /> : null}
        {!loading && !error ? items.map((item) => (
          <ContentCard key={item.id} item={item} onPress={() => router.push(isArticle ? articleDetailsRoute(item.id, accountKind) : successStoryDetailsRoute(item.id, accountKind))} />
        )) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: SPACING.md, paddingBottom: SPACING.xl },
  switchRow: { flexDirection: "row", direction: "rtl", gap: SPACING.sm, alignItems: "center" },
  loader: { marginVertical: SPACING.xxl },
});
