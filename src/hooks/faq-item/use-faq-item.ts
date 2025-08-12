import { useMutation, useQuery } from "@tanstack/react-query";
import { faqItemService } from "../../services/faq-item.service";

export const useCreateFaqItemMutaton = () => {
  return useMutation({
    mutationFn: (data: { question: string; answer: string; faqId: string }) => faqItemService.createOne(data),
  });
};

export const useUpdateFaqItemMutaton = () => {
  return useMutation({
    mutationFn: (data: { faqId: string; faqItemId: string; question: string; answer: string }) =>
      faqItemService.updateOne(data),
  });
};

export const useDeleteFaqItemMutaton = () => {
  return useMutation({
    mutationFn: (faqItemId: string) => faqItemService.deleteOne(faqItemId),
  });
};

export const useFindFaqItemQuery = (faqItemId: string) => {
  return useQuery({
    queryKey: ["faq-item", faqItemId],
    queryFn: () => faqItemService.findOne(faqItemId),
  });
};
