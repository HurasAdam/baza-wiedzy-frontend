import { useMutation, useQuery } from "@tanstack/react-query";
import { userStatisticsService } from "../../services/user-statistics.service";

export const useFindAllUsersStatistics = (query) => {
  return useQuery({
    queryKey: ["all-users-stats", query],
    queryFn: () => {
      return userStatisticsService.findAllUsersStatistics(query);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

interface UserArticlesQuery {
  userId?: string | null;
  startDate?: Date;
  endDate?: Date;
}

export const useFindUserAddedArticles = ({ userId, startDate, endDate }: UserArticlesQuery) => {
  return useQuery({
    queryKey: ["user-added-articles", userId, startDate, endDate],
    queryFn: () => {
      return userStatisticsService.findUserAddedArticles({ userId, startDate, endDate });
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindUserEditedArticles = ({ userId, startDate, endDate }: UserArticlesQuery) => {
  return useQuery({
    queryKey: ["user-edited-articles", userId, startDate, endDate],
    queryFn: () => {
      return userStatisticsService.findUserEditedArticles({ userId, startDate, endDate });
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindUserAddedConversationReports = ({ userId, startDate, endDate }: UserArticlesQuery) => {
  return useQuery({
    queryKey: ["user-added-conversation-reports", userId, startDate, endDate],
    queryFn: () => {
      return userStatisticsService.findUserAddedConversationReports({ userId, startDate, endDate });
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

interface ExportParams {
  startDate?: Date;
  endDate?: Date;
}

export const useExportUsersStatistics = () => {
  return useMutation({
    mutationFn: async ({ startDate, endDate }: ExportParams) => {
      const backendUrl = "http://localhost:5000/statistics/export/users";
      const url = new URL(backendUrl);

      if (startDate) url.searchParams.append("startDate", startDate.toISOString());
      if (endDate) url.searchParams.append("endDate", endDate.toISOString());

      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Błąd pobierania: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "statystyki_uzytkownikow.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    },
  });
};
// export const useFindUsers = (params?: URLSearchParams) => {
//   return useQuery({
//     queryKey: ["users", params?.toString()],
//     queryFn: () => {
//       return usersService.findUsers(params);
//     },

//     refetchOnWindowFocus: false,
//     staleTime: 0,
//     retry: false,
//   });
// };
