import api from "@/config/api.client";
import type { UsefulLinkForm } from "../components/useful-link/useful-link.modal";

const baseUrl = "/useful-links";

const find = (): Promise<UsefulLinkForm[]> => {
  return api.get(`${baseUrl}`);
};

const deleteOne = (usefulLinkId: string): Promise<void> => {
  return api.delete(`${baseUrl}/${usefulLinkId}`);
};

const createUsefulLink = async (data: { name: string }) => {
  return api.post(baseUrl, data);
};

export const usefulLinksService = {
  createUsefulLink,
  find,
  deleteOne,
};
