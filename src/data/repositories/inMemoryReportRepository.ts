import type { CreateReportInput, Report, ReportRepository, ReportStatus } from "@/src/domain";
import { REPORT_SEED } from "../seeds/domainSeeds";

const clone = (report: Report): Report => ({ ...report });

export class InMemoryReportRepository implements ReportRepository {
  private reports = REPORT_SEED.map(clone);
  private idCounter = 0;

  async list() { return this.reports.map(clone); }
  async create(input: CreateReportInput) {
    const sequence = String(this.reports.length + 1).padStart(4, "0");
    const report: Report = {
      id: `local-${Date.now()}-${++this.idCounter}`,
      code: `RP-2026-${sequence}`,
      title: input.title,
      description: input.description,
      subtitle: input.subtitle,
      imageUrl: input.imageUrl ?? "https://picsum.photos/seed/resq-new-report/600/400",
      locationName: input.locationName,
      latitude: input.latitude,
      longitude: input.longitude,
      status: "pending",
      priority: input.priority,
      createdAt: new Date().toISOString(),
      userId: input.userId,
    };
    this.reports.unshift(report);
    return clone(report);
  }
  async listByUser(userId: string) { return this.reports.filter((item) => item.userId === userId).map(clone); }
  async listForOrganization(organizationId: string) {
    return this.reports
      .filter((item) => item.status === "pending" || item.assignedOrganizationId === organizationId)
      .map(clone);
  }
  async getById(id: string) { const item = this.reports.find((report) => report.id === id); return item ? clone(item) : undefined; }
  async updateStatus(id: string, status: ReportStatus) {
    const item = this.require(id);
    item.status = status;
    return clone(item);
  }
  async assignToOrganization(id: string, organizationId: string) {
    const item = this.require(id);
    item.status = "assigned";
    item.assignedOrganizationId = organizationId;
    return clone(item);
  }
  private require(id: string) {
    const item = this.reports.find((report) => report.id === id);
    if (!item) throw new Error(`Report ${id} not found`);
    return item;
  }
}
