import type { Role } from "./roles";

export interface AuthUserData {
  _id: string;
  name: string;
  surname: string;
  email: string;
  mustChangePassword: boolean;
  verified: boolean;
  profilePicture: string | null;
  isActive: boolean;
  lastLogin: string;
  favourites: string[];
  role: Role;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
