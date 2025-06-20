import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Organism {
  organismID: number;
  organismName: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganismService {
  private baseUrl = 'https://localhost:7008/api/Organism';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Organism[]> {
    return this.http.get<Organism[]>(this.baseUrl);
  }

  getById(id: number): Observable<Organism> {
    return this.http.get<Organism>(`${this.baseUrl}/${id}`);
  }

  create(organism: Organism): Observable<Organism> {
    return this.http.post<Organism>(this.baseUrl, organism);
  }

  update(id: number, organism: Organism): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, organism);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
