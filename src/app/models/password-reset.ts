export interface PasswordReset {
  passwordResetId: string;   
  userId: number;
  code: string;              
  createdAtUtc: string;     
  expiresAtUtc: string;      
  isUsed: boolean;
}
