import api from "@/config/api.client";
import { buildUrl } from "../utils/build-url";
const baseUrl = "/users";
const adminBaseUrl = "/admin/users";

export const findUsers = (params?: URLSearchParams): Promise => {
  // title, produst params
  return api.get(buildUrl(baseUrl), { params });
};

export const findMyFavorites = (params?: URLSearchParams): Promise => {
  // title, produst params
  return api.get(buildUrl(baseUrl, "favourites-articles"), { params });
};

export const resetUserPassword = (userId: string): Promise<void> => {
  return api.post(`${adminBaseUrl}/${userId}/reset-password`);
};

export const usersService = {
  findMyFavorites,
  findUsers,
  resetUserPassword,
};
