import { describe, expect, it } from "vitest";

import { validateEmail, validateLoginForm, validatePassword } from "../utils/authValidation";

describe("auth validation", () => {
  it("requires an email", () => {
    expect(validateEmail(" ")).toBe("يرجى إدخال البريد الإلكتروني");
  });

  it("rejects malformed emails", () => {
    expect(validateEmail("not-an-email")).toBe("يرجى إدخال بريد إلكتروني صحيح");
  });

  it("accepts a normalized valid email", () => {
    expect(validateEmail(" user@example.com ")).toBeUndefined();
  });

  it("requires a password with at least six characters", () => {
    expect(validatePassword("")).toBe("يرجى إدخال كلمة المرور");
    expect(validatePassword("12345")).toBe("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل");
    expect(validatePassword("123456")).toBeUndefined();
  });

  it("returns both field errors in one pass", () => {
    expect(validateLoginForm("bad", "1")).toEqual({
      email: "يرجى إدخال بريد إلكتروني صحيح",
      password: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
    });
  });
});
