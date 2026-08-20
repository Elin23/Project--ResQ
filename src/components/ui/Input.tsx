import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { ContentDirection, resolveInputDirection } from "@/src/i18n";
import {
  ACCESSIBILITY,
  COLORS,
  CONTROL_SIZES,
  ICON_SIZES,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/theme";
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
  iconPosition?: "leading" | "trailing";
  onIconPress?: () => void;
  contentDirection?: ContentDirection;
};

const Input = forwardRef<TextInput, Props>(function Input({
  label,
  error,
  helperText,
  required = false,
  icon,
  iconColor,
  iconSize = ICON_SIZES.lg,
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
  contentDirection = "auto",
  onFocus,
  onBlur,
  ...props
}: Props, ref) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const isEditable = editable ?? (!disabled && !readOnly);
  const resolvedDirection = resolveInputDirection(
    contentDirection,
    props.keyboardType,
    props.textContentType,
  );

  const resolvedIconColor = error
    ? COLORS.danger
    : focused
      ? COLORS.primaryStrong
      : (iconColor ?? COLORS.textSecondary);

  const handleFocus: NonNullable<TextInputProps["onFocus"]> = (event) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur: NonNullable<TextInputProps["onBlur"]> = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  const accessibilityLabel = props.accessibilityLabel ?? label ?? props.placeholder;
  const accessibilityHint = props.accessibilityHint ?? error ?? helperText;

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
        ref={ref}
        {...props}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !isEditable }}
        allowFontScaling={props.allowFontScaling ?? true}
        maxFontSizeMultiplier={props.maxFontSizeMultiplier ?? ACCESSIBILITY.controlTextMaxFontSizeMultiplier}
        editable={isEditable}
        multiline={multiline}
        secureTextEntry={password && hidden}
        placeholderTextColor={COLORS.placeholder}
        textAlign={resolvedDirection === "rtl" ? "right" : "left"}
        textAlignVertical={multiline ? "top" : "center"}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          disabled && styles.disabledInput,
          { writingDirection: resolvedDirection },
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
            accessibilityLabel={props.accessibilityLabel ? `${props.accessibilityLabel}، إجراء إضافي` : label ? `${label}، إجراء إضافي` : "إجراء الحقل"}
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
          <AppText style={styles.label}>{label}</AppText>
          {required ? <AppText style={styles.required}>*</AppText> : null}
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
});

Input.displayName = "Input";
export default Input;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: SPACING.sm,
  },
  labelRow: {
    width: "100%",
    flexDirection: "row", direction: "rtl",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  label: {
    fontFamily: TYPOGRAPHY.label.fontFamily,
    fontSize: TYPOGRAPHY.label.fontSize,
    lineHeight: TYPOGRAPHY.label.lineHeight,
    color: COLORS.text,
    textAlign: "right",
  },
  required: {
    fontFamily: TYPOGRAPHY.label.fontFamily,
    fontSize: TYPOGRAPHY.label.fontSize,
    lineHeight: TYPOGRAPHY.label.lineHeight,
    color: COLORS.danger,
  },
  field: {
    width: "100%",
    height: CONTROL_SIZES.input,
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: RADIUS.md,
    overflow: "hidden",
  },
  focusedField: {
    borderWidth: 1.5,
    borderColor: COLORS.primaryStrong,
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
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: TYPOGRAPHY.body.fontSize,
    lineHeight: TYPOGRAPHY.body.lineHeight,
    color: COLORS.text,
  },
  disabledInput: {
    color: COLORS.textSecondary,
  },
  iconContainer: {
    width: CONTROL_SIZES.input,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.sm,
  },
  iconButton: {
    width: CONTROL_SIZES.input,
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
    height: CONTROL_SIZES.inputMultiline,
    alignItems: "flex-start",
  },
  multilineInput: {
    minHeight: CONTROL_SIZES.inputMultiline - 2,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    textAlignVertical: "top",
  },
  phoneRow: {
    width: "100%",
    flexDirection: "row",
    direction: "rtl",
    alignItems: "stretch",
    gap: SPACING.sm,
  },
  phoneInput: {
    flex: 1,
    minWidth: 0,
  },
  prefixBox: {
    height: CONTROL_SIZES.input,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
  },
  prefixText: {
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontSize: TYPOGRAPHY.body.fontSize,
    lineHeight: TYPOGRAPHY.body.lineHeight,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  errorText: {
    marginTop: SPACING.xs,
    fontFamily: TYPOGRAPHY.caption.fontFamily,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
    color: COLORS.danger,
    textAlign: "right",
  },
  helperText: {
    marginTop: SPACING.xs,
    fontFamily: TYPOGRAPHY.caption.fontFamily,
    fontSize: TYPOGRAPHY.caption.fontSize,
    lineHeight: TYPOGRAPHY.caption.lineHeight,
    color: COLORS.textMuted,
    textAlign: "right",
  },
});
