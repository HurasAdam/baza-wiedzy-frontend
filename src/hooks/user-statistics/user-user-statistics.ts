import { useQuery } from "@tanstack/react-query";
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
