import { useMutation, useQuery } from "@tanstack/react-query";
import type { topicForm } from "../../components/topic/topic-modal";
import { topicsService } from "../../services/topics.service";

export const useCreateTopicMutation = () => {
  return useMutation({
    mutationFn: (data: topicForm) => topicsService.create(data),
  });
};

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
