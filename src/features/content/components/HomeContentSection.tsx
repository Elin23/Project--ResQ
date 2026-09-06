import { ScrollView, StyleSheet, View } from "react-native";
import SectionHeader from "@/src/components/ui/SectionHeader";
import type { PublicContentKind } from "@/src/domain/content/content";
import { SPACING } from "@/src/theme";
import ContentCard from "./ContentCard";
import { usePublicContentList } from "../hooks/usePublicContent";

type Props = {
  kind: PublicContentKind;
  onViewAll: () => void;
  onOpen: (id: string) => void;
};

export default function HomeContentSection({ kind, onViewAll, onOpen }: Props) {
  const { items, loading, error } = usePublicContentList(kind);
  if (loading || error || items.length === 0) return null;
  const title = kind === "article" ? "مقالات ونصائح" : "قصص نجاح";

  return (
    <View style={styles.section}>
      <SectionHeader title={title} actionLabel="عرض الكل" onActionPress={onViewAll} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.slice(0, 3).map((item) => <ContentCard key={item.id} item={item} compact onPress={() => onOpen(item.id)} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: SPACING.sm },
  row: { gap: SPACING.md, paddingBottom: SPACING.xs },
});
