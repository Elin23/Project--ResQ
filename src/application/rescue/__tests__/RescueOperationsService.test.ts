import { describe, expect, it } from "vitest";

import { RescueOperationsService } from "../RescueOperationsService";
import { InMemoryReportRepository } from "@/src/data/repositories/inMemoryReportRepository";
import { InMemoryRescueRepository } from "@/src/data/repositories/inMemoryRescueRepository";

describe("RescueOperationsService", () => {
  it("turns an incoming report into an organization rescue task", async () => {
    const reports = new InMemoryReportRepository();
    const rescue = new InMemoryRescueRepository(reports);
    const service = new RescueOperationsService(reports, rescue);
    const task = await service.acceptIncomingReport("1", "org-production-test");
    expect(task.reportId).toBe("1");
    expect(task.organizationId).toBe("org-production-test");
    expect((await reports.getById("1"))?.status).toBe("assigned");
  });

  it("rejects closed reports", async () => {
    const reports = new InMemoryReportRepository();
    const rescue = new InMemoryRescueRepository(reports);
    const service = new RescueOperationsService(reports, rescue);
    await reports.updateStatus("1", "closed");
    await expect(service.acceptIncomingReport("1", "org-production-test")).rejects.toThrow("Closed reports");
  });

  it("rejects missing reports", async () => {
    const reports = new InMemoryReportRepository();
    const rescue = new InMemoryRescueRepository(reports);
    const service = new RescueOperationsService(reports, rescue);
    await expect(service.acceptIncomingReport("missing", "org-production-test")).rejects.toThrow("not found");
  });
});
