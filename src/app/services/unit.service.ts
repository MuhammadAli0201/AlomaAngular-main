import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '../models/unit';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private baseUrl = 'https://localhost:7008/api/Unit';
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.baseUrl);
  }
  
  getById(id: number): Observable<Unit> {
    return this.http.get<Unit>(`${this.baseUrl}/${id}`);
  }
  
  create(unit: Unit): Observable<Unit> {
    return this.http.post<Unit>(this.baseUrl, unit);
  }
  
  update(id: number, unit: Unit): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, unit);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
