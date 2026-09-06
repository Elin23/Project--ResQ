import { ActivityIndicator, Share, StyleSheet, View } from "react-native";
import RemoteImage from "@/src/components/ui/RemoteImage";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppText from "@/src/components/ui/AppText";
import EmptyState from "@/src/components/ui/EmptyState";
import IconButton from "@/src/components/ui/IconButton";
import Screen from "@/src/components/ui/Screen";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import type { PublicContentKind } from "@/src/domain/content/content";
import { useSession } from "@/src/features/session/SessionContext";
import { goBackOrReplace } from "@/src/navigation/helpers";
import { articlesRoute, successStoriesRoute } from "@/src/navigation/routes";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { usePublicContentDetails } from "../hooks/usePublicContent";

type Props = { kind: PublicContentKind };

export default function PublicContentDetailsScreen({ kind }: Props) {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { accountKind } = useSession();
  const { item, loading, error, reload } = usePublicContentDetails(kind, id);
  const listRoute = kind === "article" ? articlesRoute(accountKind) : successStoriesRoute(accountKind);

  const share = async () => {
    if (!item) return;
    await Share.share({ title: item.title, message: `${item.title}\n\n${item.excerpt}` });
  };

  return (
    <Screen scroll safeAreaEdges={["top", "left", "right", "bottom"]}>
      <ScreenHeader
        title={kind === "article" ? "مقال" : "قصة نجاح"}
        onBack={() => goBackOrReplace(router, listRoute)}
        right={<IconButton icon="share-social-outline" accessibilityLabel="مشاركة المحتوى" onPress={() => void share()} />}
      />

      {loading ? <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} /> : null}
      {!loading && error ? <EmptyState title="تعذر تحميل المحتوى" description={error} icon="cloud-offline-outline" actionTitle="إعادة المحاولة" onActionPress={() => void reload()} /> : null}
      {!loading && !error && !item ? <EmptyState title="المحتوى غير موجود" description="قد يكون هذا المحتوى غير متاح أو تمت إزالته." icon="document-text-outline" actionTitle="العودة" onActionPress={() => router.replace(listRoute)} /> : null}

      {item ? (
        <View style={styles.content}>
          <RemoteImage uri={item.coverImageUrl} style={styles.hero} accessibilityLabel={item.title} />
          <View style={styles.metaRow}>
            <AppText variant="caption" weight="bold" color={COLORS.primaryStrong}>{item.category}</AppText>
            <AppText variant="caption" color={COLORS.textMuted}>{item.readingMinutes} دقائق قراءة</AppText>
          </View>
          <AppText variant="h1" weight="bold">{item.title}</AppText>
          <AppText variant="body" color={COLORS.textSecondary}>{item.excerpt}</AppText>
          <View style={styles.divider} />
          {item.body.map((paragraph, index) => (
            <AppText key={`${item.id}-${index}`} variant="body" style={styles.paragraph}>{paragraph}</AppText>
          ))}
          <View style={styles.footerMeta}>
            <AppText variant="caption" color={COLORS.textMuted}>{item.authorName ?? "ResQ"}</AppText>
            <AppText variant="caption" color={COLORS.textMuted}>{new Date(item.publishedAt).toLocaleDateString("ar")}</AppText>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: { marginVertical: SPACING.xxl },
  content: { gap: SPACING.md, paddingBottom: SPACING.xxl },
  hero: { width: "100%", height: 245, borderRadius: RADIUS.xl, backgroundColor: COLORS.surfaceMuted },
  metaRow: { flexDirection: "row", direction: "rtl", alignItems: "center", justifyContent: "space-between", gap: SPACING.sm },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: COLORS.divider },
  paragraph: { lineHeight: 28 },
  footerMeta: { flexDirection: "row", direction: "rtl", justifyContent: "space-between", gap: SPACING.md, marginTop: SPACING.sm },
});
