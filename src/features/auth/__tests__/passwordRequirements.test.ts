import { describe, expect, it } from "vitest";
import { getPasswordRequirements } from "../utils/passwordRequirements";

describe("getPasswordRequirements", () => {
  it("marks every requirement as valid for a policy-compliant password", () => {
    expect(getPasswordRequirements("Secure123").every((item) => item.isValid)).toBe(true);
  });

  it("reports missing requirements", () => {
    const requirements = getPasswordRequirements("weak");
    expect(requirements.find((item) => item.id === "length")?.isValid).toBe(false);
    expect(requirements.find((item) => item.id === "lowercase")?.isValid).toBe(true);
    expect(requirements.find((item) => item.id === "uppercase")?.isValid).toBe(false);
    expect(requirements.find((item) => item.id === "number")?.isValid).toBe(false);
  });
});
