import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { COLORS } from "@/src/theme";

type Props = {
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  accessibilityLabel?: string;
  retryable?: boolean;
  fallbackStyle?: StyleProp<ViewStyle>;
};

/**
 * Shared image renderer for content coming from repositories / APIs.
 * Branding assets should remain bundled locally so the app identity is available offline.
 */
export default function RemoteImage({
  uri,
  style,
  contentFit = "cover",
  accessibilityLabel,
  retryable = true,
  fallbackStyle,
}: Props) {
  const [loading, setLoading] = useState(Boolean(uri));
  const [failed, setFailed] = useState(!uri);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLoading(Boolean(uri));
    setFailed(!uri);
    setAttempt(0);
  }, [uri]);

  const retry = () => {
    if (!uri) return;
    setFailed(false);
    setLoading(true);
    setAttempt((value) => value + 1);
  };

  return (
    <View style={[styles.root, style as StyleProp<ViewStyle>, fallbackStyle]}>
      {!failed && uri ? (
        <Image
          key={`${uri}-${attempt}`}
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit={contentFit}
          transition={180}
          cachePolicy="memory-disk"
          recyclingKey={uri}
          accessibilityLabel={accessibilityLabel}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setFailed(true);
          }}
        />
      ) : null}

      {loading && !failed ? (
        <View pointerEvents="none" style={styles.overlay}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : null}

      {failed ? (
        <Pressable
          accessibilityRole={retryable && uri ? "button" : undefined}
          accessibilityLabel={retryable && uri ? "إعادة تحميل الصورة" : accessibilityLabel ?? "الصورة غير متاحة"}
          disabled={!retryable || !uri}
          onPress={retry}
          style={styles.overlay}
        >
          <Ionicons name="image-outline" size={24} color={COLORS.iconMuted} />
          {retryable && uri ? <Ionicons name="refresh-outline" size={15} color={COLORS.primaryStrong} /> : null}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    backgroundColor: COLORS.surfaceMuted,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: COLORS.surfaceMuted,
  },
});
