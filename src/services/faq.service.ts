import api from "@/config/api.client";
import type { Faq } from "../types/faq";

const BASE_URL = "/faq";

const create = (payload) => {
  return api.post(`${BASE_URL}`, payload);
};

const find = (): Promise<Faq[]> => {
  return api.get(`${BASE_URL}`);
};

const findOne = (faqId: string): Promise<Faq> => {
  return api.get(`${BASE_URL}/${faqId}`);
};

export const faqService = {
  create,
  find,
  findOne,
};
