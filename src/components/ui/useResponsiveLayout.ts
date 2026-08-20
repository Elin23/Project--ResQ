import { useWindowDimensions } from "react-native";

import { DENSITY } from "@/src/theme";

/**
 * Shared responsive contract for narrow Android phones and compact layouts.
 * Keep feature components on the same breakpoints instead of inventing local widths.
 */
export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const isNarrow = width <= DENSITY.narrowScreenBreakpoint;
  const isCompact = width <= DENSITY.compactScreenBreakpoint;
  const isShort = height <= DENSITY.shortScreenBreakpoint;

  return { width, height, isNarrow, isCompact, isShort };
}
