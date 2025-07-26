import { useMutation, useQuery } from "@tanstack/react-query";
import type { ProductForm } from "../../components/product/product-modal";
import { productsService } from "../../services/products.service";

export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: (data: ProductForm) => productsService.create(data),
  });
};

export const useFindProductsQuery = (params: URLSearchParams) => {
  return useQuery({
    queryKey: ["products", params.toString()],
    queryFn: () => {
      return productsService.find(params);
    },

    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
