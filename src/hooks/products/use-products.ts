import { useMutation, useQuery } from "@tanstack/react-query";
import type { ProductForm } from "../../components/product/product-modal";
import { productsService } from "../../services/products.service";

export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: (data: ProductForm) => productsService.create(data),
  });
};

export const useFindProductsQuery = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return productsService.find();
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
