export interface IFunnyMessageEntry {
  author: "KLIENT" | "PRACOWNIK";
  content: string;
}

export interface IFunnyMessage {
  _id: string;
  title: string;
  type: "single" | "dialog";
  entries: IFunnyMessageEntry[];
  createdBy: {
    _id: string;
    name: string;
    surname: string;
  };
  isTrashed?: boolean;
  isVerified?: boolean;
  createdAt: string;

  updatedAt?: string;
}

export interface FindFunnyMessagesResponse {
  data: IFunnyMessage[];
  pagination: {
    total: number;
    pages: number | null;
  };
}
