import api from "@/config/api.client";

const BASE_URL = "/faq-item";

const deleteOne = (faqItemId: string): Promise<void> => {
  return api.delete(`${BASE_URL}/${faqItemId}`);
};

export const faqItemService = {
  deleteOne,
};
