import type { AppNotification, CreateAppNotificationInput, NotificationRepository } from "@/src/domain";
const clone = (item: AppNotification): AppNotification => ({ ...item, target: { ...item.target } });
export class InMemoryNotificationRepository implements NotificationRepository {
  private items: AppNotification[] = [];
  async create(input: CreateAppNotificationInput) {
    const item: AppNotification = { ...input, id: `notification-${Date.now()}-${this.items.length}`, createdAt: new Date().toISOString() };
    this.items.unshift(item); return clone(item);
  }
  async listForAccount(accountId: string) { return this.items.filter(i => i.accountId === accountId).map(clone); }
  async markRead(id: string, accountId: string) { const i=this.items.findIndex(x=>x.id===id&&x.accountId===accountId); if(i<0)return undefined; this.items[i]={...this.items[i],readAt:new Date().toISOString()}; return clone(this.items[i]); }
  async markAllRead(accountId: string) { const now=new Date().toISOString(); this.items=this.items.map(i=>i.accountId===accountId&&!i.readAt?{...i,readAt:now}:i); }
}
