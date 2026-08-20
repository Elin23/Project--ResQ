import { useCallback, useMemo, useState } from "react";
import { useSession } from "@/src/features/session/SessionContext";
import { repositories } from "@/src/services/domain/repositories";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import type { Report } from "@/src/domain";
import type { MyReport, MyReportStatus } from "../types/myReport";

export type ReportFilter = "all" | MyReportStatus;

function statusView(report: Report): MyReportStatus {
  if (report.status === "closed") return "rescued";
  if (report.status === "assigned" || report.status === "approved") return "rescue";
  return "review";
}

function reportView(report: Report): MyReport {
  const status = statusView(report);
  return {
    id: report.id,
    title: report.title,
    code: report.code,
    location: report.locationName,
    imageUrl: report.imageUrl,
    status,
    activeStep: status === "rescued" ? 3 : status === "rescue" ? 1 : 0,
  };
}

export function useMyReports() {
  const { account, isGuest } = useSession();
  const [filter, setFilter] = useState<ReportFilter>("all");
  const [query, setQuery] = useState("");
  const userId = account?.kind === "user" ? account.id : "local-user";
  const loader = useCallback(() => isGuest ? repositories.reports.list() : repositories.reports.listByUser(userId), [isGuest, userId]);
  const resource = useAsyncResource<Report[]>(loader, [], "تعذر تحميل البلاغات.");
  const allReports = useMemo(() => resource.data.map(reportView), [resource.data]);
  const reports = useMemo(() => allReports.filter((item) => (filter === "all" || item.status === filter) && (item.title.includes(query) || item.code.includes(query))), [allReports, filter, query]);
  const stats = useMemo(() => ({ all: allReports.length, mine: allReports.length, rescued: allReports.filter((item) => item.status === "rescue").length }), [allReports]);
  return { reports, filter, setFilter, query, setQuery, stats, loading: resource.loading, error: resource.error, reload: resource.reload };
}
