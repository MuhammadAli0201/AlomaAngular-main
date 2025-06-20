import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Maternal } from '../models/maternal';

@Injectable({
  providedIn: 'root'
})
export class MaternalService {
  private baseUrl = "https://localhost:7008/api/Maternal";

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }
 
  createOrUpdateMaternal(m: Maternal): Observable<Maternal> {
    return this.http.post<Maternal>(
      this.baseUrl,
      m,
      { headers: this.getAuthHeaders() }
    );
  }
 
  getAllMaternals(): Observable<Maternal[]> {
    return this.http.get<Maternal[]>(
      this.baseUrl,
      { headers: this.getAuthHeaders() }
    );
  }
 
  getMaternalById(id: string): Observable<Maternal> {
    return this.http.get<Maternal>(
      `${this.baseUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
 
  getMaternalByPatientId(id: string): Observable<Maternal> {
    return this.http.get<Maternal>(
      `${this.baseUrl}/patientId/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
