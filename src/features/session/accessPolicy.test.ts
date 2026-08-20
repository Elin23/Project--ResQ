import { describe, expect, it } from "vitest";
import type { SessionPrincipal } from "@/src/types/accounts";
import { can, hasAccountKind } from "./accessPolicy";

const user: SessionPrincipal = { kind: "authenticated", account: { id: "u1", kind: "user", status: "active" } };
const organization: SessionPrincipal = { kind: "authenticated", account: { id: "o1", kind: "organization", status: "active" } };
const pendingOrganization: SessionPrincipal = { kind: "authenticated", account: { id: "o2", kind: "organization", status: "pending" } };

describe("access policy", () => {
  it("keeps guest access intentionally limited", () => {
    expect(can({ kind: "guest" }, "browse")).toBe(true);
    expect(can({ kind: "guest" }, "create-report")).toBe(true);
    expect(can({ kind: "guest" }, "view-personal-account")).toBe(false);
    expect(can({ kind: "guest" }, "apply-adoption")).toBe(false);
  });

  it("keeps user and organization privileges separate", () => {
    expect(can(user, "view-personal-account")).toBe(true);
    expect(can(user, "submit-map-place-application")).toBe(true);
    expect(can(user, "edit-owned-map-place")).toBe(true);
    expect(can(user, "view-organization-dashboard")).toBe(false);
    expect(can(user, "manage-campaigns")).toBe(false);
    expect(can(organization, "view-organization-dashboard")).toBe(true);
    expect(can(organization, "manage-campaigns")).toBe(true);
  });

  it("blocks privileged organization capabilities until active", () => {
    expect(can(pendingOrganization, "browse")).toBe(true);
    expect(can(pendingOrganization, "view-organization-dashboard")).toBe(false);
  });

  it("matches the two canonical account kinds explicitly", () => {
    expect(hasAccountKind(organization, "organization")).toBe(true);
    expect(hasAccountKind(organization, "user")).toBe(false);
  });
});
