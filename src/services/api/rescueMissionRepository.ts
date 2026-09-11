import { resolveMediaUrl } from "./mediaUrl";
import type { PagedResultDto } from "@/src/contracts/backend/common";
import type { ReportDto } from "@/src/contracts/backend/reports";
import type { RescueMissionActionRequest, RescueMissionDto } from "@/src/contracts/backend/rescueMissions";
import type { RescueChecklistKey, RescueRepository, RescueTask, RescueTaskStage } from "@/src/domain";
import { apiRequest, ApiError } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { pageItems, withQuery } from "./query";
import { uploadLocalMediaUris } from "./uploadsApi";


const stageFromStatus = (status?: string | null): RescueTaskStage => {
  switch ((status ?? "").toUpperCase()) {
    case "ASSIGNED": return "assigned";
    case "ACCEPTED": return "accepted";
    case "ON_THE_WAY": return "on-route";
    case "ARRIVED": return "arrived";
    case "RESCUED": return "rescued";
    case "COMPLETED": return "completed";
    case "CANCELLED": return "cancelled";
    default: return "assigned";
  }
};

const progressFromStage = (stage: RescueTaskStage) => ({ assigned: 10, accepted: 25, "on-route": 45, arrived: 65, rescued: 85, completed: 100, cancelled: 0 }[stage]);

const checklistFromStage = (stage: RescueTaskStage): Record<RescueChecklistKey, boolean> => ({
  arrived: ["arrived", "rescued", "completed"].includes(stage),
  assessed: ["arrived", "rescued", "completed"].includes(stage),
  secured: ["rescued", "completed"].includes(stage),
});

export class ApiRescueRepository implements RescueRepository {

  async listByOrganization(organizationId: string): Promise<RescueTask[]> {
    const numericOrganizationId = Number(organizationId);
    const payload = await apiRequest<PagedResultDto<RescueMissionDto> | RescueMissionDto[]>(withQuery(API_ENDPOINTS.rescueMissions.mine, {
      OrganizationId: Number.isFinite(numericOrganizationId) ? numericOrganizationId : undefined,
      Page: 1,
      PageSize: 100,
    }));
    const missions = pageItems(payload);
    return Promise.all(missions.map((mission) => this.toTask(mission)));
  }

  async getById(id: string): Promise<RescueTask | undefined> {
    try {
      const mission = await apiRequest<RescueMissionDto>(API_ENDPOINTS.rescueMissions.byId(id));
      return this.toTask(mission);
    } catch (error) {
      if (error instanceof ApiError && error.isNotFound) return undefined;
      throw error;
    }
  }

  async createFromReport(reportId: string, organizationId: string): Promise<RescueTask> {
    const missions = await this.listByOrganization(organizationId);
    const mission = missions.find((item) => item.reportId === reportId);
    if (!mission) throw new ApiError("لا توجد مهمة إنقاذ مسندة لهذه الجمعية مرتبطة بالبلاغ المطلوب.", 409);
    if (mission.stage === "assigned") return this.setStage(mission.id, "accepted");
    return mission;
  }

  async setProgress(id: string, _progress: number): Promise<RescueTask> {
    return this.requireTask(id);
  }

  async setStage(id: string, stage: RescueTaskStage): Promise<RescueTask> {
    if (stage === "assigned") return this.requireTask(id);
    if (stage === "cancelled") {
      await apiRequest<void>(API_ENDPOINTS.rescueMissions.cancel(id), { method: "POST", body: JSON.stringify({ reason: "تم الإلغاء من مساحة عمل الجمعية" }) });
      return this.requireTask(id);
    }
    const endpoint = stage === "accepted" ? API_ENDPOINTS.rescueMissions.accept(id)
      : stage === "on-route" ? API_ENDPOINTS.rescueMissions.onTheWay(id)
      : stage === "arrived" ? API_ENDPOINTS.rescueMissions.arrive(id)
      : stage === "rescued" ? API_ENDPOINTS.rescueMissions.rescue(id)
      : API_ENDPOINTS.rescueMissions.complete(id);
    const body: RescueMissionActionRequest = { note: null, evidenceMediaIds: null };
    await apiRequest<void>(endpoint, { method: "POST", body: JSON.stringify(body) });
    return this.requireTask(id);
  }

  async toggleChecklist(id: string, key: RescueChecklistKey): Promise<RescueTask> {
    let task = await this.requireTask(id);
    if (task.checklist[key]) return task;

    if (key === "arrived" || key === "assessed") {
      if (task.stage === "assigned") task = await this.setStage(task.id, "accepted");
      if (task.stage === "accepted") task = await this.setStage(task.id, "on-route");
      if (task.stage === "on-route") task = await this.setStage(task.id, "arrived");
      return task;
    }

    if (key === "secured") {
      if (task.stage === "assigned") task = await this.setStage(task.id, "accepted");
      if (task.stage === "accepted") task = await this.setStage(task.id, "on-route");
      if (task.stage === "on-route") task = await this.setStage(task.id, "arrived");
      if (task.stage === "arrived") task = await this.setStage(task.id, "rescued");
    }
    return task;
  }

  async saveNotes(id: string, notes: string): Promise<RescueTask> {
    await apiRequest<void>(API_ENDPOINTS.rescueMissions.details(id), {
      method: "PUT",
      body: JSON.stringify({ note: notes.trim(), evidenceMediaIds: null } satisfies RescueMissionActionRequest),
    });
    return this.requireTask(id);
  }

  async addEvidence(id: string, uris: string[]): Promise<RescueTask> {
    if (!uris.length) return this.requireTask(id);
    const uploads = await uploadLocalMediaUris(uris);
    const ids = uploads.map((item) => item.id);
    if (ids.length) {
      await apiRequest<void>(API_ENDPOINTS.rescueMissions.details(id), {
        method: "PUT",
        body: JSON.stringify({ note: null, evidenceMediaIds: ids } satisfies RescueMissionActionRequest),
      });
    }
    return this.requireTask(id);
  }

  private async requireTask(id: string): Promise<RescueTask> {
    const task = await this.getById(id);
    if (!task) throw new ApiError("تعذر العثور على مهمة الإنقاذ المطلوبة.", 404);
    return task;
  }

  private async toTask(mission: RescueMissionDto): Promise<RescueTask> {
    let report: ReportDto | undefined;
    try { report = await apiRequest<ReportDto>(API_ENDPOINTS.reports.byId(String(mission.reportId))); } catch { /* mission remains usable if report enrichment fails */ }
    const stage = stageFromStatus(mission.status);
    const evidenceUrls = (mission.evidence ?? []).map((item) => resolveMediaUrl(item.url)).filter(Boolean);
    const reportImages = (report?.media ?? []).map((item) => resolveMediaUrl(item.url)).filter(Boolean);
    const checklist = checklistFromStage(stage);
    const location = report?.location;
    const note = mission.notes ?? "";
    return {
      id: String(mission.id),
      code: `MS-${mission.id}`,
      reportId: String(mission.reportId),
      organizationId: String(mission.organizationId),
      title: report?.title ?? `مهمة إنقاذ #${mission.id}`,
      animalType: report?.animalDescription ?? report?.animalType ?? "حيوان بحاجة للإنقاذ",
      city: location?.regionName ?? location?.governorateName ?? "",
      healthStatus: report?.animalDescription ?? report?.description ?? "راجع تفاصيل البلاغ",
      reporterNote: report?.description ?? "",
      createdAt: mission.assignedAt ?? mission.createdAt,
      completedAt: mission.completedAt ?? undefined,
      etaMinutes: 0,
      locationLabel: location?.address ?? location?.regionName ?? location?.governorateName ?? "الموقع المسجل في البلاغ",
      locationDistance: "",
      latitude: location?.latitude ?? 0,
      longitude: location?.longitude ?? 0,
      reporterName: report?.reporter?.name ?? "مبلّغ عبر ResQ",
      reporterPhone: report?.reporter?.phone ?? "",
      imageUri: reportImages[0] ?? evidenceUrls[0] ?? "",
      mapImageUri: "",
      progress: progressFromStage(stage),
      stage,
      checklist,
      notes: note,
      evidenceUris: evidenceUrls,
    };
  }
}
