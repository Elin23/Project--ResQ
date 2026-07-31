import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

import { COLORS, SPACING } from "@/src/theme";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  keyboardAware?: boolean;
  padded?: boolean;
  horizontalPadding?: number;
  backgroundColor?: string;
  centered?: boolean;
  safeAreaEdges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollProps?: Omit<ScrollViewProps, "children" | "contentContainerStyle">;
};

export default function Screen({
  children,
  scroll = false,
  keyboardAware = true,
  padded = true,
  horizontalPadding = SPACING.md,
  backgroundColor = COLORS.background,
  centered = false,
  safeAreaEdges = ["top", "right", "bottom", "left"],
  style,
  contentContainerStyle,
  scrollProps,
}: Props) {
  const contentPadding = padded ? horizontalPadding : 0;

  const content = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      {...scrollProps}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingHorizontal: contentPadding,
        },
        centered && styles.centeredContent,
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        {
          paddingHorizontal: contentPadding,
        },
        centered && styles.centeredContent,
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={[
        styles.safeArea,
        {
          backgroundColor,
        },
        style,
      ]}
    >
      {keyboardAware ? (
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
  },
  keyboardView: {
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
    paddingVertical: SPACING.md,
  },
  centeredContent: {
    justifyContent: "center",
  },
});
