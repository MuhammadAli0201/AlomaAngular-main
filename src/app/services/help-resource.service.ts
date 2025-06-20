import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Define the interface here
export interface Faq {
  id: number;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class HelpResourceService {
  private apiUrl = 'https://localhost:7008/api/HelpResources/faqs';

  constructor(private http: HttpClient) {}

  getFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>(this.apiUrl);
  }

  getFaq(id: number): Observable<Faq> {
    return this.http.get<Faq>(`${this.apiUrl}/${id}`);
  }

  createFaq(faq: Faq): Observable<Faq> {
    return this.http.post<Faq>(this.apiUrl, faq);
  }

  updateFaq(id: number, faq: Faq): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, faq);
  }

  deleteFaq(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
