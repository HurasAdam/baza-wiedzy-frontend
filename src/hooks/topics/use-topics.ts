import { useMutation, useQuery } from "@tanstack/react-query";
import type { topicForm } from "../../components/topic/topic-modal";
import { topicsService } from "../../services/topics.service";

export const useCreateTopicMutation = () => {
  return useMutation({
    mutationFn: (data: topicForm) => topicsService.create(data),
  });
};

export const useFindTopicsQuery = (params: URLSearchParams) => {
  return useQuery({
    queryKey: ["topics", params.toString()],
    queryFn: () => {
      return topicsService.find(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
