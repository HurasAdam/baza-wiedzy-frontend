export interface UserSummary {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

export interface IssueReport {
  _id: string;
  title: string;
  description: string;
  createdBy: UserSummary;
  status: "pending" | "resolved" | "in-progress" | "rejected";
  isUnread: boolean;
  type: "bug" | "feature" | "task";
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IssueReportFormData {
  type: "bug" | "proposal";
  title: string;
  category: string;
  description: string;
  file: File[];
}
