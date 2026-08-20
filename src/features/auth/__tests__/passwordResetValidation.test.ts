import { describe, expect, it } from "vitest";
import {
  normalizeResetCode,
  normalizeSyrianMobile,
  validateNewPassword,
  validatePasswordConfirmation,
  validateResetCode,
  validateSyrianMobile,
} from "../utils/passwordResetValidation";

describe("password reset validation", () => {
  it("normalizes Syrian mobile numbers", () => {
    expect(normalizeSyrianMobile("09 123 456 78")).toBe("912345678");
  });

  it("rejects invalid mobile numbers", () => {
    expect(validateSyrianMobile("123")).toBeTruthy();
    expect(validateSyrianMobile("0912345678")).toBeUndefined();
  });

  it("keeps only six OTP digits", () => {
    expect(normalizeResetCode("12a34-567")).toBe("123456");
  });

  it("validates OTP values", () => {
    expect(validateResetCode("12345")).toBeTruthy();
    expect(validateResetCode("123456")).toBeUndefined();
  });

  it("requires a strong password and matching confirmation", () => {
    expect(validateNewPassword("weak")).toBeTruthy();
    expect(validateNewPassword("Strong123")).toBeUndefined();
    expect(validatePasswordConfirmation("Strong124", "Strong123")).toBeTruthy();
    expect(validatePasswordConfirmation("Strong123", "Strong123")).toBeUndefined();
  });
});
