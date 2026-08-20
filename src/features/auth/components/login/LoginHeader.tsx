import { Animated } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { loginStyles as styles } from "../../screens/Login.styles";

type Props = {
  opacity: Animated.Value;
  translateY: Animated.Value;
  subtitleSize: number;
};

export function LoginHeader({ opacity, translateY, subtitleSize }: Props) {
  return (
    <Animated.View style={[styles.header, { opacity, transform: [{ translateY }] }]}> 
      <AppText style={[styles.subtitle, { fontSize: subtitleSize, lineHeight: subtitleSize * 1.75 }]}>أدخل بيانات حسابك للمتابعة.</AppText>
    </Animated.View>
  );
}
