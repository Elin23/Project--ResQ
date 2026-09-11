import { describe, expect, it } from "vitest";
import { InMemorySponsoredAdRepository } from "./inMemorySponsoredAdRepository";

describe("InMemorySponsoredAdRepository", () => {
  it("exposes active ads through a read-only repository", async () => {
    const repo = new InMemorySponsoredAdRepository();
    const items = await repo.listActive("2026-09-06T00:00:00.000Z");
    expect(items.length).toBeGreaterThan(0);
    expect(typeof (repo as unknown as { create?: unknown }).create).toBe("undefined");
    expect(typeof (repo as unknown as { update?: unknown }).update).toBe("undefined");
    expect(typeof (repo as unknown as { remove?: unknown }).remove).toBe("undefined");
  });
});
