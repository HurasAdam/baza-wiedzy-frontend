import api from "@/config/api.client";
import { buildUrl } from "../utils/build-url";
const baseUrl = "/statistics";

export const findAllUsersStatistics = (params?: URLSearchParams) => {
  //
  return api.get(buildUrl(baseUrl, "users"), { params });
};

export const findMyStatistics = (userId: string) => {
  return api.get(`${baseUrl}/${userId}`);
};

export const userStatisticsService = {
  findAllUsersStatistics,
  findMyStatistics,
};
