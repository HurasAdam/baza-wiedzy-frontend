import api from "@/config/api.client";
import type {
  IProductCategory,
  ProductCategory,
} from "../types/product-category";
import type { ProductCategoryFormData } from "@/validation/product-category.schema";

const baseUrl = "/categories";

const create = async (productId: string, formData: ProductCategoryFormData) => {
  return api.post(`${baseUrl}/${productId}/create`, formData);
};

const find = (params?: URLSearchParams): Promise<[]> => {
  return api.get(baseUrl, { params });
};
const findOne = (categoryId: string): Promise<IProductCategory> => {
  return api.get(`${baseUrl}/${categoryId}`);
};

const updateOne = (categoryId: string, formData: ProductCategoryFormData) => {
  return api.put(`${baseUrl}/${categoryId}`, formData);
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
  findOne,
  updateOne,
  findByProduct,
};
