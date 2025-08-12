import api from "@/config/api.client";
import type { FaqItemResponse } from "../types/faq";

const BASE_URL = "/faq-item";

const createOne = ({
  faqId,
  question,
  answer,
}: {
  faqId: string;
  question: string;
  answer: string;
}): Promise<FaqItemResponse> => {
  return api.post(`${BASE_URL}/${faqId}`, { question, answer });
};

const findOne = (faqItemId: string): Promise<FaqItemResponse> => {
  return api.get(`${BASE_URL}/${faqItemId}`);
};

const updateOne = (data: { question: string; answer: string; faqItemId: string }): Promise<void> => {
  const { question, answer, faqItemId } = data;
  return api.put(`${BASE_URL}/${faqItemId}`, { question, answer });
};

const deleteOne = (faqItemId: string): Promise<void> => {
  return api.delete(`${BASE_URL}/${faqItemId}`);
};

export const faqItemService = {
  createOne,
  findOne,
  updateOne,
  deleteOne,
};
