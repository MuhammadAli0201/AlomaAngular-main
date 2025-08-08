import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuditLog } from '../models/audit-log';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private baseUrl = 'https://localhost:7008/api/AuditLog';
  
  constructor(private http: HttpClient) {}
  
  async getAll() {
    return await firstValueFrom(this.http.get<AuditLog[]>(this.baseUrl));
  }
}
