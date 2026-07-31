import { Animated, Pressable, View } from "react-native";
import Button from "@/src/components/ui/Button";
import { ACTIVE_INDICATOR_COLOR, INACTIVE_INDICATOR_COLOR, ONBOARDING_ITEMS } from "../../constants/onboarding";
import { styles } from "../../screens/Onboarding.styles";

type Props = {
  currentIndex: number;
  indicatorWidths: number[];
  isChanging: boolean;
  isCompleting: boolean;
  isLastSlide: boolean;
  cardWidth: number;
  buttonHeight: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
  onSelect: (index: number) => void;
  onNext: () => void;
};

export default function OnboardingFooter({ currentIndex, indicatorWidths, isChanging, isCompleting, isLastSlide, cardWidth, buttonHeight, opacity, translateY, onSelect, onNext }: Props) {
  return (
    <Animated.View style={[styles.footer, { opacity, transform: [{ translateY }] }]}> 
      <View style={styles.indicators}>
        {ONBOARDING_ITEMS.map((item, index) => {
          const active = index === currentIndex;
          return (
            <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`الانتقال إلى الصفحة ${index + 1}`} accessibilityState={{ selected: active }} disabled={isChanging || isCompleting} onPress={() => onSelect(index)} hitSlop={10} style={({ pressed }) => [styles.indicatorTouchArea, pressed && styles.indicatorPressed]}>
              <Animated.View style={[styles.indicator, { width: indicatorWidths[index], backgroundColor: active ? ACTIVE_INDICATOR_COLOR : INACTIVE_INDICATOR_COLOR }]} />
            </Pressable>
          );
        })}
      </View>
      <Button title={isLastSlide ? "ابدأ الآن" : "التالي"} onPress={onNext} variant="custom" size="large" icon={isLastSlide ? "paw-outline" : "arrow-forward"} iconPosition="end" iconSize={21} loading={isCompleting} loadingText="جاري الانتقال..." disabled={isChanging} fullWidth backgroundColor="#FF8748" borderColor="#FF8748" borderWidth={0} textColor="#673015" radius={14} style={[styles.nextButton, { width: cardWidth, height: buttonHeight, minHeight: buttonHeight }]} textStyle={styles.nextButtonText} />
    </Animated.View>
  );
}
