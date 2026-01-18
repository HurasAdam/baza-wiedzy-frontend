import api from "../config/api.client";

const BASE_URL = "/changelog";

const find = () => {
  return api.get(`${BASE_URL}`);
};

export const changelogService = {
  find,
};
