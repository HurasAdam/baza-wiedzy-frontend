import api from "@/config/api.client";
import { buildUrl } from "@/utils/build-url";
import type { Tag, TagListResponse } from "../types/tags";
import type { TagFormData } from "@/components/tag/tag-form";
const baseUrl = "/tags";

export const find = (params?: URLSearchParams): Promise<TagListResponse> => {
  return api.get(baseUrl, { params });
};

export const findOne = (id: string): Promise<Tag> => {
  return api.get(buildUrl(baseUrl, id));
};

export const create = (data: TagFormData) => {
  return api.post(baseUrl, data);
};

export const deleteOne = (id: string) => {
  return api.delete(buildUrl(baseUrl, id));
};

export const updateOne = ({
  id,
  formData,
}: {
  id: string;
  formData: TagFormData;
}) => {
  return api.put(buildUrl(baseUrl, id), formData);
};

export const tagsService = {
  find,
  create,
  deleteOne,
  findOne,
  updateOne,
};
