import { Ionicons } from "@expo/vector-icons";
import { Animated, Image, View } from "react-native";
import AppText from "@/src/components/ui/AppText";
import type { OnboardingItem } from "../../constants/onboarding";
import { styles } from "../../screens/Onboarding.styles";

type Props = {
  item: OnboardingItem;
  index: number;
  cardWidth: number;
  cardHeight: number;
  isTablet: boolean;
  isCompact: boolean;
  brandSize: number;
  titleSize: number;
  descriptionSize: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
  scale: Animated.Value;
  imageFloat: Animated.Value;
};

export default function OnboardingSlide({ item, index, cardWidth, cardHeight, isTablet, isCompact, brandSize, titleSize, descriptionSize, opacity, translateY, scale, imageFloat }: Props) {
  return (
    <Animated.View style={[styles.mainContent, { opacity, transform: [{ translateY }, { scale }] }]}> 
      <Animated.View style={[styles.imageCard, { width: cardWidth, height: cardHeight, borderRadius: isTablet ? 34 : 26, transform: [{ translateY: imageFloat }] }]}> 
        <View style={styles.imageCardHighlight} />
        <Image source={item.image} resizeMode="cover" style={styles.image} />
      </Animated.View>
      <View style={[styles.textSection, { width: cardWidth, marginTop: isCompact ? 18 : 28 }]}> 
        {index === 0 ? (
          <View style={styles.firstTitleRow}>
            <View style={styles.brandRow}>
              <Ionicons name="paw" size={brandSize * 0.68} color="#242424" />
              <View style={styles.brandNameRow}>
                <AppText style={[styles.brandAccent, { fontSize: brandSize, lineHeight: brandSize * 1.25 }]}>Q</AppText>
                <AppText style={[styles.brandText, { fontSize: brandSize, lineHeight: brandSize * 1.25 }]}>Res</AppText>
              </View>
            </View>
            <AppText style={[styles.firstTitle, { fontSize: titleSize, lineHeight: titleSize * 1.4 }]}>ابدأ رحلتك مع</AppText>
          </View>
        ) : (
          <AppText style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.45 }]}>{item.title}</AppText>
        )}
        <AppText style={[styles.description, { fontSize: descriptionSize, lineHeight: descriptionSize * 1.8, marginTop: isCompact ? 8 : 12 }]}>{item.description}</AppText>
      </View>
    </Animated.View>
  );
}
