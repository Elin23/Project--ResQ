import { useWindowDimensions } from "react-native";

import { LAYOUT } from "@/src/theme";

type Options = {
  /** Maximum width used on tablets / large windows. */
  maxWidth: number;
  /** Minimum width before the card starts yielding more of the viewport. */
  minWidth?: number;
  /** Amount of the next card intentionally left visible in a horizontal rail. */
  sidePeek?: number;
  /** Total horizontal page padding around the rail. */
  horizontalPadding?: number;
};

/**
 * Computes a rail-card width from the live viewport rather than a device-sized
 * magic number. Keeping a small side peek makes horizontal collections obvious
 * on phones while maxWidth prevents oversized cards on tablets/web.
 */
export function useResponsiveCardWidth({
  maxWidth,
  minWidth = 220,
  sidePeek = 44,
  horizontalPadding = LAYOUT.screenPadding * 2,
}: Options) {
  const { width } = useWindowDimensions();
  const available = Math.max(0, width - horizontalPadding - sidePeek);
  return Math.min(maxWidth, Math.max(minWidth, available));
}
