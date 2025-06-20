
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../models/user-roles';
import { firstValueFrom } from 'rxjs';
import { OtpVerifyRequest } from '../models/otp-verify-request';
import { PasswordUpdateRequest } from '../models/password-update-request';

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

  updateUserRole(role: UserRole) {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post<UserRole>(`${this.baseUrl}update-role`, role, { headers });
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
}
