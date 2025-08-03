export interface ProductCategory {
  _id: string;
  name: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}
export interface IProductCategory {
  _id: string;
  name: string;
  createdBy: {
    _id: string;
    name: string;
    surname: string;
  };
  updatedBy: {
    _id: string;
    name: string;
    surname: string;
  } | null;
  productId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
