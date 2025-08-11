import { useMutation } from "@tanstack/react-query";
import { faqItemService } from "../../services/faq-item.service";

export const useDeleteFaqItemMutaton = () => {
  return useMutation({
    mutationFn: (faqItemId: string) => faqItemService.deleteOne(faqItemId),
  });
};
