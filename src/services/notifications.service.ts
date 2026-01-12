import api from "@/config/api.client";
import type { NotificationsResponse } from "../types/notification";

const BASE_URL = "/notifications";

// const create = async (formData: FunnyMessageForm) => {
//   return api.post(BASE_URL, formData);
// };

const findMyNotifications = (page = 1, limit = 20): Promise<NotificationsResponse> => {
  return api.get(BASE_URL, { params: { page, limit } });
};
const findMySummaryNotifications = (params?: URLSearchParams) => {
  return api.get(`${BASE_URL}/summary`, { params });
};

const markAsRead = (notificationId: string) => {
  return api.patch(`${BASE_URL}/${notificationId}/read`);
};

const markAllAsRead = () => {
  return api.patch(`${BASE_URL}/read-all`);
};
const deleteNotification = (notificationId: string) => {
  return api.delete(`${BASE_URL}/${notificationId}`);
};

export const notificationsService = {
  findMyNotifications,
  findMySummaryNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
