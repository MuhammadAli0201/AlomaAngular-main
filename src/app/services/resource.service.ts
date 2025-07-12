import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelpResource } from '../models/help-resource';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  private apiUrl = 'https://localhost:7008/api/HelpResource';

  constructor(private http: HttpClient) {}

  getHelpResources(): Observable<HelpResource[]> {
    return this.http.get<HelpResource[]>(this.apiUrl);
  }

  getHelpResource(id: number): Observable<HelpResource> {
    return this.http.get<HelpResource>(`${this.apiUrl}/${id}`);
  }

  getHelpResourceByType(type: string): Observable<HelpResource[]> {
    return this.http.get<HelpResource[]>(`${this.apiUrl}/type/${type}`);
  }

  createHelpResource(helpResource: HelpResource): Observable<HelpResource> {
    return this.http.post<HelpResource>(this.apiUrl, helpResource);
  }

  uploadHelpResourceFile(formData: FormData): Observable<HelpResource> {
    return this.http.post<HelpResource>(this.apiUrl+'/upload-resource', formData);
  }

  updateHelpResource(id: number, helpResource: HelpResource): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, helpResource);
  }

  deleteHelpResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
