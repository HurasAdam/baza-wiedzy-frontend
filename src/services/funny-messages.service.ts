import api from "@/config/api.client";
import type { FunnyMessageForm } from "../components/funny-messages/funny-message-modal";
import type { FindFunnyMessagesResponse } from "../types/funny-message";

const BASE_URL = "/funny-messages";

const create = async (formData: FunnyMessageForm) => {
  return api.post(BASE_URL, formData);
};

const find = (): Promise<FindFunnyMessagesResponse> => {
  return api.get(BASE_URL);
};

export const funnyMessagesService = {
  create,
  find,
};
