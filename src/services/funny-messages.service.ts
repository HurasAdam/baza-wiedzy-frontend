import api from "@/config/api.client";
import type { FunnyMessageForm } from "../components/funny-messages/funny-message-modal";
import type { FindFunnyMessagesResponse, IFunnyMessage } from "../types/funny-message";

const BASE_URL = "/funny-messages";

const create = async (formData: FunnyMessageForm) => {
  return api.post(BASE_URL, formData);
};

const find = (params?: URLSearchParams): Promise<FindFunnyMessagesResponse> => {
  return api.get(BASE_URL, { params });
};

const findOne = (messageId: string): Promise<IFunnyMessage> => {
  return api.get(`${BASE_URL}/${messageId}`);
};

const updateOne = (messageId: string, formData) => {
  return api.patch(`${BASE_URL}/${messageId}`, formData);
};

const deleteOne = (messageId: string) => {
  return api.delete(`${BASE_URL}/${messageId}`);
};

export const funnyMessagesService = {
  create,
  find,
  findOne,
  updateOne,
  deleteOne,
};
