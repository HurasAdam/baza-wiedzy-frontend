import api from "@/config/api.client";

const baseUrl = "/pinned-links";

export const create = (data: unknown) => {
  return api.post(baseUrl, data);
};

export const find = () => {
  return api.get(baseUrl);
};
export const findOne = (pinnedLinkId: string) => {
  return api.get(`${baseUrl}/${pinnedLinkId}`);
};

export const updateOne = (pinnedLinkId: string, payload: unknown) => {
  return api.patch(`${baseUrl}/${pinnedLinkId}`, payload);
};

export const deleteOne = (pinnedLinkId: string) => {
  return api.delete(`${baseUrl}/${pinnedLinkId}`);
};

export const pinnedLinksService = {
  create,
  find,
  findOne,
  updateOne,
  deleteOne,
};
