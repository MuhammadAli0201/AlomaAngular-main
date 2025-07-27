import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LookupItems } from '../models/lookup-items';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  private baseUrl = 'https://localhost:7008/api/Lookup';
  constructor(private http: HttpClient) {}

  async getByCategoryId(id: string): Promise<LookupItems[]> {
    return await firstValueFrom(
      this.http.get<LookupItems[]>(`${this.baseUrl}/${id}`)
    );
  }
}
