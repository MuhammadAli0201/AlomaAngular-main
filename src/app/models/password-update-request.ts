export interface PasswordUpdateRequest {
  email: string;
  code: string;
  newPassword: string;
}