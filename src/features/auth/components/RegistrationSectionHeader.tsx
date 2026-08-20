import { View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { styles } from "./registrationShared.styles";

type Props = { title: string; spaced?: boolean };

export function RegistrationSectionHeader({ title, spaced = false }: Props) {
  return (
    <View style={[styles.sectionHeader, spaced && styles.spacedSection]}>
      <View style={styles.sectionMarker} />
      <AppText style={styles.sectionTitle}>{title}</AppText>
    </View>
  );
}
