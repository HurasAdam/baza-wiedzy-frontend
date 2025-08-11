export interface Faq {
  _id: string;
  title: string;
  description: string;
  slug: string;
  labelColor: string;
  isDefault: boolean;
  iconKey: string;
  createdBy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: FaqItem[];
  __v: number;
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
}
