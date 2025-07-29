import { useMutation, useQuery } from "@tanstack/react-query";

import { tagsService } from "../../services/tags.service";
import type { TagFormData } from "@/components/tag/tag-form";

export const useCreateTagMutation = () => {
  return useMutation({
    mutationFn: (data: TagFormData) => {
      return tagsService.create(data);
    },
  });
};

export const useUpdateTagMutation = () => {
  return useMutation({
    mutationFn: ({ tagId, data }: { tagId: string; data: TagFormData }) => {
      return tagsService.updateOne({ id: tagId, formData: data });
    },
  });
};

export const useFindTagQuery = (tagId: string) => {
  return useQuery({
    queryKey: ["tag", tagId],

    queryFn: () => {
      return tagsService.findOne(tagId);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindTagsQuery = (params?: URLSearchParams) => {
  return useQuery({
    queryKey: ["tags", params ? params.toString() : "all"],

    queryFn: () => {
      return tagsService.find(params || undefined);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
