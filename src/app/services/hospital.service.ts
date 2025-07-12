import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hospital } from '../models/hospital';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private baseUrl = 'https://localhost:7008/api/Hospital';
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(this.baseUrl);
  }
  
  getById(id: number): Observable<Hospital> {
    return this.http.get<Hospital>(`${this.baseUrl}/${id}`);
  }

  getBySuburbId(suburbId: number): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(`${this.baseUrl}/suburb/${suburbId}`);
  }
  
  create(hospital: Hospital): Observable<Hospital> {
    return this.http.post<Hospital>(this.baseUrl, hospital);
  }
  
  update(id: number, hospital: Hospital): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, hospital);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
