import api from "@/config/api.client";

export type DNSRecords = {
  A?: string[];
  CNAME?: string[];
  MX?: { exchange: string; priority: number }[];
  NS?: string[];
  SOA?: {
    nsname: string;
    hostmaster: string;
    serial: number;
    refresh: number;
    retry: number;
    expire: number;
    minttl: number;
  };
  TXT?: string[][];
};

const BASE_URL = "/network-tools";

// params: { domain: string, resolver: string, recordType: string }
const find = (params: { domain: string; resolver: string; recordType: string }): Promise<DNSRecords> => {
  return api.get(`${BASE_URL}/dns-lookup`, { params });
};

export const networkToolsService = {
  find,
};
