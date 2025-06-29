import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = 'https://localhost:7008/api/file/';

  constructor(private http: HttpClient) {}

  async uploadFile(formData: FormData) {
    return await firstValueFrom(this.http.post<string>(`${this.apiUrl}/upload`, formData));
  }
}
