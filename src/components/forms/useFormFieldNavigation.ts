import { createRef, useMemo, type RefObject } from "react";
import type { TextInput, TextInputProps } from "react-native";

export type FormFieldKey = string;

type FieldNavigation = {
  ref: (key: FormFieldKey) => RefObject<TextInput | null>;
  focus: (key: FormFieldKey) => void;
  nextProps: (current: FormFieldKey, next?: FormFieldKey) => Pick<TextInputProps, "returnKeyType" | "blurOnSubmit" | "onSubmitEditing">;
  doneProps: (onDone?: () => void) => Pick<TextInputProps, "returnKeyType" | "blurOnSubmit" | "onSubmitEditing">;
};

/**
 * Stable keyboard navigation for long mobile forms.
 * Keeps Next/Done semantics out of feature-specific margin/keyboard code.
 */
export function useFormFieldNavigation(keys: readonly FormFieldKey[]): FieldNavigation {
  const keysSignature = keys.join("|");
  const refs = useMemo(() => {
    const entries = keys.map((key) => [key, createRef<TextInput>()] as const);
    return new Map(entries);
  }, [keys]);

  const ref = (key: FormFieldKey) => {
    const target = refs.get(key);
    if (!target) throw new Error(`Unknown form field: ${key}`);
    return target;
  };

  const focus = (key: FormFieldKey) => {
    requestAnimationFrame(() => refs.get(key)?.current?.focus());
  };

  const nextProps = (current: FormFieldKey, next?: FormFieldKey) => ({
    returnKeyType: next ? "next" as const : "done" as const,
    blurOnSubmit: !next,
    onSubmitEditing: next ? () => focus(next) : undefined,
  });

  const doneProps = (onDone?: () => void) => ({
    returnKeyType: "done" as const,
    blurOnSubmit: true,
    onSubmitEditing: onDone,
  });

  return { ref, focus, nextProps, doneProps };
}
