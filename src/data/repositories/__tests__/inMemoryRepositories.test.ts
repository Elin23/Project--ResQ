import { describe, expect, it } from "vitest";

import { InMemoryAdoptionRepository } from "../inMemoryAdoptionRepository";
import { InMemoryServicePlaceRepository } from "../inMemoryServicePlaceRepository";
import { InMemoryReportRepository } from "../inMemoryReportRepository";
import { InMemoryRescueRepository } from "../inMemoryRescueRepository";

describe("in-memory repositories", () => {
  it("returns clones instead of exposing mutable report storage", async () => {
    const repository = new InMemoryReportRepository();
    const reports = await repository.list();
    const originalTitle = reports[0].title;
    reports[0].title = "mutated outside repository";
    expect((await repository.list())[0].title).toBe(originalTitle);
  });

  it("persists a new report and scopes it to its user", async () => {
    const repository = new InMemoryReportRepository();
    const created = await repository.create({
      title: "بلاغ اختبار",
      description: "قطة",
      subtitle: "تحتاج للمساعدة",
      locationName: "دمشق",
      latitude: 33.51,
      longitude: 36.29,
      priority: "normal",
      userId: "qa-user",
    });
    expect(created.status).toBe("pending");
    expect((await repository.listByUser("qa-user")).some((item) => item.id === created.id)).toBe(true);
  });

  it("creates one rescue task per report and organization and clamps progress", async () => {
    const reports = new InMemoryReportRepository();
    const rescue = new InMemoryRescueRepository(reports);
    const first = await rescue.createFromReport("1", "qa-org");
    const second = await rescue.createFromReport("1", "qa-org");
    expect(second.id).toBe(first.id);
    expect((await reports.getById("1"))?.assignedOrganizationId).toBe("qa-org");
    expect((await rescue.setProgress(first.id, 150)).progress).toBe(100);
    expect((await rescue.setProgress(first.id, -10)).progress).toBe(0);
  });

  it("keeps map-place management scoped to the owning user", async () => {
    const repository = new InMemoryServicePlaceRepository();
    expect(await repository.listOwnedByUser("user-owner-1")).toEqual([]);
  });

  it("exposes only available adoption listings", async () => {
    const repository = new InMemoryAdoptionRepository();
    expect((await repository.listAvailable()).every((item) => item.status === "available")).toBe(true);
  });
});
