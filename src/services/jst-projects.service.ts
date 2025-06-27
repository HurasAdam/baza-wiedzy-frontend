import api from "@/config/api.client";

const BASE_URL = "/projects";

const find = (params: URLSearchParams) => {
  return api.get(BASE_URL, { params });
};

export const jstProjectsService = {
  find,
};
