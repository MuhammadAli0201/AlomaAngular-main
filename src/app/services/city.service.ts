import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private baseUrl = 'https://localhost:7008/api/City';
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<City[]> {
    return this.http.get<City[]>(this.baseUrl);
  }
  
  getById(id: number): Observable<City> {
    return this.http.get<City>(`${this.baseUrl}/${id}`);
  }

  getByProvinceId(provinceId: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.baseUrl}/province/${provinceId}`);
  }
  
  create(city: City): Observable<City> {
    return this.http.post<City>(this.baseUrl, city);
  }
  
  update(id: number, city: City): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, city);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
