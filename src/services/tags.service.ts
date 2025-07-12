import api from "@/config/api.client";

import { buildUrl } from "@/utils/build-url";
import type { TagListResponse } from "../types/tags";
const baseUrl = "/tags";

export const find = (params: URLSearchParams): Promise<TagListResponse> => {
  return api.get(baseUrl, { params });
};

export const findOne = (id: string) => {
  return api.get(buildUrl(baseUrl, id));
};

export const create = (tag) => {
  return api.post(baseUrl, tag);
};

export const deleteOne = (id: string) => {
  return api.delete(buildUrl(baseUrl, id));
};

export const updateOne = ({ id, formData }) => {
  return api.put(buildUrl(baseUrl, id), formData);
};

export const tagsService = {
  find,
  create,
  deleteOne,
  findOne,
  updateOne,
};
