import type { ReportRepository, RescueRepository, RescueTask } from "@/src/domain";

/** Coordinates cross-domain rescue operations so UI hooks do not own business workflows. */
export class RescueOperationsService {
  constructor(
    private readonly reports: ReportRepository,
    private readonly rescue: RescueRepository,
  ) {}

  async acceptIncomingReport(reportId: string, organizationId: string): Promise<RescueTask> {
    const report = await this.reports.getById(reportId);
    if (!report) throw new Error(`Report ${reportId} not found`);
    if (report.status === "closed") throw new Error("Closed reports cannot become rescue tasks");
    return this.rescue.createFromReport(reportId, organizationId);
  }
}
