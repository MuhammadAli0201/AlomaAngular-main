import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientCompleteInfo } from '../models/patient-complete-info';

@Injectable({
  providedIn: 'root'
})
export class PatientCompleteInfoService {
  private apiUrl = 'https://localhost:7008/api/PatientCompleteInfo';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getByPatientId(patientId: string): Observable<PatientCompleteInfo> {
    return this.http.get<PatientCompleteInfo>(`${this.apiUrl}/${patientId}`, {
      headers: this.getAuthHeaders()
    });
  }

  createOrUpdate(info: PatientCompleteInfo): Observable<PatientCompleteInfo> {
    return this.http.post<PatientCompleteInfo>(`${this.apiUrl}`, info, {
      headers: this.getAuthHeaders()
    });
  }
}
