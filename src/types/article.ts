import type { IProduct } from "./product";
import type { ProductCategory } from "./product-category";
import type { Tag } from "./tags";

export interface Article {
  _id: string;
  title: string;
  tags: Tag[];
  isVerified: boolean;
  updatedAt: string;
  createdBy: {
    _id: string;
    name: string;
    surname: string;
  };
  clientDescription?: string;
  verifiedBy?: {
    _id: string;
    name: string;
    surname: string;
    isActive: boolean;
  };
  employeeDescription?: string;
  viewsCounter: number;
  isTrashed: boolean;
  product: IProduct;
  category: ProductCategory;
  createdAt: string;
  isFavourite: boolean;
}

export interface ArticleListItem {
  _id: string;
  title: string;
  tags: Tag[];
  isVerified: boolean;
  status: "approved" | "rejected" | "pending";
  rejectionReason: string | null;
  rejectedBy: string | null;
  createdBy: {
    _id: string;
    name: string;
    surname: string;
  };
  viewsCounter: number;
  isTrashed: boolean;
  product: IProduct;
  category: ProductCategory;
  createdAt: string;
  isFavourite: boolean;
}

export type ToggleFavouriteResponse = {
  message: string;
};
