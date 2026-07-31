import { Animated, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WelcomeBackground, WelcomeHero, WelcomePanel } from "../components/welcome";
import { useWelcomeScreen } from "../hooks/useWelcomeScreen";
import { styles } from "./Welcome.styles";

export default function WelcomeScreen() {
  const model = useWelcomeScreen();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Animated.View style={[styles.screen, { opacity: model.screenOpacity }]}>
        <WelcomeBackground model={model} />
        <ScrollView contentContainerStyle={[styles.scrollContent, { minHeight: model.height }]} showsVerticalScrollIndicator={false} bounces={false}>
          <WelcomeHero model={model} />
          <WelcomePanel model={model} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
