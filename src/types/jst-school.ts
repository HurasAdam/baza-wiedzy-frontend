import type { JstSchoolForm } from "../components/jst-school/jst-school-modal";

export interface IJstSchool {
  _id: string;
  name: string;
  adres: string;
  email: string;
  project: string;
  szId: string;
  libId: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export type JstSchoolCreateData = Omit<JstSchoolForm, "jstProjectId">;
