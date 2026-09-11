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
import { resolveMediaUrl } from "@/src/services/api/mediaUrl";

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
  const resolvedUri = resolveMediaUrl(uri);
  const [loading, setLoading] = useState(Boolean(resolvedUri));
  const [failed, setFailed] = useState(!resolvedUri);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLoading(Boolean(resolvedUri));
    setFailed(!resolvedUri);
    setAttempt(0);
  }, [resolvedUri]);

  const retry = () => {
    if (!resolvedUri) return;
    setFailed(false);
    setLoading(true);
    setAttempt((value) => value + 1);
  };

  return (
    <View style={[styles.root, style as StyleProp<ViewStyle>, fallbackStyle]}>
      {!failed && resolvedUri ? (
        <Image
          key={`${resolvedUri}-${attempt}`}
          source={{ uri: resolvedUri }}
          style={StyleSheet.absoluteFill}
          contentFit={contentFit}
          transition={180}
          cachePolicy="memory-disk"
          recyclingKey={resolvedUri}
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
          accessibilityRole={retryable && resolvedUri ? "button" : undefined}
          accessibilityLabel={retryable && resolvedUri ? "إعادة تحميل الصورة" : accessibilityLabel ?? "الصورة غير متاحة"}
          disabled={!retryable || !resolvedUri}
          onPress={retry}
          style={styles.overlay}
        >
          <Ionicons name="image-outline" size={24} color={COLORS.iconMuted} />
          {retryable && resolvedUri ? <Ionicons name="refresh-outline" size={15} color={COLORS.primaryStrong} /> : null}
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
