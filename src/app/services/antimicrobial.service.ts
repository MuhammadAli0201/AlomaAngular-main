import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Antimicrobial {
  antimicrobialID: number;
  antimicrobialName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AntimicrobialService {
  private baseUrl = 'https://localhost:7008/api/Antimicrobial';
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Antimicrobial[]> {
    return this.http.get<Antimicrobial[]>(this.baseUrl);
  }
  
  getById(id: number): Observable<Antimicrobial> {
    return this.http.get<Antimicrobial>(`${this.baseUrl}/${id}`);
  }
  
  create(antimicrobial: Antimicrobial): Observable<Antimicrobial> {
    return this.http.post<Antimicrobial>(this.baseUrl, antimicrobial);
  }
  
  update(id: number, antimicrobial: Antimicrobial): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, antimicrobial);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
