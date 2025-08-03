import { useMutation, useQuery } from "@tanstack/react-query";

import { productCategoriesService } from "../../services/product-categories.service";
import type { ProductCategoryFormData } from "@/validation/product-category.schema";

export const useCreateProductCategorytMutation = () => {
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: ProductCategoryFormData;
    }) => productCategoriesService.create(productId, data),
  });
};

export const useFindProductCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return productCategoriesService.find();
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};

export const useFindCategoriesByProductQuery = (productId?: string | null) => {
  return useQuery({
    queryKey: ["categories-by-product", productId],
    queryFn: () => {
      return productCategoriesService.findByProduct({}, productId!);
    },
    enabled: !!productId,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
