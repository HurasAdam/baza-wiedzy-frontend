import api from "@/config/api.client";

const BASE_URL = "/auth";

const login = ({ email, password }) => {
  return api.post(`${BASE_URL}/login`, { email, password });
};

const verifyMe = () => {
  return api.get(`users/me`);
};

export const authService = {
  login,
  verifyMe,
};
