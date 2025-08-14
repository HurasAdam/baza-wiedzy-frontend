import { useMutation, useQuery } from "@tanstack/react-query";
import { faqService } from "../../services/faq.service";

export const useCreateFaqMutaton = () => {
  return useMutation({
    mutationFn: (payload) => faqService.create(payload),
  });
};

export const useSetDefaultFaqMutaton = () => {
  return useMutation({
    mutationFn: (faqId: string) => faqService.setDefault(faqId),
  });
};

export const useUpdateFaqMutation = () => {
  return useMutation({
    mutationFn: ({ faqId, data }: { faqId: string; data: {} }) => faqService.updateOne(faqId, data),
  });
};

export const useFindFaqsQuery = (params?: URLSearchParams) => {
  return useQuery({
    queryKey: ["faq", params?.toString()],
    queryFn: () => faqService.find(params),
  });
};

export const useFindFaqQuery = (faqId: string) => {
  return useQuery({
    queryKey: ["faq", faqId],
    queryFn: () => faqService.findOne(faqId),
  });
};
