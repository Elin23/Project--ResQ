export type PasswordRequirement = {
  id: "length" | "uppercase" | "number" | "lowercase";
  label: string;
  isValid: boolean;
};

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { id: "length", label: "8 أحرف على الأقل", isValid: password.length >= 8 },
    { id: "uppercase", label: "يحتوي على حرف كبير", isValid: /[A-Z]/.test(password) },
    { id: "number", label: "يحتوي على رقم", isValid: /\d/.test(password) },
    { id: "lowercase", label: "يحتوي على حرف صغير", isValid: /[a-z]/.test(password) },
  ];
}
