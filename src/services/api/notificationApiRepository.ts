import type { PagedResultDto } from "@/src/contracts/backend/common";
import type { AppNotificationDto, DeviceRegistrationDto, RegisterDeviceRequest, UnreadCountDto } from "@/src/contracts/backend/notifications";
import type { AppNotification, CreateAppNotificationInput, NotificationRepository } from "@/src/domain";
import { apiRequest } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import { notificationDtoToDomain } from "./mappers/notificationMapper";
import { emitNotificationsChanged } from "./notificationEvents";
import { pageItems, withQuery } from "./query";

export class ApiNotificationRepository implements NotificationRepository {
  async create(_input: CreateAppNotificationInput): Promise<AppNotification> {
    throw new Error("إنشاء الإشعارات يتم من الخادم ولا يمكن إنشاؤها مباشرة من التطبيق.");
  }

  async listForAccount(accountId: string): Promise<AppNotification[]> {
    const payload = await apiRequest<PagedResultDto<AppNotificationDto> | AppNotificationDto[]>(
      withQuery(API_ENDPOINTS.notifications.list, { Page: 1, PageSize: 100 }),
    );
    return pageItems(payload).map((item) => notificationDtoToDomain(item, accountId));
  }

  async markRead(id: string, _accountId: string): Promise<AppNotification | undefined> {
    await apiRequest<void>(API_ENDPOINTS.notifications.markRead(id), { method: "PATCH" });
    emitNotificationsChanged();
    return undefined;
  }

  async markAllRead(_accountId: string): Promise<void> {
    await apiRequest<void>(API_ENDPOINTS.notifications.readAll, { method: "POST" });
    emitNotificationsChanged();
  }

  async getUnreadCount(): Promise<number> {
    const result = await apiRequest<UnreadCountDto>(API_ENDPOINTS.notifications.unreadCount);
    return Math.max(0, Number(result?.count) || 0);
  }

  async registerDevice(input: RegisterDeviceRequest): Promise<DeviceRegistrationDto> {
    return apiRequest<DeviceRegistrationDto>(API_ENDPOINTS.notifications.devices, {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async removeDevice(id: number | string): Promise<void> {
    await apiRequest<void>(`${API_ENDPOINTS.notifications.devices}/${encodeURIComponent(String(id))}`, { method: "DELETE" });
  }
}

export const notificationApi = new ApiNotificationRepository();
