import api from "@/config/api.client";
import type { IJstProject } from "../types";

const BASE_URL = "/projects";

const find = (): Promise<IJstProject[]> => {
  return api.get(BASE_URL);
};

export const jstProjectsService = {
  find,
};
