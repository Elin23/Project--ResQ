import { View } from "react-native";
import SectionHeader from "@/src/components/ui/SectionHeader";
import SuggestedActionCard from "../components/SuggestedActionCard";
import { styles } from "../screens/Home.styles";

import { COLORS } from "@/src/theme";
type Props = { onOpenMap: () => void; onOpenOrganizations: () => void };
export default function HomeSuggestionsSection({ onOpenMap, onOpenOrganizations }: Props) {
  return <View style={styles.section}>
    <SectionHeader title="مقترح لك" />
    <View style={styles.suggestions}>
      <SuggestedActionCard title="أقرب عيادة بيطرية" icon="medkit-outline" color={COLORS.warning} iconBackgroundColor={COLORS.primarySoft} onPress={onOpenMap} />
      <SuggestedActionCard title="أقرب نقطة إطعام" icon="location-outline" color={COLORS.secondaryStrong} iconBackgroundColor={COLORS.infoSoft} onPress={onOpenMap} />
      <SuggestedActionCard title="جمعيات تطوعية قريبة" icon="people-outline" color={COLORS.secondaryStrong} iconBackgroundColor={COLORS.infoSoft} onPress={onOpenOrganizations} />
    </View>
  </View>;
}
