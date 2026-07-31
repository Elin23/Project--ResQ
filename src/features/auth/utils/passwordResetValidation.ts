export const RESET_CODE_LENGTH = 6;

export function normalizeSyrianMobile(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  return digits.startsWith("09") ? digits.slice(1) : digits;
}

export function validateSyrianMobile(value: string): string | undefined {
  const normalized = normalizeSyrianMobile(value);
  if (!normalized) return "يرجى إدخال رقم الهاتف";
  if (!/^9\d{8}$/.test(normalized)) {
    return "يرجى إدخال رقم هاتف صحيح مثل 09XXXXXXXX";
  }
  return undefined;
}

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
  if (!value) return "يرجى إدخال كلمة المرور الجديدة";
  if (value.length < 8) return "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل";
  if (!/[A-Z]/.test(value)) return "يجب أن تحتوي كلمة المرور على حرف إنجليزي كبير";
  if (!/[a-z]/.test(value)) return "يجب أن تحتوي كلمة المرور على حرف إنجليزي صغير";
  if (!/\d/.test(value)) return "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل";
  return undefined;
}

export function validatePasswordConfirmation(
  confirmation: string,
  password: string,
): string | undefined {
  if (!confirmation) return "يرجى تأكيد كلمة المرور";
  if (confirmation !== password) return "كلمتا المرور غير متطابقتين";
  return undefined;
}
