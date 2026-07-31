import { Animated } from "react-native";

import AppText from "@/src/components/ui/AppText";
import { loginStyles as styles } from "../../screens/Login.styles";

type Props = {
  opacity: Animated.Value;
  translateY: Animated.Value;
  titleSize: number;
  subtitleSize: number;
};

export function LoginHeader({ opacity, translateY, titleSize, subtitleSize }: Props) {
  return (
    <Animated.View style={[styles.header, { opacity, transform: [{ translateY }] }]}> 
      <AppText style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.35 }]}>تسجيل الدخول</AppText>
      <AppText style={[styles.subtitle, { fontSize: subtitleSize, lineHeight: subtitleSize * 1.75 }]}>مرحبًا بعودتك، أدخل بياناتك للمتابعة إلى حسابك.</AppText>
    </Animated.View>
  );
}
