import { createContext, useContext, type ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CONTROL_SIZES, NAVIGATION, SPACING } from "@/src/theme";

type FloatingNavigationContextValue = {
  overlay: boolean;
  contentBottomInset: number;
  navBarBottomOffset: number;
  navBarHeight: number;
  quickActionBottomOffset: number;
};

const DEFAULT_VALUE: FloatingNavigationContextValue = {
  overlay: false,
  contentBottomInset: 0,
  navBarBottomOffset: 0,
  navBarHeight: 0,
  quickActionBottomOffset: SPACING.xl,
};

const FloatingNavigationContext = createContext<FloatingNavigationContextValue>(DEFAULT_VALUE);

export function FloatingNavigationProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const navBarBottomOffset = Math.max(insets.bottom, NAVIGATION.bottomInsetMin);
  const navBarHeight = CONTROL_SIZES.tabBar;
  const contentBottomInset = navBarHeight + navBarBottomOffset + SPACING.xl;
  const quickActionBottomOffset = navBarBottomOffset + navBarHeight + NAVIGATION.quickActionGap;

  return (
    <FloatingNavigationContext.Provider
      value={{
        overlay: true,
        contentBottomInset,
        navBarBottomOffset,
        navBarHeight,
        quickActionBottomOffset,
      }}
    >
      {children}
    </FloatingNavigationContext.Provider>
  );
}

export function useFloatingNavigation() {
  return useContext(FloatingNavigationContext);
}
