import { useMutation, useQuery } from "@tanstack/react-query";
import { notificationsService } from "../../services/notifications.service";

export const useFindMyNotificationsQuery = () => {
  return useQuery({
    queryKey: ["my-notifications"],

    queryFn: () => {
      return notificationsService.findMyNotifications();
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useMarkNotificationAsreadMutation = () => {
  return useMutation({
    mutationFn: (notificationId: string) => notificationsService.markAsRead(notificationId),
  });
};

export const useMarkAllNotificationsAsreadMutation = () => {
  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
  });
};

export const useDeleteNotificationMutation = () => {
  return useMutation({
    mutationFn: (notificationId: string) => notificationsService.deleteNotification(notificationId),
  });
};
