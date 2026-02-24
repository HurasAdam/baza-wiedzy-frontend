import api from "@/config/api.client";

const BASE_URL = "/network-tools";

// params: { domain: string, resolver: string, recordType: string }
const find = (params: { domain: string; resolver: string; recordType: string }) => {
  return api.get(`${BASE_URL}/dns-lookup`, { params });
};

export const networkToolsService = {
  find,
};
