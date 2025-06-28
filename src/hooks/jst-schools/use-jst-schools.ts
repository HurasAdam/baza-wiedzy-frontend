import { useQuery } from "@tanstack/react-query";
import { jstSchoolsService } from "../../services/jst-schools.service";

export const useFindJstSchoolsQuery = (
  projectId: string | null,
  params: Record<string, string>
) => {
  return useQuery({
    queryKey: ["jst-schools", projectId, params],
    queryFn: () => {
      return jstSchoolsService.find(projectId, params);
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
