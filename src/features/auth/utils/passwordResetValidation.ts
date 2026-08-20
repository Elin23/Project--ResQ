import {
  normalizeSyrianMobile,
  validatePasswordConfirmation,
  validateRegistrationPassword,
  validateSyrianMobile,
} from "./registrationValidation";

export const RESET_CODE_LENGTH = 6;

export { normalizeSyrianMobile, validateSyrianMobile };

export function normalizeResetCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, RESET_CODE_LENGTH);
}

export function validateResetCode(value: string): string | undefined {
  if (!value) return "يرجى إدخال رمز التحقق";
  if (value.length !== RESET_CODE_LENGTH) {
    return "يجب أن يتكون رمز التحقق من 6 أرقام";
  }
  if (!/^\d{6}$/.test(value)) return "رمز التحقق يجب أن يحتوي على أرقام فقط";
  return undefined;
}

export function validateNewPassword(value: string): string | undefined {
  return validateRegistrationPassword(value, "يرجى إدخال كلمة المرور الجديدة");
}

export { validatePasswordConfirmation };
