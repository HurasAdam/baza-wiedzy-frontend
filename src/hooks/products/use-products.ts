import { useQuery } from "@tanstack/react-query";
import { productsService } from "../../services/products.service";

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
