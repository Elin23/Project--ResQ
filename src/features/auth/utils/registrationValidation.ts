import { validateEmail } from "./authValidation";

export const USER_MINIMUM_AGE = 13;
export const ENTITY_MANAGER_MINIMUM_AGE = 18;
export const MINIMUM_BIRTH_YEAR = 1900;

export const PASSWORD_POLICY = {
  minimumLength: 8,
  requiresLetter: true,
  requiresNumber: true,
} as const;

export type RegistrationPasswordRequirement = {
  id: "length" | "letter" | "number";
  label: string;
  isValid: boolean;
};

export function normalizeSyrianMobile(value: string): string {
  const digits = value.replace(/\D/g, "");
  const withoutCountryCode = digits.startsWith("963") ? digits.slice(3) : digits;
  const withoutLeadingZero = withoutCountryCode.startsWith("09")
    ? withoutCountryCode.slice(1)
    : withoutCountryCode;

  return withoutLeadingZero.slice(0, 9);
}

export function formatSyrianMobileInternational(value: string): string {
  return `+963${normalizeSyrianMobile(value)}`;
}

export function validateSyrianMobile(value: string): string | undefined {
  const normalized = normalizeSyrianMobile(value);

  if (!normalized) {
    return "يرجى إدخال رقم الهاتف";
  }

  if (!/^9\d{8}$/.test(normalized)) {
    return "يرجى إدخال رقم سوري صحيح مثل 09XXXXXXXX";
  }

  return undefined;
}

export function hasLetter(value: string): boolean {
  return /\p{L}/u.test(value);
}

export function getRegistrationPasswordRequirements(
  password: string,
): RegistrationPasswordRequirement[] {
  return [
    {
      id: "length",
      label: `${PASSWORD_POLICY.minimumLength} أحرف على الأقل`,
      isValid: password.length >= PASSWORD_POLICY.minimumLength,
    },
    {
      id: "letter",
      label: "محرف واحد على الأقل",
      isValid: hasLetter(password),
    },
    {
      id: "number",
      label: "رقم واحد على الأقل",
      isValid: /\d/.test(password),
    },
  ];
}

export function getRegistrationPasswordStrength(password: string): number {
  return getRegistrationPasswordRequirements(password).filter(
    (requirement) => requirement.isValid,
  ).length;
}

export function validateRegistrationPassword(
  value: string,
  emptyMessage = "يرجى إدخال كلمة المرور",
): string | undefined {
  if (!value) {
    return emptyMessage;
  }

  if (value.length < PASSWORD_POLICY.minimumLength) {
    return `يجب أن تتكون كلمة المرور من ${PASSWORD_POLICY.minimumLength} أحرف على الأقل`;
  }

  if (!hasLetter(value)) {
    return "يجب أن تحتوي كلمة المرور على حرف واحد على الأقل";
  }

  if (!/\d/.test(value)) {
    return "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل";
  }

  return undefined;
}

export function validatePasswordConfirmation(
  confirmation: string,
  password: string,
): string | undefined {
  if (!confirmation) {
    return "يرجى تأكيد كلمة المرور";
  }

  if (confirmation !== password) {
    return "كلمتا المرور غير متطابقتين";
  }

  return undefined;
}

export function getMaximumBirthDate(
  minimumAge: number,
  today = new Date(),
): Date {
  return new Date(
    today.getFullYear() - minimumAge,
    today.getMonth(),
    today.getDate(),
  );
}

export function getMinimumBirthDate(): Date {
  return new Date(MINIMUM_BIRTH_YEAR, 0, 1);
}

export function calculateAge(birthDate: Date, today = new Date()): number {
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasNotHadBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (hasNotHadBirthday) {
    age -= 1;
  }

  return age;
}

export function validateBirthDate(
  birthDate: Date | null,
  minimumAge: number,
  today = new Date(),
): string | undefined {
  if (!birthDate) {
    return "يرجى اختيار تاريخ الميلاد";
  }

  if (birthDate > today) {
    return "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
  }

  if (birthDate < getMinimumBirthDate()) {
    return "يرجى اختيار تاريخ ميلاد صحيح";
  }

  if (calculateAge(birthDate, today) < minimumAge) {
    return `يجب ألا يقل العمر عن ${minimumAge} سنة`;
  }

  return undefined;
}

export function validateFullName(value: string): string | undefined {
  const normalized = value.trim();

  if (!normalized) {
    return "يرجى إدخال الاسم الكامل";
  }

  if (normalized.length < 3) {
    return "يجب أن يتكون الاسم من 3 أحرف على الأقل";
  }

  return undefined;
}

export { validateEmail };
