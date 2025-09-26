import api from "@/config/api.client";
import { buildUrl } from "../utils/build-url";
const baseUrl = "/statistics";

export const findAllUsersStatistics = (params?: URLSearchParams) => {
  //
  return api.get(buildUrl(baseUrl, "users"), { params });
};

export const findUserAddedArticles = ({
  userId,
  startDate,
  endDate,
}: {
  userId: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  return api.get(buildUrl(baseUrl, `users`, `${userId}`, `articles`, "added"), {
    params: {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    },
  });
};

export const findUserEditedArticles = ({
  userId,
  startDate,
  endDate,
}: {
  userId: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  return api.get(buildUrl(baseUrl, `users`, `${userId}`, `articles`, "edited"), {
    params: {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    },
  });
};

export const findUserAddedConversationReports = ({
  userId,
  startDate,
  endDate,
}: {
  userId: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  return api.get(buildUrl(baseUrl, `users`, `${userId}`, `conversationReports`), {
    params: {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    },
  });
};

export const findMyStatistics = (userId: string) => {
  return api.get(`${baseUrl}/${userId}`);
};

export const userStatisticsService = {
  findAllUsersStatistics,
  findUserAddedArticles,
  findUserEditedArticles,
  findUserAddedConversationReports,
  findMyStatistics,
};
