export interface Role {
  _id: string;
  name: string;
  iconKey: string; // lub można zrobić enum, jeśli chcesz ograniczyć wartości
  labelColor: string;
  __v: number;
}
