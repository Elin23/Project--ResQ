import { View } from "react-native";
import SectionHeader from "@/src/components/ui/SectionHeader";
import SuggestedActionCard from "../components/SuggestedActionCard";
import { styles } from "../screens/Home.styles";

type Props = { onOpenMap: () => void; onOpenOrganizations: () => void };
export default function HomeSuggestionsSection({ onOpenMap, onOpenOrganizations }: Props) {
  return <View style={styles.section}>
    <SectionHeader title="مقترح لك" />
    <View style={styles.suggestions}>
      <SuggestedActionCard title="أقرب عيادة بيطرية" icon="medkit-outline" color="#B24300" iconBackgroundColor="#FFE8DC" onPress={onOpenMap} />
      <SuggestedActionCard title="أقرب نقطة إطعام" icon="location-outline" color="#147D39" iconBackgroundColor="#D5F7DB" onPress={onOpenMap} />
      <SuggestedActionCard title="جمعيات تطوعية قريبة" icon="people-outline" color="#0580B3" iconBackgroundColor="#DDF4FF" onPress={onOpenOrganizations} />
    </View>
  </View>;
}
