export interface ITopic {
  _id: string;
  title: string;
  product: {
    name: string;
    labelColor: string;
    banner: string;
  };
  createdBy: string;
  __v: number;
}
