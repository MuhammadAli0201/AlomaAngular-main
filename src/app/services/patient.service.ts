import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private baseUrl: string = "https://localhost:7008/api/Patient"

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, patient, {
      headers: this.getAuthHeaders()
    });
  }

  getAllPatients(): Observable<any[]> {
    return this.http.get<Patient[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getPatientsByAdmissionMonth(month: number): Observable<any[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/admission-month/${month}`, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getPatientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  search(text: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/search/${text}`, {
      headers: this.getAuthHeaders()
    })
  }

  rejectPatient(id: string, rejectComments: string): Observable<any> {
    const params = new HttpParams().set('rejectComments', rejectComments);
    return this.http.get(`${this.baseUrl}/reject/${id}`, { params, headers: this.getAuthHeaders() });
  }

  // 2. Accept Patient
  acceptPatient(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/accept/${id}`, {headers: this.getAuthHeaders()});
  }

  // 3. Mark as Complete
  markAsComplete(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/mark-as-complete/${id}`, {headers: this.getAuthHeaders()});
  }
}
