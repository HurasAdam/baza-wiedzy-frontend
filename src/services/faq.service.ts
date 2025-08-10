import api from "@/config/api.client";

const BASE_URL = "/faq";

const create = (payload) => {
  return api.post(`${BASE_URL}`, payload);
};

const find = () => {
  return api.get(`${BASE_URL}`);
};

const findOne = (faqId: string) => {
  return api.get(`${BASE_URL}/${faqId}`);
};
export const faqService = {
  create,
  find,
  findOne,
};
