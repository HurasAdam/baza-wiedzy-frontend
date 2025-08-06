import {
  useMutation,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { ProductForm } from "../../components/product/product-modal";
import { productsService } from "../../services/products.service";
import type { IProduct } from "../../types/product";

export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: (data: ProductForm) => productsService.create(data),
  });
};
export const useUpdateProductMutation = () => {
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: ProductForm;
    }) => productsService.updateOne({ productId, data }),
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

export const useFindProductQuery = (
  productId: string,
  options?: Omit<
    UseQueryOptions<IProduct, Error, IProduct, [string, string]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => productsService.findOne(productId),
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
    ...options,
  });
};
