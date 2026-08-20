import { useCallback } from "react";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";
import type { AppNotification } from "@/src/domain";
export function useAccountNotifications(accountId?: string | null) {
  const loader=useCallback(async()=>accountId?repositories.notifications.listForAccount(accountId):[] as AppNotification[],[accountId]);
  const resource=useAsyncResource<AppNotification[]>(loader,[],"تعذر تحميل الإشعارات.");
  const markRead=useCallback(async(id:string)=>{if(!accountId)return;await repositories.notifications.markRead(id,accountId);await resource.reload();},[accountId,resource.reload]);
  const markAllRead=useCallback(async()=>{if(!accountId)return;await repositories.notifications.markAllRead(accountId);await resource.reload();},[accountId,resource.reload]);
  return {notifications:resource.data,loading:resource.loading,error:resource.error,reload:resource.reload,markRead,markAllRead};
}
