import { useQuery } from "@tanstack/react-query";
import { jstProjectsService } from "../../services/jst-projects.service";

export const useFindJstProjectsQuery = () => {
  return useQuery({
    queryKey: ["jst-projects"],
    queryFn: () => {
      return jstProjectsService.find();
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
