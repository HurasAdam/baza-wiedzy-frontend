import api from "@/config/api.client";
import type { ProductForm } from "../components/product/product-modal";
import type { IProduct } from "../types/product";
const baseUrl = "/products";

const create = (data: ProductForm) => {
  return api.post(baseUrl, data);
};

const find = (params?: URLSearchParams): Promise<IProduct[]> => {
  return api.get(baseUrl, { params });
};

export const productsService = {
  create,
  find,
};
