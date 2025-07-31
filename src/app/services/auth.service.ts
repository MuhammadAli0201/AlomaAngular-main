
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../models/user-roles';
import { firstValueFrom } from 'rxjs';
import { OtpVerifyRequest } from '../models/otp-verify-request';
import { PasswordUpdateRequest } from '../models/password-update-request';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "https://localhost:7008/api/User/"

  constructor(private http: HttpClient, private router: Router) { }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  storeRole(roleValue: string) {
    localStorage.setItem('role', roleValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }


  getCurrentUser() {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.get<any>(`${this.baseUrl}me`, { headers });
  }

  async userRoles(): Promise<UserRole[]> {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return await firstValueFrom(this.http.get<UserRole[]>(`${this.baseUrl}roles`, { headers }));
  }

  async getUsersByRoleAndVerifiedMonth(role: string, month: number): Promise<User[]> {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return await firstValueFrom(this.http.get<User[]>(`${this.baseUrl}role/${role}/admission-date/${month}`, { headers }));
  }

  updateUserRole(role: UserRole) {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post<UserRole>(`${this.baseUrl}update-role`, role, { headers });
  }

  async updateUserProfile(user: User) {
    console.log("Inside save user")
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return await firstValueFrom(this.http.put<any>(`${this.baseUrl}`, user, { headers }));
  }

  UploadProfilePic(formData: FormData) {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post(`${this.baseUrl}upload-profile-pic`, formData, { headers });
  }

  sendOtp(email: string) {
    return this.http.post<any>(`${this.baseUrl}send-otp`, { email });
  }

  verifyOtp(otp: OtpVerifyRequest) {
    return this.http.post<any>(`${this.baseUrl}verify-otp`, otp);
  }

  updatePassword(model: PasswordUpdateRequest) {
    return this.http.post<any>(`${this.baseUrl}update-password`, model);
  }

  getOtpTimer() {
    return this.http.get<{ Timer: string }>(`${this.baseUrl}system/otp-timer`);
  }

  updateOtpTimer(minutes: number) {
    return this.http.post(`${this.baseUrl}system/otp-timer`, minutes);
  }


}
