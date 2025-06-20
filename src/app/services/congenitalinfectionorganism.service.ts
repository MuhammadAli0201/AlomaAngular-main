import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CongenitalInfectionOrganism {
  congenitalInfectionOrganismID: number;
  congenitalInfectionOrganismName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CongenitalInfectionOrganismService {
  private baseUrl = 'https://localhost:7008/api/CongenitalInfectionOrganism';
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<CongenitalInfectionOrganism[]> {
    return this.http.get<CongenitalInfectionOrganism[]>(this.baseUrl);
  }
  
  getById(id: number): Observable<CongenitalInfectionOrganism> {
    return this.http.get<CongenitalInfectionOrganism>(`${this.baseUrl}/${id}`);
  }
  
  create(congenitalinfectionorganism: CongenitalInfectionOrganism): Observable<CongenitalInfectionOrganism> {
    return this.http.post<CongenitalInfectionOrganism>(this.baseUrl, congenitalinfectionorganism);
  }
  
  update(id: number, congenitalinfectionorganism: CongenitalInfectionOrganism): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, congenitalinfectionorganism);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
