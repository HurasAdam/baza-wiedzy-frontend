import api from "@/config/api.client";
const baseUrl = "/system/storage";

export const find = () => {
  return api.get(baseUrl);
};

export const serverStorageService = {
  find,
};
