import api from "@/config/api.client";
import type { Faq } from "../types/faq";

const BASE_URL = "/faq";

const create = (payload) => {
  return api.post(`${BASE_URL}`, payload);
};

const find = (params?: URLSearchParams): Promise<Faq[]> => {
  return api.get(`${BASE_URL}`, { params });
};

const findOne = (faqId: string): Promise<Faq> => {
  return api.get(`${BASE_URL}/${faqId}`);
};

const setDefault = (faqId: string): Promise<void> => {
  return api.patch(`${BASE_URL}/${faqId}/set-default`);
};

const updateOne = (faqId: string, payload): Promise<void> => {
  return api.patch(`${BASE_URL}/${faqId}`, payload);
};

export const faqService = {
  create,
  find,
  findOne,
  setDefault,
  updateOne,
};
