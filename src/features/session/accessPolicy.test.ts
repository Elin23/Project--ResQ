import { describe, expect, it } from "vitest";
import { can } from "./accessPolicy";

describe("guest access policy", () => {
  it("allows browsing and creating reports", () => {
    expect(can("guest", "browse")).toBe(true);
    expect(can("guest", "create-report")).toBe(true);
  });
  it("blocks account and personal activity", () => {
    expect(can("guest", "view-account")).toBe(false);
    expect(can("guest", "edit-account")).toBe(false);
    expect(can("guest", "view-personal-reports")).toBe(false);
  });
  it("allows members all declared capabilities", () => {
    expect(can("member", "view-account")).toBe(true);
    expect(can("member", "manage-volunteer-requests")).toBe(true);
  });
});
