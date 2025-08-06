export interface IProduct {
  _id: string;
  name: string;
  labelColor: string;
  banner: string;
  articlesCount: number;

  createdBy: {
    name: string;
    surname: string;
  };
  createdAt: string;
  updatedAt: string;
}
