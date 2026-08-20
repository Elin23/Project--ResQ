import { View, StyleSheet } from "react-native";

import IconButton from "@/src/components/ui/IconButton";
import ScreenHeader from "@/src/components/ui/ScreenHeader";
import { SPACING } from "@/src/theme";

type Props = {
  title: string;
  onBack: () => void;
  onShare?: () => void;
  onMore?: () => void;
};

/** Task flows use the same canonical page-header geometry as the rest of ResQ. */
export default function OrganizationTaskHeader({ title, onBack, onShare, onMore }: Props) {
  return (
    <ScreenHeader
      title={title}
      onBack={onBack}
      right={
        <View style={styles.actions}>
          {onShare ? <IconButton icon="share-social-outline" accessibilityLabel="مشاركة" onPress={onShare} /> : null}
          {onMore ? <IconButton icon="ellipsis-vertical" accessibilityLabel="المزيد" onPress={onMore} /> : null}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
  },
});
