import { useMutation, useQuery } from "@tanstack/react-query";
import type { JstSchoolForm } from "../../components/jst-school/jst-school-modal";
import { jstSchoolsService } from "../../services/jst-schools.service";

export const useCreateJstSchoolMutation = () => {
  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: JstSchoolForm;
    }) => jstSchoolsService.create(projectId, data),
  });
};

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
