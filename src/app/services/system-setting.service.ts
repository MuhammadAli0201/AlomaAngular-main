import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SystemSetting } from '../models/system-setting';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingService {
private baseUrl = 'https://localhost:7008/api/systemsetting';
  
  constructor(private http: HttpClient) {}
  
  async getBykey(key: string){
    return await firstValueFrom(this.http.get<SystemSetting>(`${this.baseUrl}/${key}`));
  }
  
  async update(key: string, systemsetting: SystemSetting){
    return await firstValueFrom(this.http.put<void>(`${this.baseUrl}/${key}`, systemsetting));
  }
}
