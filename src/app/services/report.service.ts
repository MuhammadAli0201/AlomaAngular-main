import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ReportDto } from '../models/report-dto';
import { MortalityReportDto } from '../models/mortality-report-dto';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl: string = "https://localhost:7008/api/Report"

  constructor(private http: HttpClient) { }

  async getOutcomeReport(dateListDTO: Date[], category: string | null = null): Promise<ReportDto> {
    return await firstValueFrom(this.http.post<ReportDto>(`${this.baseUrl}/outcome`,
      {dates: dateListDTO, category}, {
      headers: this.getAuthHeaders()
    }));
  }

  async getSepsisReport(dateListDTO: Date[], category: string | null = null): Promise<ReportDto> {
    return await firstValueFrom(this.http.post<ReportDto>(`${this.baseUrl}/sepsis`,
      {dates: dateListDTO, category}, {
      headers: this.getAuthHeaders()
    }));
  }

  async getMortalityReport(year: number): Promise<MortalityReportDto> {
    return await firstValueFrom(this.http.get<MortalityReportDto>(`${this.baseUrl}/mortality/${year}`, {headers: this.getAuthHeaders()}));
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
