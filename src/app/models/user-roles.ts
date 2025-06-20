import { User } from "./user";

export interface UserRole {
  userRoleId: string; 
  userId: number;
  approved: boolean;
  user?: User;  
}