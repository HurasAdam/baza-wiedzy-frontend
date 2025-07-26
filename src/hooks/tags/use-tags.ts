import { useQuery } from "@tanstack/react-query";

import { tagsService } from "../../services/tags.service";

export const useFindTagsQuery = (params: URLSearchParams) => {
  return useQuery({
    queryKey: ["tags", params.toString()],
    queryFn: () => {
      return tagsService.find(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
