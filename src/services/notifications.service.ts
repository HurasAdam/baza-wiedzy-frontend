import api from "@/config/api.client";

const BASE_URL = "/notifications";

// const create = async (formData: FunnyMessageForm) => {
//   return api.post(BASE_URL, formData);
// };

const findMyNotifications = (params?: URLSearchParams) => {
  return api.get(BASE_URL, { params });
};
const markAsRead = (notificationId: string) => {
  return api.patch(`${BASE_URL}/${notificationId}/read`);
};
const deleteNotification = (notificationId: string) => {
  return api.delete(`${BASE_URL}/${notificationId}`);
};

export const notificationsService = {
  findMyNotifications,
  markAsRead,
  deleteNotification,
};
