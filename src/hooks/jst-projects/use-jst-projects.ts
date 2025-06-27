import { useQuery } from "@tanstack/react-query";
import { jstProjectsService } from "../../services/jst-projects.service";

export const useFindJstProjectsQuery = (params) => {
  return useQuery({
    queryKey: ["jst-projects"],
    queryFn: () => {
      return jstProjectsService.find(params);
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
