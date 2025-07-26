import api from "@/config/api.client";
import { buildUrl } from "../utils/build-url";
const baseUrl = "/users";

export const findUsers = (params?: URLSearchParams): Promise => {
  // title, produst params
  return api.get(buildUrl(baseUrl), { params });
};

export const findMyFavorites = (params?: URLSearchParams): Promise => {
  // title, produst params
  return api.get(buildUrl(baseUrl, "favourites-articles"), { params });
};

export const usersService = {
  findMyFavorites,
  findUsers,
};
