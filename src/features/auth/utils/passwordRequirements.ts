import {
  getRegistrationPasswordRequirements,
  type RegistrationPasswordRequirement,
} from "./registrationValidation";

export type PasswordRequirement = RegistrationPasswordRequirement;

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return getRegistrationPasswordRequirements(password);
}
