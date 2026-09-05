import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_700Bold,
  useFonts,
} from "@expo-google-fonts/ibm-plex-sans-arabic";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { I18nManager } from "react-native";
import "react-native-reanimated";

import { COLORS, COLOR_SCHEME } from "@/src/theme";
import { SessionProvider } from "@/src/features/session/SessionContext";
import { FavoritesProvider } from "@/src/features/favorites";
import { FeedbackProvider, UnsavedChangesDecisionProvider } from "@/src/components/ui";

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
// COLORS.surface, that gray showed through the rounded-corner cutout as a
// sharp-edged patch. Overriding it to match the app's palette makes that
// area blend seamlessly instead.
const NavigationBase = COLOR_SCHEME === "dark" ? DarkTheme : DefaultTheme;
const AppNavigationTheme = {
  ...NavigationBase,
  colors: {
    ...NavigationBase.colors,
    background: COLORS.background,
    card: COLORS.surface,
    border: COLORS.border,
    text: COLORS.text,
  },
};

// Paints the window behind React's root view. Without it the native canvas stays
// white, which flashes between screens and around the safe areas in the dark scheme.
SystemUI.setBackgroundColorAsync(COLORS.background).catch(() => {
  // Not supported on every platform; the JS-side background still covers the app.
});
export default function RootLayout() {
  console.log("isRTL:", I18nManager.isRTL);
  const [fontsLoaded] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    SplashScreen.hideAsync().catch(() => {
      // Safe fallback when the native splash screen has already been hidden.
    });
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SessionProvider>
    <FavoritesProvider>
    <FeedbackProvider>
    <UnsavedChangesDecisionProvider>
    <ThemeProvider value={AppNavigationTheme}>
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
          name="(user)"
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

      <StatusBar style={COLOR_SCHEME === "dark" ? "light" : "dark"} />
    </ThemeProvider>
    </UnsavedChangesDecisionProvider>
    </FeedbackProvider>
    </FavoritesProvider>
    </SessionProvider>
  );
}
