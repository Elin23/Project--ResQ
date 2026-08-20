import React, { Children, cloneElement, isValidElement, useState, type ReactElement } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { DENSITY, LAYOUT, SCREEN_SURFACES, ScreenSurface } from "@/src/theme";
import { useFloatingNavigation } from "./FloatingNavigationContext";
import ScreenHeader from "./ScreenHeader";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  keyboardAware?: boolean;
  padded?: boolean;
  horizontalPadding?: number;
  /** Prefer surface over backgroundColor for canonical product screens. */
  surface?: ScreenSurface;
  backgroundColor?: string;
  centered?: boolean;
  constrainWidth?: boolean;
  safeAreaEdges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollProps?: Omit<ScrollViewProps, "children" | "contentContainerStyle">;
  footer?: React.ReactNode;
};

export default function Screen({
  children,
  scroll = false,
  keyboardAware = true,
  padded = true,
  horizontalPadding,
  surface = "app",
  backgroundColor,
  centered = false,
  constrainWidth = true,
  safeAreaEdges = ["top", "right", "bottom", "left"],
  style,
  contentContainerStyle,
  scrollProps,
  footer,
}: Props) {
  const { contentBottomInset } = useFloatingNavigation();
  const [headerElevated, setHeaderElevated] = useState(false);
  const { width } = useWindowDimensions();
  const compact = width <= DENSITY.compactScreenBreakpoint;
  const resolvedHorizontalPadding = horizontalPadding ?? (compact ? DENSITY.compactScreenPadding : LAYOUT.screenPadding);
  const resolvedVerticalPadding = compact ? DENSITY.compactScreenVerticalPadding : DENSITY.screenVerticalPadding;
  const resolvedBackgroundColor = backgroundColor ?? SCREEN_SURFACES[surface];
  const contentPadding = padded ? resolvedHorizontalPadding : 0;
  const childArray = Children.toArray(children);
  const firstChild = childArray[0];
  const firstIsScreenHeader = isValidElement(firstChild) && firstChild.type === ScreenHeader;
  const renderedChildren = firstIsScreenHeader
    ? [cloneElement(firstChild as ReactElement<{ elevated?: boolean }>, { elevated: headerElevated }), ...childArray.slice(1)]
    : childArray;
  const externalOnScroll = scrollProps?.onScroll;
  const resolvedStickyHeaders = firstIsScreenHeader
    ? Array.from(new Set([0, ...(scrollProps?.stickyHeaderIndices ?? [])]))
    : scrollProps?.stickyHeaderIndices;
  const sharedContentStyle = [
    { paddingHorizontal: contentPadding },
    constrainWidth && styles.constrained,
    centered && styles.centeredContent,
    contentContainerStyle,
    contentBottomInset > 0 && { paddingBottom: contentBottomInset },
  ];

  const content = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      {...scrollProps}
      stickyHeaderIndices={resolvedStickyHeaders}
      scrollEventThrottle={scrollProps?.scrollEventThrottle ?? 16}
      onScroll={(event) => {
        const elevated = event.nativeEvent.contentOffset.y > 3;
        if (elevated !== headerElevated) setHeaderElevated(elevated);
        externalOnScroll?.(event);
      }}
      contentContainerStyle={[styles.scrollContent, { paddingVertical: resolvedVerticalPadding }, ...sharedContentStyle]}
    >
      {renderedChildren}
    </ScrollView>
  ) : (
    <View style={[styles.content, ...sharedContentStyle]}>{renderedChildren}</View>
  );

  return (
    <SafeAreaView edges={safeAreaEdges} style={[styles.safeArea, { backgroundColor: resolvedBackgroundColor }, style]}>
      {keyboardAware ? (
        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          {content}
          {footer}
        </KeyboardAvoidingView>
      ) : (<>
        {content}
        {footer}
      </>)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, width: "100%" },
  keyboardView: { flex: 1, width: "100%" },
  content: { flex: 1, width: "100%", direction: "rtl" },
  scrollContent: { flexGrow: 1, width: "100%", direction: "rtl" },
  constrained: { width: "100%", maxWidth: LAYOUT.contentMaxWidth, alignSelf: "center" },
  centeredContent: { justifyContent: "center" },
});
