import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import SectionHeader from "@/src/components/ui/SectionHeader";
import type { AdoptionListing } from "@/src/domain";
import { repositories } from "@/src/services/domain/repositories";
import { COLORS } from "@/src/theme";
import HomeAdoptionCard from "../components/HomeAdoptionCard";
import { styles } from "../screens/Home.styles";

type Props = { onOpenAdoption: () => void; onOpenAnimal: (id: string) => void; };

export default function HomeAdoptionSection({ onOpenAdoption, onOpenAnimal }: Props) {
  const [items, setItems] = useState<AdoptionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    repositories.adoption.listAvailable()
      .then((data) => { if (active) { setItems(data.slice(0, 6)); setError(null); } })
      .catch(() => { if (active) setError("تعذر تحميل حالات التبني الآن."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (!loading && items.length === 0 && !error) return null;
  return <View style={styles.section}>
    <SectionHeader title="حيوانات بانتظار منزل" actionLabel="عرض الكل" onActionPress={onOpenAdoption} />
    {error ? <AppText variant="bodySmall" color={COLORS.textSecondary}>{error}</AppText> : null}
    {loading ? <AppText variant="bodySmall" color={COLORS.textSecondary}>جاري تحميل حالات التبني...</AppText> : null}
    {items.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
      {items.map((animal) => <HomeAdoptionCard key={animal.id} name={animal.animalName} details={[animal.breed, `${animal.age} ${animal.ageUnit === "years" ? "سنة" : "شهر"}`].filter(Boolean).join(" • ") || animal.animalType} imageUrl={animal.imageUrl} onPress={() => onOpenAnimal(animal.id)} />)}
    </ScrollView> : null}
  </View>;
}
