import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Province } from '../models/province';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  private baseUrl = 'https://localhost:7008/api/Province';
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Province[]> {
    return this.http.get<Province[]>(this.baseUrl);
  }
  
  getById(id: number): Observable<Province> {
    return this.http.get<Province>(`${this.baseUrl}/${id}`);
  }
  
  create(province: Province): Observable<Province> {
    return this.http.post<Province>(this.baseUrl, province);
  }
  
  update(id: number, province: Province): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, province);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
