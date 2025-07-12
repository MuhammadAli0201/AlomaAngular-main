import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Suburb } from '../models/suburb';

@Injectable({
  providedIn: 'root'
})
export class SuburbService {
  private baseUrl = 'https://localhost:7008/api/Suburb';
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Suburb[]> {
    return this.http.get<Suburb[]>(this.baseUrl);
  }
  
  getById(id: number): Observable<Suburb> {
    return this.http.get<Suburb>(`${this.baseUrl}/${id}`);
  }

  getByCityId(cityId: number): Observable<Suburb[]> {
    return this.http.get<Suburb[]>(`${this.baseUrl}/city/${cityId}`);
  }
  
  create(suburb: Suburb): Observable<Suburb> {
    return this.http.post<Suburb>(this.baseUrl, suburb);
  }
  
  update(id: number, suburb: Suburb): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, suburb);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
