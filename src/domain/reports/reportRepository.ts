import type { CreateReportInput, Report, ReportStatus } from "./report";

export interface ReportRepository {
  list(): Promise<Report[]>;
  create(input: CreateReportInput): Promise<Report>;
  listByUser(userId: string): Promise<Report[]>;
  listForOrganization(organizationId: string): Promise<Report[]>;
  getById(id: string): Promise<Report | undefined>;
  updateStatus(id: string, status: ReportStatus): Promise<Report>;
  assignToOrganization(id: string, organizationId: string): Promise<Report>;
}
