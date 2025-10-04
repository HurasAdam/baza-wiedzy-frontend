import { useMutation, useQuery } from "@tanstack/react-query";
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
