export interface Role {
  _id: string;
  name: string;
  iconKey: string; // lub można zrobić enum, jeśli chcesz ograniczyć wartości
  labelColor: string;
  __v: number;
  permissions: string[];
}

export interface RoleFormData {
  permissions: string[];
  name: string;
  iconKey: string;
  labelColor: string;
}

export interface IPermission {
  key: string;
  label: string;
  category: string;
}
