import api from "@/config/api.client";

const BASE_URL = "/article-user-flag";

const create = async (formData: unknown) => {
  return api.post(BASE_URL, formData);
};

const findOne = async (
  articleId: string
): Promise<{ selectedFlag: { _id: string; name: string; color: string } | null }> => {
  return api.get(`${BASE_URL}/${articleId}`);
};

const unflagOne = async (articleId: string): Promise<void> => {
  return api.delete(`${BASE_URL}/${articleId}`);
};

export const articleUserFlagService = {
  create,
  findOne,
  unflagOne,
};
