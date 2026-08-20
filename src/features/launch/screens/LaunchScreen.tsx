import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LaunchBackground, LaunchContent, LaunchLoader } from "../components";
import { useLaunchScreen } from "../hooks/useLaunchScreen";
import { styles } from "./Launch.styles";

export default function SplashScreen() {
  const model = useLaunchScreen();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Animated.View style={[styles.screen, { opacity: model.screenOpacity }]}>
        <LaunchBackground model={model} />
        <LaunchContent model={model} />
        <LaunchLoader model={model} />
      </Animated.View>
    </SafeAreaView>
  );
}
