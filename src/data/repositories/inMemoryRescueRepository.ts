import type { ReportRepository, RescueChecklistKey, RescueRepository, RescueTask, RescueTaskStage } from "@/src/domain";
import { RESCUE_TASK_SEED } from "../seeds/domainSeeds";

const clone = (task: RescueTask): RescueTask => ({ ...task, checklist: { ...task.checklist }, evidenceUris: [...task.evidenceUris] });

export class InMemoryRescueRepository implements RescueRepository {
  private tasks = RESCUE_TASK_SEED.map(clone);
  constructor(private readonly reports: ReportRepository) {}

  async listByOrganization(organizationId: string) { return this.tasks.filter((task) => task.organizationId === organizationId).map(clone); }
  async getById(id: string) { const item = this.tasks.find((task) => task.id === id); return item ? clone(item) : undefined; }
  async createFromReport(reportId: string, organizationId: string) {
    const existing = this.tasks.find((task) => task.reportId === reportId && task.organizationId === organizationId);
    if (existing) return clone(existing);
    const report = await this.reports.getById(reportId);
    if (!report) throw new Error(`Report ${reportId} not found`);
    await this.reports.assignToOrganization(reportId, organizationId);
    const sequence = String(this.tasks.length + 482).padStart(5, "0");
    const task: RescueTask = {
      id: `MS-2026-${sequence}`,
      code: `MS-2026-${sequence}`,
      reportId,
      organizationId,
      title: report.title,
      animalType: report.description,
      city: report.locationName.split("-")[0].trim(),
      healthStatus: report.subtitle,
      reporterNote: report.subtitle,
      createdAt: new Date().toISOString(),
      etaMinutes: 15,
      locationLabel: report.locationName,
      locationDistance: "المسافة تحسب عند تفعيل الموقع",
      latitude: report.latitude,
      longitude: report.longitude,
      reporterName: "مبلّغ عبر ResQ",
      reporterPhone: "+963900000000",
      imageUri: "https://picsum.photos/seed/resq-rescue/800/600",
      mapImageUri: "https://picsum.photos/seed/resq-map/900/500",
      progress: 15,
      stage: "accepted",
      checklist: { arrived: false, assessed: false, secured: false },
      notes: "",
      evidenceUris: [],
    };
    this.tasks.unshift(task);
    return clone(task);
  }
  async setProgress(id: string, progress: number) { const task = this.require(id); task.progress = Math.max(0, Math.min(100, progress)); return clone(task); }
  async setStage(id: string, stage: RescueTaskStage) { const task = this.require(id); task.stage = stage; if (stage === "completed" && !task.completedAt) task.completedAt = new Date().toISOString(); return clone(task); }
  async toggleChecklist(id: string, key: RescueChecklistKey) { const task = this.require(id); task.checklist[key] = !task.checklist[key]; return clone(task); }
  async saveNotes(id: string, notes: string) { const task = this.require(id); task.notes = notes; return clone(task); }
  async addEvidence(id: string, uris: string[]) { const task = this.require(id); task.evidenceUris.push(...uris); return clone(task); }
  private require(id: string) { const task = this.tasks.find((item) => item.id === id); if (!task) throw new Error(`Task ${id} not found`); return task; }
}
