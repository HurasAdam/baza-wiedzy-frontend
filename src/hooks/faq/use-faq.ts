import { useMutation, useQuery } from "@tanstack/react-query";
import { faqService } from "../../services/faq.service";

export const useCreateFaqMutaton = () => {
  return useMutation({
    mutationFn: (payload) => faqService.create(payload),
  });
};

export const useFindFaqsQuery = () => {
  return useQuery({
    queryKey: ["faq"],
    queryFn: () => faqService.find(),
  });
};

export const useFindFaqQuery = (faqId: string) => {
  return useQuery({
    queryKey: ["faq", faqId],
    queryFn: () => faqService.findOne(faqId),
  });
};
