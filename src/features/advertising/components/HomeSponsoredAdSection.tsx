import { Linking, Pressable, StyleSheet, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import RemoteImage from "@/src/components/ui/RemoteImage";
import SectionHeader from "@/src/components/ui/SectionHeader";
import { COLORS, RADIUS, SPACING } from "@/src/theme";
import { useSponsoredAds } from "../hooks/useSponsoredAds";

export default function HomeSponsoredAdSection() {
  const { ads, loading, error } = useSponsoredAds();
  if (loading || error || ads.length === 0) return null;

  const ad = ads[0];
  const canOpen = Boolean(ad.targetUrl);

  return (
    <View style={styles.section}>
      <SectionHeader title="إعلان" />
      <Pressable
        accessibilityRole={canOpen ? "link" : undefined}
        accessibilityLabel={`إعلان من ${ad.sponsorName}: ${ad.title}`}
        disabled={!canOpen}
        onPress={() => {
          if (ad.targetUrl) void Linking.openURL(ad.targetUrl);
        }}
        style={({ pressed }) => [styles.card, pressed && canOpen ? styles.pressed : null]}
      >
        <RemoteImage uri={ad.imageUrl} style={styles.image} accessibilityLabel={ad.title} />
        <View style={styles.copy}>
          <View style={styles.badge}><AppText variant="caption" weight="bold" color={COLORS.primaryStrong}>محتوى إعلاني</AppText></View>
          <AppText variant="h3" weight="bold">{ad.title}</AppText>
          {ad.description ? <AppText variant="bodySmall" color={COLORS.textSecondary}>{ad.description}</AppText> : null}
          <AppText variant="caption" color={COLORS.textMuted}>بواسطة {ad.sponsorName}</AppText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: SPACING.sm },
  card: {
    overflow: "hidden",
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  pressed: { opacity: 0.94 },
  image: { width: "100%", height: 150 },
  copy: { gap: SPACING.xs, padding: SPACING.md },
  badge: {
    alignSelf: "flex-start",
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
});
