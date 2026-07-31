import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  I18nManager,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { COLORS, FONTS, FONT_SIZES, SPACING } from "@/src/theme";
import AppText from "./AppText";

type IconName = keyof typeof Ionicons.glyphMap;

type Props = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  icon?: IconName;
  iconColor?: string;
  iconSize?: number;
  password?: boolean;
  prefix?: string;
  prefixWidth?: number;
  disabled?: boolean;
  readOnly?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  fieldStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onIconPress?: () => void;
};

export default function Input({
  label,
  error,
  helperText,
  required = false,
  icon,
  iconColor,
  iconSize = 24,
  password = false,
  prefix,
  prefixWidth = 98,
  disabled = false,
  readOnly = false,
  multiline = false,
  editable,
  containerStyle,
  fieldStyle,
  inputStyle,
  onIconPress,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const isEditable = editable ?? (!disabled && !readOnly);

  const resolvedIconColor = error
    ? COLORS.danger
    : focused
      ? COLORS.primary
      : (iconColor ?? COLORS.textSecondary);

  const handleFocus: NonNullable<TextInputProps["onFocus"]> = (event) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur: NonNullable<TextInputProps["onBlur"]> = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  const inputField = (
    <View
      style={[
        styles.field,
        multiline && styles.multilineField,
        focused && styles.focusedField,
        error && styles.errorField,
        disabled && styles.disabledField,
        readOnly && styles.readOnlyField,
        fieldStyle,
      ]}
    >
      <TextInput
        {...props}
        editable={isEditable}
        multiline={multiline}
        secureTextEntry={password && hidden}
        placeholderTextColor={COLORS.textSecondary}
        textAlign="right"
        textAlignVertical={multiline ? "top" : "center"}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          disabled && styles.disabledInput,
          inputStyle,
        ]}
      />

      {password ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            hidden ? "إظهار كلمة المرور" : "إخفاء كلمة المرور"
          }
          hitSlop={10}
          onPress={() => setHidden((current) => !current)}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressedIcon,
          ]}
        >
          <Ionicons
            name={hidden ? "eye-off-outline" : "eye-outline"}
            size={iconSize}
            color={resolvedIconColor}
          />
        </Pressable>
      ) : icon ? (
        onIconPress ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={10}
            onPress={onIconPress}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressedIcon,
            ]}
          >
            <Ionicons name={icon} size={iconSize} color={resolvedIconColor} />
          </Pressable>
        ) : (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={iconSize} color={resolvedIconColor} />
          </View>
        )
      ) : null}
    </View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <View style={styles.labelRow}>
          {required ? <AppText style={styles.required}>*</AppText> : null}
          <AppText style={styles.label}>{label}</AppText>
        </View>
      ) : null}

      {prefix ? (
        <View style={styles.phoneRow}>
          <View style={styles.phoneInput}>{inputField}</View>
          <View
            style={[
              styles.prefixBox,
              {
                width: prefixWidth,
              },
              error && styles.errorField,
              disabled && styles.disabledField,
            ]}
          >
            <AppText style={styles.prefixText}>{prefix}</AppText>
          </View>
        </View>
      ) : (
        inputField
      )}

      {error ? (
        <AppText style={styles.errorText}>{error}</AppText>
      ) : helperText ? (
        <AppText style={styles.helperText}>{helperText}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: SPACING.md,
  },
  labelRow: {
    width: "100%",
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    textAlign: "right",
  },
  required: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.body,
    color: COLORS.danger,
  },
  field: {
    width: "100%",
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1.25,
    borderColor: COLORS.textSecondary,
    borderRadius: 16,
    overflow: "hidden",
  },
  focusedField: {
    borderWidth: 1.75,
    borderColor: COLORS.primary,
  },
  errorField: {
    borderColor: COLORS.danger,
  },
  disabledField: {
    backgroundColor: COLORS.neutral,
    opacity: 0.7,
  },
  readOnlyField: {
    backgroundColor: COLORS.surface,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: SPACING.md,
    paddingVertical: 0,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.body,
    color: COLORS.text,
    writingDirection: "rtl",
  },
  disabledInput: {
    color: COLORS.textSecondary,
  },
  iconContainer: {
    width: 54,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.sm,
  },
  iconButton: {
    width: 54,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.sm,
  },
  pressedIcon: {
    opacity: 0.55,
    transform: [{ scale: 0.92 }],
  },
  multilineField: {
    height: 128,
    alignItems: "flex-start",
  },
  multilineInput: {
    minHeight: 126,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    textAlignVertical: "top",
  },
  phoneRow: {
    width: "100%",
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignItems: "stretch",
    gap: SPACING.sm,
  },
  phoneInput: {
    flex: 1,
    minWidth: 0,
  },
  prefixBox: {
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1.25,
    borderColor: COLORS.textSecondary,
    borderRadius: 16,
    paddingHorizontal: SPACING.sm,
  },
  prefixText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  errorText: {
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.label,
    color: COLORS.danger,
    textAlign: "left",
  },
  helperText: {
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.label,
    color: COLORS.textSecondary,
    textAlign: "right",
  },
});
