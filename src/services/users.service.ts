import api from "@/config/api.client";
import type { Role } from "@/types/roles";
import { buildUrl } from "../utils/build-url";
const baseUrl = "/users";
const adminBaseUrl = "/admin";

export const findUsers = (params?: URLSearchParams): Promise => {
  // title, produst params
  return api.get(buildUrl(baseUrl), { params });
};

export const findAdmins = (params?: URLSearchParams) => {
  return api.get(`${adminBaseUrl}/admins`, { params });
};

export const findRoles = (params?: URLSearchParams): Promise<Role[]> => {
  return api.get(`${adminBaseUrl}/roles`, { params });
};

export const createRole = (
  permissions: string[],
  name: string,
  iconKey: string,
  labelColor: string
) => {
  return api.post(`${adminBaseUrl}/roles/create`, {
    permissions,
    name,
    iconKey,
    labelColor,
  });
};

export const findMyFavorites = (params?: URLSearchParams): Promise => {
  // title, produst params
  return api.get(buildUrl(baseUrl, "favourites-articles"), { params });
};

export const resetUserPassword = (userId: string): Promise<void> => {
  return api.post(`${adminBaseUrl}/${baseUrl}/${userId}/reset-password`);
};

export const disableUserAccount = (userId: string): Promise<void> => {
  return api.post(`${adminBaseUrl}/${baseUrl}/${userId}/disable`);
};
export const enableUserAccount = (userId: string): Promise<void> => {
  return api.post(`${adminBaseUrl}/${baseUrl}/${userId}/enable`);
};

export const usersService = {
  findMyFavorites,
  findUsers,
  resetUserPassword,
  disableUserAccount,
  enableUserAccount,
  findAdmins,
  findRoles,
  createRole,
};
