import { useMutation, useQuery } from "@tanstack/react-query";
import type { JstProjectForm } from "../../components/jst-project/jst-project-modal";
import { jstProjectsService } from "../../services/jst-projects.service";
import type { JstProjectFormData } from "@/components/jst-project/jst-project-form";

export const useCreateJstProjectMutation = () => {
  return useMutation({
    mutationFn: (data: JstProjectForm) => jstProjectsService.create(data),
  });
};

export const useUpdateJstProjectMutation = () => {
  return useMutation({
    mutationFn: ({
      jstProjectId,
      data,
    }: {
      jstProjectId: string;
      data: JstProjectFormData;
    }) => jstProjectsService.updateOne(jstProjectId, data),
  });
};

export const useFindJstProjectQuery = (jstProjectId: string) => {
  return useQuery({
    queryKey: ["jst-project", jstProjectId],
    queryFn: () => {
      return jstProjectsService.findOne(jstProjectId);
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindJstProjectsQuery = (params: URLSearchParams) => {
  return useQuery({
    queryKey: ["jst-projects", params.toString()],
    queryFn: () => {
      return jstProjectsService.find(params);
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
