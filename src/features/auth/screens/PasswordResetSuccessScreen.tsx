import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/ui/AppText";
import Button from "@/src/components/ui/Button";
import styles from "./PasswordResetSuccess.styles";

import { usePasswordResetSuccess } from "../hooks/usePasswordResetSuccess";
export default function PasswordResetSuccessScreen() {
  const {
    width,
    isCompact,
    horizontalPadding,
    contentWidth,
    titleSize,
    descriptionSize,
    illustrationSize,
    buttonHeight,
    isNavigating,
    screenOpacity,
    screenTranslateY,
    illustrationOpacity,
    illustrationScale,
    illustrationTranslateY,
    headerOpacity,
    headerTranslateY,
    cardOpacity,
    cardTranslateY,
    actionsOpacity,
    actionsTranslateY,
    shieldFloat,
    glowScale,
    glowOpacity,
    successScale,
    handleBack,
    handleLogin,
    handleHome,
  } = usePasswordResetSuccess();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Animated.View
        style={[
          styles.screen,
          {
            opacity: screenOpacity,
            transform: [{ translateY: screenTranslateY }],
          },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.topGlow,
            {
              width: width * 1.08,
              height: width * 1.08,
              borderRadius: width,
              top: -width * 0.78,
              right: -width * 0.3,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.bottomGlow,
            {
              width: width * 1.18,
              height: width * 1.18,
              borderRadius: width,
              bottom: -width * 0.88,
              left: -width * 0.4,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <View
          style={[
            styles.topBar,
            {
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="العودة إلى تسجيل الدخول"
            disabled={isNavigating}
            hitSlop={10}
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Ionicons name="arrow-back-outline" size={25} color="#332D2A" />
          </Pressable>

          <View style={styles.topBarSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
              paddingTop: isCompact ? 4 : 12,
              paddingBottom: isCompact ? 24 : 36,
            },
          ]}
        >
          <View
            style={[
              styles.content,
              {
                width: contentWidth,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.illustrationContainer,
                {
                  width: illustrationSize,
                  height: illustrationSize,
                  opacity: illustrationOpacity,
                  transform: [
                    { translateY: illustrationTranslateY },
                    { translateY: shieldFloat },
                    { scale: illustrationScale },
                  ],
                },
              ]}
            >
              <View
                style={[
                  styles.illustrationHalo,
                  {
                    width: illustrationSize,
                    height: illustrationSize,
                    borderRadius: illustrationSize / 2,
                  },
                ]}
              />

              <View
                style={[
                  styles.shield,
                  {
                    width: illustrationSize * 0.62,
                    height: illustrationSize * 0.72,
                    borderTopLeftRadius: illustrationSize * 0.28,
                    borderTopRightRadius: illustrationSize * 0.28,
                    borderBottomLeftRadius: illustrationSize * 0.32,
                    borderBottomRightRadius: illustrationSize * 0.32,
                  },
                ]}
              >
                <View style={styles.shieldLeft} />

                <View style={styles.shieldRight} />

                <View style={styles.shieldInner}>
                  <Animated.View
                    style={[
                      styles.successCircle,
                      {
                        transform: [{ scale: successScale }],
                      },
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={illustrationSize * 0.3}
                      color="#247C3E"
                    />
                  </Animated.View>
                </View>
              </View>

              <View
                style={[
                  styles.lockBadge,
                  {
                    right: illustrationSize * 0.06,
                    top: illustrationSize * 0.17,
                  },
                ]}
              >
                <View style={styles.lockShackle} />

                <View style={styles.lockBody}>
                  <Ionicons name="key-outline" size={18} color="#6B371A" />
                </View>
              </View>

              <View style={styles.sparkleOne}>
                <Ionicons name="sparkles" size={18} color="#F0A13C" />
              </View>

              <View style={styles.sparkleTwo}>
                <Ionicons name="star" size={11} color="#F0A13C" />
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.header,
                {
                  opacity: headerOpacity,
                  transform: [{ translateY: headerTranslateY }],
                },
              ]}
            >
              <AppText
                style={[
                  styles.title,
                  {
                    fontSize: titleSize,
                    lineHeight: titleSize * 1.4,
                  },
                ]}
              >
                تم تغيير كلمة المرور بنجاح
              </AppText>

              <AppText
                style={[
                  styles.description,
                  {
                    fontSize: descriptionSize,
                    lineHeight: descriptionSize * 1.8,
                  },
                ]}
              >
                تم تحديث كلمة مرور حسابك بنجاح. يمكنك الآن تسجيل الدخول باستخدام
                كلمة المرور الجديدة.
              </AppText>
            </Animated.View>

            <Animated.View
              style={[
                styles.statusCard,
                {
                  opacity: cardOpacity,
                  transform: [{ translateY: cardTranslateY }],
                },
              ]}
            >
              <View style={styles.statusRow}>
                <View style={styles.statusIcon}>
                  <Ionicons name="checkmark" size={17} color="#FFFFFF" />
                </View>

                <AppText style={styles.statusText}>تم تأمين حسابك</AppText>
              </View>

              <View style={styles.statusDivider} />

              <View style={styles.statusRow}>
                <View style={styles.statusIcon}>
                  <Ionicons name="checkmark" size={17} color="#FFFFFF" />
                </View>

                <AppText style={styles.statusText}>
                  يمكنك تسجيل الدخول الآن
                </AppText>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.actions,
                {
                  opacity: actionsOpacity,
                  transform: [{ translateY: actionsTranslateY }],
                },
              ]}
            >
              <Button
                title="الانتقال إلى تسجيل الدخول"
                onPress={handleLogin}
                variant="custom"
                size="large"
                icon="log-in-outline"
                iconPosition="end"
                iconSize={23}
                disabled={isNavigating}
                fullWidth
                backgroundColor="#FF8849"
                borderColor="#FF8849"
                borderWidth={0}
                textColor="#603016"
                radius={17}
                style={[
                  styles.loginButton,
                  {
                    height: buttonHeight,
                    minHeight: buttonHeight,
                  },
                ]}
                textStyle={styles.loginButtonText}
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="العودة إلى الصفحة الرئيسية"
                disabled={isNavigating}
                onPress={handleHome}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.homeButton,
                  pressed && styles.homeButtonPressed,
                ]}
              >
                <Ionicons name="home-outline" size={18} color="#A94D17" />

                <AppText style={styles.homeButtonText}>
                  العودة إلى الصفحة الرئيسية
                </AppText>
              </Pressable>
            </Animated.View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
