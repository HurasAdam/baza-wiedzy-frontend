import api from "@/config/api.client";

const baseUrl = "/useful-link-categories";

const find = () => {
  return api.get(`${baseUrl}`);
};

const createUsefulLinkCategory = async (data: { name: string }) => {
  return api.post(baseUrl, data);
};

export const usefulLinkCategoriesService = {
  createUsefulLinkCategory,
  find,
};
