import { forwardRef } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";

import { useFloatingNavigation } from "./FloatingNavigationContext";

/**
 * Vertical scrolling surface that cooperates with the floating navigation
 * overlay. It keeps content visually flowing behind the glass while ensuring
 * the final content can still scroll above the navbar.
 */
const ShellAwareScrollView = forwardRef<ScrollView, ScrollViewProps>(function ShellAwareScrollView(
  { contentContainerStyle, ...props },
  ref,
) {
  const { contentBottomInset } = useFloatingNavigation();

  return (
    <ScrollView
      ref={ref}
      {...props}
      contentContainerStyle={[
        contentContainerStyle,
        contentBottomInset > 0 && { paddingBottom: contentBottomInset },
      ]}
    />
  );
});

export default ShellAwareScrollView;
