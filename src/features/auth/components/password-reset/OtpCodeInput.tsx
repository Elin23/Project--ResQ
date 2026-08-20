import { TYPOGRAPHY, RADIUS, COLORS, PALETTE } from "@/src/theme";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import AppText from "@/src/components/ui/AppText";

type Props = {
  value: string;
  length: number;
  disabled?: boolean;
  status?: "idle" | "verifying" | "success" | "error";
  onChangeText: (value: string) => void;
  onSubmit: () => void;
};

const OtpCodeInput = forwardRef<TextInput, Props>(function OtpCodeInput(
  { value, length, disabled = false, status = "idle", onChangeText, onSubmit },
  ref,
) {
  const inputRef = useRef<TextInput>(null);
  useImperativeHandle(ref, () => inputRef.current as TextInput);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="إدخال رمز التحقق"
      onPress={() => inputRef.current?.focus()}
      style={styles.container}
    >
      <View style={styles.boxes}>
        {Array.from({ length }).map((_, index) => {
          const digit = value[index] ?? "";
          const active = index === value.length || (value.length === length && index === length - 1);
          return (
            <View
              key={index}
              style={[
                styles.box,
                digit ? styles.filled : null,
                active && status === "idle" ? styles.active : null,
                status === "success" ? styles.success : null,
                status === "error" ? styles.error : null,
              ]}
            >
              <AppText style={styles.digit}>{digit}</AppText>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        returnKeyType="done"
        caretHidden
        editable={!disabled}
        style={styles.hidden}
      />
    </Pressable>
  );
});

export default OtpCodeInput;

const styles = StyleSheet.create({
  container: { width: "100%", position: "relative" },
  boxes: { flexDirection: "row", direction: "ltr", justifyContent: "space-between", gap: 8 },
  box: { flex: 1, aspectRatio: 0.84, maxWidth: 60, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.borderStrong, backgroundColor: PALETTE.neutral0, alignItems: "center", justifyContent: "center" },
  filled: { borderColor: COLORS.primary, backgroundColor: COLORS.dangerSoft },
  active: { borderColor: PALETTE.orange500, borderWidth: 2 },
  success: { borderColor: COLORS.secondaryStrong, backgroundColor: COLORS.secondarySoft },
  error: { borderColor: COLORS.warning, backgroundColor: COLORS.dangerSoft },
  digit: { fontSize: TYPOGRAPHY.h1.fontSize, color: COLORS.icon },
  hidden: { position: "absolute", width: 1, height: 1, opacity: 0 },
});
