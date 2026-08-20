export type LoginFormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | undefined {
  const normalizedEmail = value.trim();

  if (!normalizedEmail) {
    return "يرجى إدخال البريد الإلكتروني";
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return "يرجى إدخال بريد إلكتروني صحيح";
  }

  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) {
    return "يرجى إدخال كلمة المرور";
  }

  if (value.length < 6) {
    return "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل";
  }

  return undefined;
}

export function validateLoginForm(email: string, password: string): LoginFormErrors {
  return {
    email: validateEmail(email),
    password: validatePassword(password),
  };
}
