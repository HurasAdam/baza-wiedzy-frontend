import { useQuery } from "@tanstack/react-query";

import { tagsService } from "../../services/tags.service";

export const useFindTagsQuery = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: () => {
      return tagsService.find(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
