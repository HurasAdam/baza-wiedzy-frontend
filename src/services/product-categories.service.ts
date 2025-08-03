import api from "@/config/api.client";
import type { ProductCategory } from "../types/product-category";
import type { ProductCategoryFormData } from "@/validation/product-category.schema";

const baseUrl = "/categories";

const create = async (productId: string, formData: ProductCategoryFormData) => {
  return api.post(`${baseUrl}/${productId}/create`, formData);
};

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
  create,
  find,
  findByProduct,
};
