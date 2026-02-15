import { useMutation, useQuery } from "@tanstack/react-query";

import { usefulLinkCategoriesService } from "../../services/useful-link-categories.service";

export const useCreateUsefulLinkCategoryMutation = () => {
  return useMutation({
    mutationFn: (data: { name: string }) => usefulLinkCategoriesService.createUsefulLinkCategory(data),
  });
};

export const useFindusefulLinksCategoriesQuery = () => {
  return useQuery({
    queryKey: ["useful-link-categories"],
    queryFn: () => usefulLinkCategoriesService.find(),
  });
};
