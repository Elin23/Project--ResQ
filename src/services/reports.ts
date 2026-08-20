import { repositories } from "@/src/services/domain/repositories";
import type { Report } from "@/src/domain";

export async function getReports(): Promise<Report[]> {
  return repositories.reports.list();
}

export async function getReportById(id: string): Promise<Report | undefined> {
  return repositories.reports.getById(id);
}
