import type { RescueChecklistKey, RescueTask, RescueTaskStage } from "./rescueTask";

export interface RescueRepository {
  listByOrganization(organizationId: string): Promise<RescueTask[]>;
  getById(id: string): Promise<RescueTask | undefined>;
  createFromReport(reportId: string, organizationId: string): Promise<RescueTask>;
  setProgress(id: string, progress: number): Promise<RescueTask>;
  setStage(id: string, stage: RescueTaskStage): Promise<RescueTask>;
  toggleChecklist(id: string, key: RescueChecklistKey): Promise<RescueTask>;
  saveNotes(id: string, notes: string): Promise<RescueTask>;
  addEvidence(id: string, uris: string[]): Promise<RescueTask>;
}
