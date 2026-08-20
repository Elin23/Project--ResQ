import { describe, expect, it } from "vitest";
import { ORGANIZATION_WORKSPACE_TABS, USER_WORKSPACE_TABS, workspaceTabsForAccount } from "./workspaces";

describe("workspace navigation ownership", () => {
  it("keeps organization routes inside the organization workspace", () => {
    expect(ORGANIZATION_WORKSPACE_TABS.every((item) => item.route.startsWith("/organization"))).toBe(true);
  });
  it("keeps user tabs outside privileged organization routes", () => {
    expect(USER_WORKSPACE_TABS.some((item) => item.route.startsWith("/organization"))).toBe(false);
  });
  it("selects the correct navigation model for the two account kinds", () => {
    expect(workspaceTabsForAccount("user")).toBe(USER_WORKSPACE_TABS);
    expect(workspaceTabsForAccount("organization")).toBe(ORGANIZATION_WORKSPACE_TABS);
  });
});
