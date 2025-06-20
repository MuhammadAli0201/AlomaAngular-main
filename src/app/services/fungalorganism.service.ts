import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FungalOrganism {
  fungalOrganismID: number;
  fungalOrganismName: string;
}

@Injectable({
  providedIn: 'root'
})
export class FungalOrganismService {
  private baseUrl = 'https://localhost:7008/api/FungalOrganism';
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<FungalOrganism[]> {
    return this.http.get<FungalOrganism[]>(this.baseUrl);
  }
  
  getById(id: number): Observable<FungalOrganism> {
    return this.http.get<FungalOrganism>(`${this.baseUrl}/${id}`);
  }
  
  create(fungalOrganism: FungalOrganism): Observable<FungalOrganism> {
    return this.http.post<FungalOrganism>(this.baseUrl, fungalOrganism);
  }
  
  update(id: number, fungalOrganism: FungalOrganism): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, fungalOrganism);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
