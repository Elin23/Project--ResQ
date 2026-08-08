import { describe, expect, it } from "vitest";
import {
  calculateAge,
  formatSyrianMobileInternational,
  getMaximumBirthDate,
  normalizeSyrianMobile,
  validateBirthDate,
  validateRegistrationPassword,
  validateSyrianMobile,
} from "../utils/registrationValidation";

describe("registration validation", () => {
  it("normalizes local and international Syrian mobile formats", () => {
    expect(normalizeSyrianMobile("0912 345 678")).toBe("912345678");
    expect(normalizeSyrianMobile("+963 912 345 678")).toBe("912345678");
    expect(formatSyrianMobileInternational("0912345678")).toBe("+963912345678");
  });

  it("validates Syrian mobile numbers consistently", () => {
    expect(validateSyrianMobile("0912345678")).toBeUndefined();
    expect(validateSyrianMobile("+963912345678")).toBeUndefined();
    expect(validateSyrianMobile("812345678")).toBeTruthy();
  });

  it("accepts letters from any language with a number", () => {
    expect(validateRegistrationPassword("حماية1234")).toBeUndefined();
    expect(validateRegistrationPassword("Secure123")).toBeUndefined();
    expect(validateRegistrationPassword("12345678")).toBeTruthy();
  });

  it("calculates age around the birthday correctly", () => {
    const today = new Date(2026, 7, 2);
    expect(calculateAge(new Date(2008, 7, 2), today)).toBe(18);
    expect(calculateAge(new Date(2008, 7, 3), today)).toBe(17);
  });

  it("enforces the configured minimum age", () => {
    const today = new Date(2026, 7, 2);
    expect(getMaximumBirthDate(13, today)).toEqual(new Date(2013, 7, 2));
    expect(validateBirthDate(new Date(2013, 7, 2), 13, today)).toBeUndefined();
    expect(validateBirthDate(new Date(2013, 7, 3), 13, today)).toBeTruthy();
  });
});
