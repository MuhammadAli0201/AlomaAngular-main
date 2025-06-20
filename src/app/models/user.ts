import { UserRole } from "./user-roles";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  usernumber: string;
  email: string;
  password: string;
  role: string;
  token: string;
  userRole?: UserRole; 
}