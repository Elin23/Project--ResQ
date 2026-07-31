import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_700Bold,
  useFonts,
} from "@expo-google-fonts/ibm-plex-sans-arabic";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { I18nManager } from "react-native";
import "react-native-reanimated";

import { COLORS } from "@/src/theme";

SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash screen may already be controlled by Expo during fast refresh.
});

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export const unstable_settings = {
  initialRouteName: "index",
};

// React Navigation's stock themes default colors.background to a light gray
// (rgb(242,242,242)), which is what renders behind every screen — including
// behind the tab bar's rounded top corners. Since the tab bar itself is
// COLORS.white, that gray showed through the rounded-corner cutout as a
// sharp-edged patch. Overriding it to match the app's palette makes that
// area blend seamlessly instead.
const LightNavigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: COLORS.background, card: COLORS.white },
};
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  SplashScreen.hideAsync().catch(() => {
    // Safe fallback when the native splash screen has already been hidden.
  });

  return (
    <ThemeProvider value={LightNavigationTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen
          name="welcome"
          options={{
            animation: "fade",
          }}
        />

        <Stack.Screen
          name="(tabs)"
          options={{
            animation: "fade",
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "نافذة",
          }}
        />
      </Stack>

      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
