import { useMutation, useQuery } from "@tanstack/react-query";
import type { ProductForm } from "../../components/product/product-modal";
import { productsService } from "../../services/products.service";

export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: (data: ProductForm) => productsService.create(data),
  });
};
export const useFindProductsQuery = (params?: URLSearchParams | null) => {
  return useQuery({
    queryKey: ["products", params ? params.toString() : "all"],
    queryFn: () => {
      return productsService.find(params || undefined);
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
};
