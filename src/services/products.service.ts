import api from "@/config/api.client";
import type { IProduct } from "../types/product";
const baseUrl = "/products";

const find = (params?: URLSearchParams): Promise<IProduct[]> => {
  return api.get(baseUrl, { params });
};

export const productsService = {
  find,
};
