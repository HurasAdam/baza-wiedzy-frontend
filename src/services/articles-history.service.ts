import api from "@/config/api.client";
import { buildUrl } from "@/utils/build-url";

const baseUrl = "/articles-history";

export const findArticleHistory = ({ id }: { id: string }) => {
  return api.get(buildUrl(baseUrl, "article", id));
};

export const articlesHistoryService = {
  findArticleHistory,
};
