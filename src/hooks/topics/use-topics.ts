import { useQuery } from "@tanstack/react-query";
import { topicsService } from "../../services/topics.service";

export const useFindTopicsQuery = (params: Record<string, string>) => {
  return useQuery({
    queryKey: ["topics", params],
    queryFn: () => {
      return topicsService.find(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
