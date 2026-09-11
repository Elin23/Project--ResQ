import { ScrollView, StyleSheet, View } from "react-native";
import SectionHeader from "@/src/components/ui/SectionHeader";
import type { PublicContentKind } from "@/src/domain/content/content";
import AppText from "@/src/components/ui/AppText";
import { COLORS, SPACING } from "@/src/theme";
import ContentCard from "./ContentCard";
import { usePublicContentList } from "../hooks/usePublicContent";

type Props = {
  kind: PublicContentKind;
  onViewAll: () => void;
  onOpen: (id: string) => void;
};

export default function HomeContentSection({ kind, onViewAll, onOpen }: Props) {
  const { items, loading, error } = usePublicContentList(kind);
  const title = kind === "article" ? "مقالات ونصائح" : "قصص نجاح";
  const emptyMessage = kind === "article" ? "لا توجد مقالات منشورة حاليًا." : "لا توجد قصص نجاح منشورة حاليًا.";

  return (
    <View style={styles.section}>
      <SectionHeader title={title} actionLabel="عرض الكل" onActionPress={onViewAll} />
      {loading ? null : error ? (
        <AppText variant="bodySmall" color={COLORS.textSecondary}>{error}</AppText>
      ) : items.length === 0 ? (
        <AppText variant="bodySmall" color={COLORS.textSecondary}>{emptyMessage}</AppText>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {items.slice(0, 3).map((item) => <ContentCard key={item.id} item={item} compact onPress={() => onOpen(item.id)} />)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: SPACING.sm },
  row: { gap: SPACING.md, paddingBottom: SPACING.xs },
});
