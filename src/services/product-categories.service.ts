import api from "@/config/api.client";
import type { ProductCategory } from "../types/product-category";

const baseUrl = "/categories";

const find = (params?: URLSearchParams): Promise<[]> => {
  return api.get(baseUrl, { params });
};

const findByProduct = (
  params: URLSearchParams,
  id: string
): Promise<ProductCategory[]> => {
  return api.get(`${baseUrl}/product/${id}`, { params });
};

export const productCategoriesService = {
  find,
  findByProduct,
};
