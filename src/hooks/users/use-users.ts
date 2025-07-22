import { useQuery } from "@tanstack/react-query";
import { usersService } from "../../services/users.service";

export const useFindUserFavoritesArticlesQuery = (params?: URLSearchParams) => {
  return useQuery({
    queryKey: ["favorite-articles", params?.toString()],
    queryFn: () => {
      return usersService.find(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
