import api from "@/config/api.client";

const BASE_URL = "/logs";

const find = () => {
  return api.get(`${BASE_URL}/`);
};

export const logService = {
  find,
};
