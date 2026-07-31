import { ScrollView, View } from "react-native";
import SectionHeader from "@/src/components/ui/SectionHeader";
import HomeAdoptionCard from "../components/HomeAdoptionCard";
import { ADOPTION_ANIMALS } from "../constants/home";
import { styles } from "../screens/Home.styles";

type Props = { onOpenAdoption: () => void };
export default function HomeAdoptionSection({ onOpenAdoption }: Props) {
  return <View style={styles.section}>
    <SectionHeader title="حيوانات بانتظار منزل" actionLabel="عرض الكل" onActionPress={onOpenAdoption} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
      {ADOPTION_ANIMALS.map((animal) => <HomeAdoptionCard key={animal.id} {...animal} onPress={onOpenAdoption} />)}
    </ScrollView>
  </View>;
}
