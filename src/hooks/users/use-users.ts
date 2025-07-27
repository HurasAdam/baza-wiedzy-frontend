import { useMutation, useQuery } from "@tanstack/react-query";
import { usersService } from "../../services/users.service";

export const useFindUsers = (params?: URLSearchParams) => {
  console.log("PARAMSY", params);
  return useQuery({
    queryKey: ["users", params?.toString()],
    queryFn: () => {
      return usersService.findUsers(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindUserFavoritesArticlesQuery = (params?: URLSearchParams) => {
  return useQuery({
    queryKey: ["favorite-articles", params?.toString()],
    queryFn: () => {
      return usersService.findMyFavorites(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useResetUserPasswordMutation = () => {
  return useMutation({
    mutationFn: (userId: string) => {
      return usersService.resetUserPassword(userId);
    },
  });
};
