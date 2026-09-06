import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ImageStyle, type StyleProp, type ViewStyle } from "react-native";

import RemoteImage from "./RemoteImage";

type Props = PropsWithChildren<{
  uri?: string | null;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
}>;

export default function RemoteImageBackground({ uri, style, imageStyle, accessibilityLabel, children }: Props) {
  return (
    <View style={[styles.root, style]}>
      <RemoteImage
        uri={uri}
        style={[StyleSheet.absoluteFillObject, imageStyle]}
        accessibilityLabel={accessibilityLabel}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { overflow: "hidden" },
});
