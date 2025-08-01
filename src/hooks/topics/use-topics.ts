import { useMutation, useQuery } from "@tanstack/react-query";
import type { topicForm } from "../../components/topic/topic-modal";
import { topicsService } from "../../services/topics.service";
import type { topicFormData } from "@/components/topic/edit-topic.modal";

export const useCreateTopicMutation = () => {
  return useMutation({
    mutationFn: (data: topicForm) => topicsService.create(data),
  });
};

export const useUpdateTopicMutation = () => {
  return useMutation({
    mutationFn: ({ topicId, data }: { topicId: string; data: topicFormData }) =>
      topicsService.updateOne(topicId, data),
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

export const useFindTopicQuery = (topicId: string) => {
  return useQuery({
    queryKey: ["topic", topicId],
    queryFn: () => {
      return topicsService.findOne(topicId);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
