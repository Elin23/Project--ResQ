import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AccountStatusCard,
  CapabilitiesSection,
  ProfileCompletionCard,
  RegistrationActions,
  RegistrationBrand,
  RegistrationHero,
} from "../components/registration-success";
import { useRegistrationSuccess } from "../hooks/useRegistrationSuccess";
import { registrationSuccessStyles as styles } from "./RegistrationSuccess.styles";

export default function RegistrationSuccessScreen() {
  const { content, displayName, horizontalPadding, contentWidth, openPrimary, openSecondary } = useRegistrationSuccess();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[styles.content, { width: contentWidth }]}>
          <RegistrationBrand />
          <RegistrationHero content={content} displayName={displayName} />
          <AccountStatusCard content={content} />
          <CapabilitiesSection content={content} />
          <ProfileCompletionCard />
          <RegistrationActions content={content} onPrimary={openPrimary} onSecondary={openSecondary} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
