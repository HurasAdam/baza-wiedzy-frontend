import api from "@/config/api.client";
import { buildUrl } from "@/utils/build-url";

const BASE_URL = "/auth";

const login = ({ email, password }) => {
  return api.post(`${BASE_URL}/login`, { email, password });
};

const verifyMe = () => {
  return api.get(`users/me`);
};

const logout = () => {
  return api.get(buildUrl(BASE_URL, "logout"));
};

export const authService = {
  login,
  verifyMe,
  logout,
};
