import api from "@/config/api.client";
import type { LoginFormData } from "@/pages/auth/login/Login-form";
import { buildUrl } from "@/utils/build-url";

const BASE_URL = "/auth";

const login = ({ email, password }: LoginFormData) => {
  return api.post(`${BASE_URL}/login`, { email, password });
};

const verifyMe = () => {
  return api.get(`users/me`);
};

const changePassword = (data) => {
  return api.post(`users/change-password`, data);
};

const logout = () => {
  return api.get(buildUrl(BASE_URL, "logout"));
};

export const authService = {
  login,
  verifyMe,
  logout,
  changePassword,
};
