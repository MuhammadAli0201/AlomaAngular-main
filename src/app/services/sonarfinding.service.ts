import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SonarFinding {
  sonarFindingID: number;
  sonarFindingName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SonarFindingService {
  private baseUrl = 'https://localhost:7008/api/SonarFinding';
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<SonarFinding[]> {
    return this.http.get<SonarFinding[]>(this.baseUrl);
  }
  
  getById(id: number): Observable<SonarFinding> {
    return this.http.get<SonarFinding>(`${this.baseUrl}/${id}`);
  }
  
  create(sonarfinding: SonarFinding): Observable<SonarFinding> {
    return this.http.post<SonarFinding>(this.baseUrl, sonarfinding);
  }
  
  update(id: number, sonarfinding: SonarFinding): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, sonarfinding);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
