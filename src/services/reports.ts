import { APP_CONFIG } from "@/src/constants/config";
import { mockReports } from "@/src/data/mockData";
import { apiRequest } from "@/src/services/api/client";
import { Report } from "@/src/types";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function getReports(): Promise<Report[]> {
  if (APP_CONFIG.useMockApi) {
    await delay(350);
    return mockReports;
  }

  return apiRequest<Report[]>("/reports");
}

export async function getReportById(
  id: string,
): Promise<Report | undefined> {
  if (APP_CONFIG.useMockApi) {
    await delay(200);
    return mockReports.find((report) => report.id === id);
  }

  return apiRequest<Report>(`/reports/${encodeURIComponent(id)}`);
}
