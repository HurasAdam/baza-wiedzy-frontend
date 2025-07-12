export interface Tag {
  _id: string;
  name: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
  isUsed: boolean;
  isDefault?: boolean;
}

export interface TagListResponse {
  tags: Tag[];
  totalCount: number;
}
