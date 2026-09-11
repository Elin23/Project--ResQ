import { useCallback, useEffect } from "react";
import { useAsyncResource } from "@/src/hooks/useAsyncResource";
import { repositories } from "@/src/services/domain/repositories";
import { notificationApi } from "@/src/services/api/notificationApiRepository";
import { subscribeNotificationsChanged } from "@/src/services/api/notificationEvents";
import type { AppNotification } from "@/src/domain";

export function useAccountNotifications(accountId?: string | null) {
  const loader = useCallback(
    async () => accountId ? repositories.notifications.listForAccount(accountId) : [] as AppNotification[],
    [accountId],
  );
  const resource = useAsyncResource<AppNotification[]>(loader, [], "تعذر تحميل الإشعارات.");
  const reload = resource.reload;

  const markRead = useCallback(async (id: string) => {
    if (!accountId) return;
    await repositories.notifications.markRead(id, accountId);
    await reload();
  }, [accountId, reload]);

  const markAllRead = useCallback(async () => {
    if (!accountId) return;
    await repositories.notifications.markAllRead(accountId);
    await reload();
  }, [accountId, reload]);

  return {
    notifications: resource.data,
    loading: resource.loading,
    error: resource.error,
    reload,
    markRead,
    markAllRead,
  };
}

export function useUnreadNotificationCount(enabled = true) {
  const loader = useCallback(async () => {
    if (!enabled) return 0;
    return notificationApi.getUnreadCount();
  }, [enabled]);
  const resource = useAsyncResource<number>(loader, 0, "تعذر تحديث عدد الإشعارات.");
  const reload = resource.reload;

  useEffect(() => {
    if (!enabled) return;
    return subscribeNotificationsChanged(() => { void reload(); });
  }, [enabled, reload]);

  return { count: resource.data, loading: resource.loading, reload };
}
