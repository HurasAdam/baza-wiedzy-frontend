import { useMutation, useQuery } from "@tanstack/react-query";
import type { UpdateFunnyMessageFormData } from "../../components/funny-messages/edit-funny-message-modal";
import type { FunnyMessageForm } from "../../components/funny-messages/funny-message-modal";
import { funnyMessagesService } from "../../services/funny-messages.service";

export const useCreateFunnyMessageMutation = () => {
  return useMutation({
    mutationFn: (data: FunnyMessageForm) => funnyMessagesService.create(data),
  });
};

export const useFindFunnyMessagesQuery = (filerParams) => {
  return useQuery({
    queryKey: ["funny-messages", filerParams],
    queryFn: () => {
      return funnyMessagesService.find(filerParams);
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindFunnyMessageQuery = (messageId: string) => {
  return useQuery({
    queryKey: ["funny-message", messageId],
    queryFn: () => {
      return funnyMessagesService.findOne(messageId);
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useUpdateOneFunnyMessageMutation = () => {
  return useMutation({
    mutationFn: ({ messageId, data }: { messageId: string; data: UpdateFunnyMessageFormData }) =>
      funnyMessagesService.updateOne(messageId, data),
  });
};

export const useDeleteOneFunnyMessageMutation = () => {
  return useMutation({
    mutationFn: (messageId: string) => funnyMessagesService.deleteOne(messageId),
  });
};
