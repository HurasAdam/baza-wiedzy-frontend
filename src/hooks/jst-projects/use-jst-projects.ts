import { useMutation, useQuery } from "@tanstack/react-query";
import type { JstProjectForm } from "../../components/jst-project/jst-project-modal";
import { jstProjectsService } from "../../services/jst-projects.service";

export const useCreateJstProjectMutation = () => {
  return useMutation({
    mutationFn: (data: JstProjectForm) => jstProjectsService.create(data),
  });
};

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
