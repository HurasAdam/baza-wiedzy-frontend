import { useQuery } from "@tanstack/react-query";

import { tagsService } from "../../services/tags.service";

export const useFindTagsQuery = (params?: URLSearchParams) => {
  return useQuery({
    queryKey: ["tags", params ? params.toString() : "all"],

    queryFn: () => {
      return tagsService.find(params || undefined);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
