import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { notificationsService } from "../../services/notifications.service";

export const useFindMyNotificationsQuery = (limit = 15) => {
  return useInfiniteQuery({
    queryKey: ["my-notifications"],
    queryFn: ({ pageParam = 1 }) => notificationsService.findMyNotifications(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      return lastPage.pagination.page < lastPage.pagination.pages ? lastPage.pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindMySummaryNotificationsQuery = () => {
  return useQuery({
    queryKey: ["my-summary-notifications"],

    queryFn: () => {
      return notificationsService.findMySummaryNotifications();
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
