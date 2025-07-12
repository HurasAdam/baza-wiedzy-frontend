import type { IProduct } from "./product";
import type { ProductCategory } from "./product-category";
import type { Tag } from "./tags";

export interface Article {
  _id: string;
  title: string;
  tags: Tag[];
  isVerified: boolean;
  createdBy: {
    _id: string;
    name: string;
    surname: string;
  };
  clientDescription?: string;
  employeeDescription?: string;
  viewsCounter: number;
  isTrashed: boolean;
  product: IProduct;
  category: ProductCategory;
  createdAt: string;
  isFavourite: boolean;
}
