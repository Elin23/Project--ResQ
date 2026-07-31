import { View } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { styles } from "./registrationShared.styles";

type Props = { title: string; currentStep: number; totalSteps: number };

export function RegistrationProgress({ title, currentStep, totalSteps }: Props) {
  const progress = `${Math.min(100, Math.max(0, (currentStep / totalSteps) * 100))}%` as `${number}%`;
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressLabels}>
        <AppText style={styles.progressTitle}>{title}</AppText>
        <AppText style={styles.stepText}>الخطوة {currentStep} من {totalSteps}</AppText>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progress }]} />
      </View>
    </View>
  );
}
